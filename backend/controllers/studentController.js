const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

// Controller function to fetch students without attendance on a specified date
exports.getStudentsWithoutAttendance = async (req, res) => {
    const { yearOfStudy, branch, section, date } = req.query;

    // Ensure all required query parameters are provided
    if (!yearOfStudy || !branch || !section || !date) {
        return res.status(400).json({ message: "Please provide yearOfStudy, branch, section, and date" });
    }

    console.log("Query Parameters:", { yearOfStudy, branch, section, date });

    try {
        // Fetch all students in the specified year, branch, and section
        const allStudents = await Student.find({
            yearOfStudy,
            branch,
            section
        }).select('rollNo name -_id'); // Retrieve rollNo and name fields, excluding _id

        console.log("All Students Found:", allStudents);

        // Fetch students who have an attendance record for the specified date
        const attendanceRecords = await Attendance.find({
            date,
            yearOfStudy,
            branch,
            section
        }).select('rollNo'); // Retrieve only the roll numbers of students with attendance records

        console.log("Attendance Records Found:", attendanceRecords);

        // Extract roll numbers of students with attendance records
        const attendedRollNumbers = attendanceRecords.map(record => record.rollNo);

        // Filter students who do not have an attendance record for the specified date
        const studentsWithoutAttendance = allStudents.filter(student =>
            !attendedRollNumbers.includes(student.rollNo)
        );

        // Sort the resulting students by roll number (numeric part only)
        studentsWithoutAttendance.sort((a, b) => {
            const numA = parseInt(a.rollNo.replace(/[^0-9]/g, ''), 10);
            const numB = parseInt(b.rollNo.replace(/[^0-9]/g, ''), 10);
            return numA - numB;
        });

        // Send the filtered roll numbers and the total count of all students
        res.json({
            students: studentsWithoutAttendance.map(student => ({
                rollNo: student.rollNo,
                name: student.name
            })), // Send both rollNo and name
                        totalStudents: allStudents.length // Send the total count of students found
        });
    } catch (error) {
        console.error("Error retrieving students without attendance:", error);
        res.status(500).json({ message: "Server error" });
    }
};