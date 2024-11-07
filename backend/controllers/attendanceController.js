const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

// 1. Mark students as "On Duty"
exports.markOnDuty = async (req, res) => {
  const { rollNumbers, date, yearOfStudy, branch, section } = req.body;

  try {
    const attendanceRecords = rollNumbers.map(rollNo => ({
      rollNo,
      date,
      status: 'On Duty',
      yearOfStudy,
      branch,
      section
    }));

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
    const allStudents = await Student.find({ yearOfStudy, branch, section }).select('rollNo name');
    
    // Fetch roll numbers of students marked as "On Duty" on the specified date
    const onDutyRollNumbers = await Attendance.find({ date, status: 'On Duty', yearOfStudy, branch, section }).select('rollNo');

    // Filter to get students not marked as "On Duty"
    const remainingStudents = allStudents.filter(student =>
      !onDutyRollNumbers.some(record => record.rollNo === student.rollNo)
    );

    // Sort the remaining students by roll number in ascending order (numeric part only)
    remainingStudents.sort((a, b) => {
      const numA = parseInt(a.rollNo.replace(/[^0-9]/g, ''), 10);
      const numB = parseInt(b.rollNo.replace(/[^0-9]/g, ''), 10);
      return numA - numB;
    });

    // Respond with the sorted remaining students
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
    const absentRecords = rollNumbers.map(rollNo => ({
      rollNo,
      date,
      status: 'Absent',
      yearOfStudy,
      branch,
      section
    }));

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

    // Fetch roll numbers from attendance records marked as "Absent" or "On Duty"
    const markedAttendance = await Attendance.find({
      date,
      yearOfStudy,
      branch,
      section,
      status: { $in: ['Absent', 'On Duty'] }
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
      section
    }));

    // Insert "Present" records for the remaining students
    await Attendance.insertMany(presentRecords);
    
    res.json({ message: 'Marked remaining students as Present', markedAsPresent: presentRecords.length });
  } catch (error) {
    console.error("Error marking remaining students as Present:", error);
    res.status(500).json({ message: 'Error marking remaining students as Present' });
  }
};
