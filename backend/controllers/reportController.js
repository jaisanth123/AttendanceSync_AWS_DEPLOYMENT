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
// Helper function to convert Roman numerals to integers for sorting
const romanToInt = (roman) => {
    const romanNumerals = {
        'I': 1,
        'II': 2,
        'III': 3,
        'IV': 4
    };
    return romanNumerals[roman] || 0; // Return 0 if invalid Roman numeral
};

const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const reportDir = path.join(__dirname,'..', 'reports'); // Adjust the path if needed

// Ensure the directory exists
if (!fs.existsSync(reportDir)) {
    console.log('Report directory does not exist. Creating directory:', reportDir);
    fs.mkdirSync(reportDir);
} else {
    console.log('Report directory already exists:', reportDir);
}

// Controller to generate the absent students report
exports.handleAbsentStudentsReport = async (gender, req, res) => {
    const { date } = req.query; // Extract date from query parameters
    console.log('Request received to generate report for gender:', gender, 'and date:', date);

    try {
        // Fetch all students of the specified gender
        console.log('Fetching all students with gender:', gender);
        const allStudents = await Student.find({ gender }).select('rollNo name yearOfStudy branch section');
        console.log('Total students fetched:', allStudents.length);

        // Fetch attendance records for the specified date (only absent students)
        console.log('Fetching attendance records for date:', date);
        const attendanceRecords = await Attendance.find({ date, status: 'Absent' }).select('rollNo');
        console.log('Total attendance records fetched for absent students:', attendanceRecords.length);

        // Filter students who were absent on the given date
        const absentStudents = allStudents.filter(student =>
            attendanceRecords.some(record => record.rollNo === student.rollNo)
        );
        console.log('Absent Students:', absentStudents);

        // If no absent students found, return a 404 error
        if (absentStudents.length === 0) {
            console.log(`No absent ${gender.toLowerCase()} students found for ${date}.`);
            return res.status(404).json({ message: `No absent ${gender.toLowerCase()} students found for ${date}.` });
        }

        // Sort absent students by yearOfStudy (Roman numeral order) and then by rollNo
        console.log('Sorting absent students by yearOfStudy and rollNo');
        absentStudents.sort((a, b) => {
            const yearA = romanToInt(a.yearOfStudy);
            const yearB = romanToInt(b.yearOfStudy);
            if (yearA === yearB) {
                const rollNoA = parseInt(a.rollNo.replace(/\D/g, '')); // Extract numeric part of rollNo
                const rollNoB = parseInt(b.rollNo.replace(/\D/g, ''));
                return rollNoA - rollNoB; // Sort by rollNo if yearOfStudy is the same
            }
            return yearA - yearB; // Sort by yearOfStudy if different
        });
        console.log('Absent students sorted successfully');

        // Prepare data for the Excel report
        const reportData = absentStudents.map((student, index) => ({
            'S.No': index + 1,
            'Roll No': student.rollNo,
            'Student Name': student.name,
            'Year': student.yearOfStudy,
            'Branch': `${student.branch}-${student.section}`
        }));
        console.log('Report data prepared:', reportData);

        // Generate Excel file
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(reportData);
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Absent Students');
        console.log('Excel workbook created');

        // Define file path and name
        const fileName = `${gender}_Absent_Students_${date}.xlsx`;
        const filePath = path.join(reportDir, fileName);

        // Log the file path to verify
        console.log('File path where Excel will be saved:', filePath);

        // Write the workbook to the file and check for errors
        try {
            xlsx.writeFile(workbook, filePath);
            console.log('Excel file created successfully:', filePath);
        } catch (writeError) {
            console.error('Error writing the Excel file:', writeError);
            return res.status(500).json({ message: 'Failed to create the Excel report.' });
        }

        // Return the response with a link to download the report
        console.log(`Absent ${gender.toLowerCase()} students report for ${date} is ready.`);
        res.json({
            message: `Absent ${gender.toLowerCase()} students report for ${date} is ready.`,
            reportLink: `/reports/${fileName}`
        });

    } catch (error) {
        console.error("Error generating report:", error);
        res.status(500).json({ message: 'Error generating absent students report' });
    }
};
