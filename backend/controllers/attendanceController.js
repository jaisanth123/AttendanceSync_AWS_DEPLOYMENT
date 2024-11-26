const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");

// 1. Mark students as "On Duty"
exports.markOnDuty = async (req, res) => {
  const { rollNumbers, date, yearOfStudy, branch, section } = req.body;

  try {
    // Array to track roll numbers that are already marked
    let alreadyMarkedRollNos = [];

    // Iterate over each roll number
    for (let rollNo of rollNumbers) {
      // Check if any record exists for this roll number and date
      const existingRecord = await Attendance.findOne({
        rollNo,
        date
      });

      if (existingRecord) {
        // If a record exists, check if it's locked
        if (existingRecord.locked === true) {
          // If locked, prevent overwriting and return message
          return res.status(400).json({
            message: `Attendance for Roll No: ${rollNo} on ${date} is locked. Cannot overwrite.`
          });
        } else {
          // If not locked, attendance is already marked for this roll number
          alreadyMarkedRollNos.push(rollNo); // Add to already marked list
        }
      }
    }

    // If any roll numbers are already marked, return a response with those roll numbers
    if (alreadyMarkedRollNos.length > 0) {
      return res.status(400).json({
        message: `Attendance is already marked for the following Roll Nos: ${alreadyMarkedRollNos.join(', ')}. Cannot mark as On Duty again.`
      });
    }

    // Create new On Duty records for the roll numbers
    const attendanceRecords = rollNumbers.map(rollNo => ({
      rollNo,
      date,
      status: 'On Duty',
      yearOfStudy,
      branch,
      section,
      locked: true
    }));

    // Insert the new "On Duty" records
    await Attendance.insertMany(attendanceRecords);
    res.json({ message: 'Marked as On Duty successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error marking as On Duty' });
  }
};


// 2. Fetch Remaining Students (those not marked as "On Duty")
exports.fetchRemainingStudents = async (req, res) => {
  const { yearOfStudy, branch, section, date } = req.query;

  try {
    // Fetch all students in the specified year, branch, and section
    const allStudents = await Student.find({ yearOfStudy, branch, section }).select('rollNo name -_id');
    
    // Fetch roll numbers of students marked as either "On Duty" or "Absent" on the specified date
    const excludedRollNumbers = await Attendance.find({ 
      date, 
      status: { $in: ['On Duty', 'Absent'] },  // Only fetch those who are marked as "On Duty" or "Absent"
      yearOfStudy, 
      branch, 
      section 
    }).select('rollNo');

    // Filter out students who are marked as "On Duty" or "Absent"
    const remainingStudents = allStudents.filter(student =>
      !excludedRollNumbers.some(record => record.rollNo === student.rollNo)
    );

    // Sort the remaining students by roll number in ascending order (numeric part only)
    remainingStudents.sort((a, b) => {
      const numA = parseInt(a.rollNo.replace(/[^0-9]/g, ''), 10);
      const numB = parseInt(b.rollNo.replace(/[^0-9]/g, ''), 10);
      return numA - numB;
    });

    // Respond with the sorted remaining students including both rollNo and name
    res.json({ students: remainingStudents });
  } catch (error) {
    console.error("Error fetching remaining students:", error);
    res.status(500).json({ message: 'Error fetching remaining students' });
  }
};


// 3. Mark students as "Absent"
exports.markAbsent = async (req, res) => {
  const { rollNumbers, date, yearOfStudy, branch, section } = req.body;

  try {
    // Iterate over each roll number
    for (let rollNo of rollNumbers) {
      // Check if any record exists for this roll number and date
      const existingRecord = await Attendance.findOne({
        rollNo,
        date
      });

      if (existingRecord) {
        // If a record exists, check if it's locked
        if (existingRecord.locked === true) {
          // If locked, prevent overwriting and return message
          return res.status(400).json({
            message: `Attendance for Roll No: ${rollNo} on ${date} is locked. Cannot overwrite.`
          });
        } else {
          // If not locked, attendance is already marked for this roll number
          return res.status(400).json({
            message: `Attendance for Roll No: ${rollNo} on ${date} is already marked. Cannot mark as Absent again.`
          });
        }
      }
    }

    // Create new absent records for the roll numbers
    const absentRecords = rollNumbers.map(rollNo => ({
      rollNo,
      date,
      status: 'Absent',
      yearOfStudy,
      branch,
      section,
      locked: true
    }));

    // Insert the new "Absent" records
    await Attendance.insertMany(absentRecords);
    res.json({ message: 'Marked as Absent successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error marking as Absent' });
  }
};


// 4. Mark remaining students as "Present"
exports.markRemainingPresent = async (req, res) => {
  const { yearOfStudy, branch, section, date } = req.body;

  try {
    // Fetch all students in the specified year, branch, and section
    const allStudents = await Student.find({ yearOfStudy, branch, section }).select('rollNo');

    // Fetch roll numbers from attendance records marked as "Absent", "On Duty", or "Present" already
    const markedAttendance = await Attendance.find({
      date,
      yearOfStudy,
      branch,
      section,
      status: { $in: ['Absent', 'On Duty', 'Present'] }
    }).select('rollNo');

    // Extract roll numbers from marked attendance records
    const markedRollNumbers = markedAttendance.map(record => record.rollNo);

    // Filter students who are not in the marked roll numbers
    const remainingStudents = allStudents.filter(student => 
      !markedRollNumbers.includes(student.rollNo)
    );

    // Prepare attendance records to mark remaining students as "Present"
    const presentRecords = remainingStudents.map(student => ({
      rollNo: student.rollNo,
      date,
      status: 'Present',
      yearOfStudy,
      branch,
      section,
      locked: true
    }));

    // Array to track roll numbers with existing attendance
    let alreadyMarkedRollNos = [];

    // Check if any record already exists for these roll numbers for the same date
    for (let record of presentRecords) {
      const existingRecord = await Attendance.findOne({
        rollNo: record.rollNo,
        date: record.date
      });

      if (existingRecord) {
        // If a record exists, check if it's locked
        if (existingRecord.locked === true) {
          // If locked, prevent overwriting and return message
          return res.status(400).json({
            message: `Attendance for Roll No: ${record.rollNo} on ${date} is locked. Cannot overwrite.`
          });
        } else {
          // If not locked, attendance is already marked for this roll number
          alreadyMarkedRollNos.push(record.rollNo); // Add to already marked list
        }
      }
    }

    if (alreadyMarkedRollNos.length > 0) {
      return res.status(400).json({
        message: `Attendance is already marked for the following Roll Nos: ${alreadyMarkedRollNos.join(', ')}. Cannot mark as Present again.`
      });
    }

    // Insert the "Present" records for the remaining students
    await Attendance.insertMany(presentRecords);
    
    res.json({ message: 'Marked remaining students as Present', markedAsPresent: presentRecords.length });
  } catch (error) {
    console.error("Error marking remaining students as Present:", error);
    res.status(500).json({ message: 'Error marking remaining students as Present' });
  }
};



// Email sending function
const storage = multer.memoryStorage(); // Store files in memory, not on disk
const upload = multer({ storage: storage });

exports.sendEmail = async (req, res) => {
  const { subject, content, toEmails } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).send({ message: "No file uploaded" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vijayakanthm.23aim@kongu.edu", // Replace with your email
      pass: "bebg srbb qojy nydn", // Replace with your app-specific password
    },
  });

  const mailOptions = {
    from: "vijayakanthm.23aim@kongu.edu", // Replace with your email
    to: toEmails,
    subject: subject,
    text: content,
    attachments: [
      {
        filename: file.originalname, // Use original file name
        content: file.buffer, // Use the file stored in memory
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ message: "Failed to send email" });
  }
};