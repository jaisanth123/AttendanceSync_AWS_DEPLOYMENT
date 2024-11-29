const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

// Controller function to fetch students without attendance on a specified date
exports.fetchRemainingStudents = async (req, res) => {
  const { yearOfStudy, branch, section, date } = req.query;

  try {
    // Fetch roll numbers of students marked as "Absent" on the specified date
    const absentStudents = await Attendance.find({ 
      date, 
      status: 'Absent', // Fetch students marked as "Absent"
      yearOfStudy, 
      branch, 
      section 
    }).select('rollNo -_id');

    // Extract roll numbers from the absent students
    const rollNumbers = absentStudents.map(student => student.rollNo);

    // Fetch the names of the students corresponding to these roll numbers
    const studentsWithNames = await Student.find({
      rollNo: { $in: rollNumbers } // Match roll numbers from Attendance
    }).select('rollNo name -_id');

    // Sort the students by roll number (numeric part only)
    studentsWithNames.sort((a, b) => {
      const numA = parseInt(a.rollNo.replace(/[^0-9]/g, ''), 10);
      const numB = parseInt(b.rollNo.replace(/[^0-9]/g, ''), 10);
      return numA - numB;
    });

    // Respond with the sorted students including both rollNo and name
    res.json({ 
      students: studentsWithNames 
    });
    
  } catch (error) {
    console.error("Error fetching remaining students:", error);
    res.status(500).json({ message: 'Error fetching remaining students' });
  }
};
