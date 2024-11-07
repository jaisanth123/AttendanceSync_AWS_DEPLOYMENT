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

    } catch (error) {
        console.error("Error generating absent students message:", error);
        res.status(500).json({ message: "Error generating absent students message" });
    }
};
