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

async function checkAllStudentsAttendance(yearOfStudy, date) {
    try {
        // Fetch all students in the specified year
        const allStudents = await Student.find({ yearOfStudy }).select('rollNo');

        // Fetch attendance records for the specified date
        const attendanceRecords = await Attendance.find({ date }).select('rollNo');

        // Check if all students have an attendance record for the date
        const allStudentsMarked = allStudents.every(student =>
            attendanceRecords.some(record => record.rollNo === student.rollNo)
        );

        return allStudentsMarked;
    } catch (error) {
        console.error("Error in checkAllStudentsAttendance:", error);
        throw error;
    }
}

const xlsx = require('xlsx');
const path = require('path');
const fs = require('fs');

const reportDir = path.join(__dirname, 'reports');
if (!fs.existsSync(reportDir)) {
  fs.mkdirSync(reportDir);
}
// Helper function to generate Excel file with absent students data
const generateExcelReport = (absentStudentsByYear, fileName) => {
    const workbook = xlsx.utils.book_new();

    Object.keys(absentStudentsByYear).forEach(year => {
        const students = absentStudentsByYear[year];
        const data = students.map((student, index) => ({
            'S.No': index + 1,
            'Roll No': student.rollNo,
            'Student Name': student.name,
            'Year': student.yearOfStudy,
            'Branch': `${student.branch}-${student.section}`
        }));

        // Create a worksheet for each year and add it to the workbook
        const worksheet = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(workbook, worksheet, `Year ${year}`);
    });

    // Define the path to save the Excel file
    const filePath = path.join(__dirname, '..', 'reports', fileName);

    // Write the workbook to the file
    if (Object.keys(absentStudentsByYear).length > 0) {
        xlsx.writeFile(workbook, filePath);
    }
};

// Controller to print and generate Excel report for absent students
exports.handleAbsentStudentsReport = async (gender, req, res) => {
    const { yearOfStudy, hostellerDayScholar, date } = req.query;

    try {
        const allStudentsAttendanceMarked = await checkAllStudentsAttendance(yearOfStudy, date);
        if (!allStudentsAttendanceMarked) {
            return res.status(400).json({ message: 'Not all students have their attendance marked for this date.' });
        }

        const allStudents = await Student.find({
            yearOfStudy,
            gender,
            hostellerDayScholar: { $in: ['HOSTELLER', 'HOSTELER'] }
        }).select('rollNo name yearOfStudy gender hostellerDayScholar branch section');

        const attendanceRecords = await Attendance.find({ date, status: 'Absent' }).select('rollNo');

        const absentStudents = allStudents.filter(student =>
            attendanceRecords.some(record => record.rollNo === student.rollNo)
        );

        if (absentStudents.length === 0) {
            // If no absent students, return a message and skip report generation
            return res.status(404).json({ message: `No absent ${gender.toLowerCase()} students found for the specified criteria.` });
        }

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

        const absentDetails = absentStudents.map(student => ({
            rollNo: student.rollNo,
            name: student.name,
            yearOfStudy: student.yearOfStudy,
            branch: student.branch,
            section: student.section
        }));

        console.log(`Absent ${gender.toLowerCase()} students for ${date}:`);
        absentDetails.forEach((student, index) => {
            console.log(`${index + 1}. Roll No: ${student.rollNo}, Name: ${student.name}, Year: ${student.yearOfStudy}, Branch: ${student.branch}-${student.section}`);
        });

        // Organize data by year for Excel report
        const absentStudentsByYear = absentStudents.reduce((acc, student) => {
            if (!acc[student.yearOfStudy]) acc[student.yearOfStudy] = [];
            acc[student.yearOfStudy].push(student);
            return acc;
        }, {});

        // Adjust file name based on gender
        const fileName = gender === 'MALE' ? `BOYS_Absent_Students_${date}.xlsx` : `GIRLS_Absent_Students_${date}.xlsx`;

        // Generate the Excel report
        generateExcelReport(absentStudentsByYear, fileName);

        // Return a response with the link to download the Excel report
        res.json({
            message: `Absent ${gender.toLowerCase()} students for ${date} based on criteria (Hosteller: HOSTELLER):`,
            absentStudents: absentDetails,
            reportLink: `/reports/${fileName}`
        });

    } catch (error) {
        console.error(`Error generating absent ${gender.toLowerCase()} students list:`, error);
        res.status(500).json({ message: 'Error generating absent students list' });
    }
};
