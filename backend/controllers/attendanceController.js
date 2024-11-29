const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");

// 1. Mark students as "On Duty"
exports.markOnDuty = async (req, res) => {
  const { rollNumbers, date, yearOfStudy, branch, section } = req.body;

  console.log(rollNumbers, date, yearOfStudy, branch, section);
  try {
    // Array to track roll numbers that are already marked
  
    // Create new On Duty records for the roll numbersd
    const result = await Attendance.updateMany(
      {
        rollNo: { $in: rollNumbers }, // Match roll numbers in the provided array
        date,                        // Match the specified date
        yearOfStudy,                 // Match the year of study
        branch,                      // Match the branch
        section,                     // Match the section
        status: 'Absent',            // Only update records marked as "Absent"
      },
      {
        $set: { status: 'On Duty' }, // Set the status to "On Duty"
      }
    );
    res.json({ message: 'Marked as On Duty successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error marking as On Duty' });
  }
};


// 2. Fetch Remaining Students (those not marked as "On Duty")


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

      // If attendance records and students are identical, send the message that attendance has already been marked
      const allRollNumbers = allStudents.map(student => student.rollNo);
      const attendedRollNumbers = attendanceRecords.map(record => record.rollNo);

      // Check if the attendance records cover all students and are the same
      if (allRollNumbers.length === attendedRollNumbers.length && 
          allRollNumbers.every(rollNo => attendedRollNumbers.includes(rollNo))) {
          return res.status(200).json({ message: "Attendance has already been marked for all students." });
      }

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

// 3. Mark students as "Absent"
exports.markAbsent = async (req, res) => {
  const { rollNumbers, date, yearOfStudy, branch, section } = req.body;

  console.log(rollNumbers, date, yearOfStudy, branch, section);
  try {
    // Iterate over each roll number

    // Create new absent records for the roll numbers
    const absentRecords = rollNumbers.map(rollNo => ({
      rollNo,
      date,
      status: 'Absent',
      yearOfStudy,
      branch,
      section,
      locked: false
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
      locked:false
    }));

    // Array to track roll numbers with existing attendance


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

  if (!toEmails) {
    return res.status(400).send({ message: "No email addresses provided" });
  }

  const emailList = toEmails.split(",").map((email) => email.trim()); // Split and trim emails

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vijayakanthm.23aim@kongu.edu", // Replace with your email
      pass: "bebg srbb qojy nydn", // Replace with your app-specific password
    },
  });

  const mailOptions = {
    from: "vijayakanthm.23aim@kongu.edu", // Replace with your email
    bcc: emailList, // Use BCC for all recipients
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