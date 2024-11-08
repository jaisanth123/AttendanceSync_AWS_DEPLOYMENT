const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

// Controller to generate message of absent students
exports.generateAbsentStudentsMessage = async (req, res) => {
    const { yearOfStudy, branch, section, date } = req.query;

    try {
        // Step 1: Fetch all students in the specified year, branch, and section
        const allStudents = await Student.find({ yearOfStudy, branch, section }).select('rollNo name');

        // Step 2: Fetch attendance records for the specified date, year, branch, and section
        const attendanceRecords = await Attendance.find({ date, yearOfStudy, branch, section });

        // Step 3: Ensure each student has a record in the attendance collection
        const studentsWithAttendance = attendanceRecords.map(record => record.rollNo);
        const missingRecords = allStudents.filter(student => !studentsWithAttendance.includes(student.rollNo));

        // If there are missing attendance records, return an error message
        if (missingRecords.length > 0) {
            // Sort the missing records by rollNo in ascending order
            missingRecords.sort((a, b) => {
                const numA = parseInt(a.rollNo.replace(/\D/g, '')); // Extract numeric part
                const numB = parseInt(b.rollNo.replace(/\D/g, ''));
                return numA - numB; // Compare numeric values
            });

            return res.status(400).json({
                message: "Not all students have attendance records for the specified day.",
                missingStudents: missingRecords.map(student => ({ rollNo: student.rollNo, name: student.name }))
            });
        }

        // Step 4: Identify absent students
        const absentStudents = attendanceRecords
            .filter(record => record.status === 'Absent')
            .map(record => {
                const student = allStudents.find(student => student.rollNo === record.rollNo);
                return { rollNo: record.rollNo, name: student.name };
            });

        // Step 5: Generate and send the message
        // Prepare the message header and student details for the response
        let messageHeader = `Absent students for ${date} in ${yearOfStudy} ${branch} ${section}:`;
        let absentDetails = absentStudents.map(student => `Roll No: ${student.rollNo}, Name: ${student.name}`).join('\n');

        // Send the response with message and details
        res.json({
            message: messageHeader,
            details: absentDetails
        });

        // Step 6: Lock the attendance for this date, year, branch, and section
        await Attendance.updateMany(
            { date, yearOfStudy, branch, section },
            { locked: true }
        );

        console.log(`Attendance locked for ${yearOfStudy} ${branch} ${section} on ${date}`);

    } catch (error) {
        console.error("Error generating absent students message:", error);
        res.status(500).json({ message: "Error generating absent students message" });
    }
};


//Generate content for Hostel Gmail Report
// Convert Roman numeral to integer
const romanToInt = (roman) => {
    const romanNumerals = {
        'I': 1,
        'II': 2,
        'III': 3,
        'IV': 4
    };
    return romanNumerals[roman] || 0; // Default to 0 if not a valid Roman numeral
};

// Function to check if all students have attendance marked
const checkAllStudentsAttendance = async (yearOfStudy, date) => {
    const allStudents = await Student.find({ yearOfStudy }).select('rollNo');
    const attendanceRecords = await Attendance.find({ date, yearOfStudy }).select('rollNo');

    const allStudentsRollNumbers = allStudents.map(student => student.rollNo);
    const markedAttendanceRollNumbers = attendanceRecords.map(record => record.rollNo);

    // Check if all students have an attendance record for the date
    return allStudentsRollNumbers.every(rollNo => markedAttendanceRollNumbers.includes(rollNo));
};

// Controller to generate a list of absent male students
exports.generateAbsentMaleStudents = async (req, res) => {
    const { yearOfStudy, hostellerDayScholar, date } = req.query;

    try {
        // Check if all students of the specified year have attendance marked
        const allStudentsAttendanceMarked = await checkAllStudentsAttendance(yearOfStudy, date);
        if (!allStudentsAttendanceMarked) {
            return res.status(400).json({ message: 'Not all students have their attendance marked for this date.' });
        }

        // Fetch male students based on the criteria (hostellerDayScholar and yearOfStudy)
        const allStudents = await Student.find({
            yearOfStudy,
            gender: 'MALE',
            //hostellerDayScholar: 'HOSTELLER',
            hostellerDayScholar: { $in: ['HOSTELLER', 'HOSTELER'] }
        }).select('rollNo name yearOfStudy gender hostellerDayScholar');

        // Fetch attendance records for the specified date and filter for 'Absent' status
        const attendanceRecords = await Attendance.find({ date, status: 'Absent' }).select('rollNo');

        // Filter out the students who are absent
        const absentStudents = allStudents.filter(student =>
            attendanceRecords.some(record => record.rollNo === student.rollNo)
        );

        // Sort the students by yearOfStudy and rollNo
        absentStudents.sort((a, b) => {
            const numA = romanToInt(a.yearOfStudy);
            const numB = romanToInt(b.yearOfStudy);

            if (numA === numB) {
                const rollNoA = parseInt(a.rollNo.replace(/\D/g, ''));
                const rollNoB = parseInt(b.rollNo.replace(/\D/g, ''));
                return rollNoA - rollNoB;
            }
            return numA - numB;
        });

        // Prepare the response message with roll number, name, and year of study
        const absentDetails = absentStudents.map(student => ({
            rollNo: student.rollNo,
            name: student.name,
            yearOfStudy: student.yearOfStudy
        }));

        if (absentStudents.length === 0) {
            return res.status(404).json({ message: 'No absent male students found for the specified criteria.' });
        }

        res.json({
            message: `Absent male students for ${date} based on criteria (Hosteller: HOSTELLER):`,
            absentStudents: absentDetails
        });

    } catch (error) {
        console.error("Error generating absent male students list:", error);
        res.status(500).json({ message: 'Error generating absent students list' });
    }
};

// Controller to generate a list of absent female students
exports.generateAbsentFemaleStudents = async (req, res) => {
    const { yearOfStudy, hostellerDayScholar, date } = req.query;

    try {
        // Check if all students of the specified year have attendance marked
        const allStudentsAttendanceMarked = await checkAllStudentsAttendance(yearOfStudy, date);
        if (!allStudentsAttendanceMarked) {
            return res.status(400).json({ message: 'Not all students have their attendance marked for this date.' });
        }

        // Fetch female students based on the criteria (hostellerDayScholar and yearOfStudy)
        const allStudents = await Student.find({
            yearOfStudy,
            gender: 'FEMALE',
            //hostellerDayScholar: 'HOSTELLER',
            hostellerDayScholar: { $in: ['HOSTELLER', 'HOSTELER'] }
        }).select('rollNo name yearOfStudy gender hostellerDayScholar');

        // Fetch attendance records for the specified date and filter for 'Absent' status
        const attendanceRecords = await Attendance.find({ date, status: 'Absent' }).select('rollNo');

        // Filter out the students who are absent
        const absentStudents = allStudents.filter(student =>
            attendanceRecords.some(record => record.rollNo === student.rollNo)
        );

        // Sort the students by yearOfStudy and rollNo
        absentStudents.sort((a, b) => {
            const numA = romanToInt(a.yearOfStudy);
            const numB = romanToInt(b.yearOfStudy);

            if (numA === numB) {
                const rollNoA = parseInt(a.rollNo.replace(/\D/g, ''));
                const rollNoB = parseInt(b.rollNo.replace(/\D/g, ''));
                return rollNoA - rollNoB;
            }
            return numA - numB;
        });

        // Prepare the response message with roll number, name, and year of study
        const absentDetails = absentStudents.map(student => ({
            rollNo: student.rollNo,
            name: student.name,
            yearOfStudy: student.yearOfStudy
        }));

        if (absentStudents.length === 0) {
            return res.status(404).json({ message: 'No absent female students found for the specified criteria.' });
        }

        res.json({
            message: `Absent female students for ${date} based on criteria (Hosteller: HOSTELLER):`,
            absentStudents: absentDetails
        });

    } catch (error) {
        console.error("Error generating absent female students list:", error);
        res.status(500).json({ message: 'Error generating absent students list' });
    }
};


