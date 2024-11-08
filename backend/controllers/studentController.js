const Student = require('../models/Student');


// Controller function to get roll numbers and names by year, branch, and section
exports.getRollNumbersByCriteria = async (req, res) => {
    const { yearOfStudy, branch, section } = req.query;

    // Ensure that all query parameters are provided
    if (!yearOfStudy || !branch || !section) {
        return res.status(400).json({ message: "Please provide yearOfStudy, branch, and section" });
    }

    console.log("Query Parameters:", { yearOfStudy, branch, section });

    try {
        // Query the database for students that match the criteria
        const students = await Student.find({
            yearOfStudy: yearOfStudy,   // Ensure this matches the field name in the DB
            branch: branch,      // Ensure this matches the field name in the DB
            section: section     // Ensure this matches the field name in the DB
        }).select('rollNo name -_id');   // Retrieve rollNo and name fields, excluding _id

        console.log("Students Found:", students);

        if (students.length === 0) {
            return res.status(404).json({ message: "No students found matching the criteria" });
        }

        // Sort students by roll number based on the numeric part (ignoring prefix if any)
        students.sort((a, b) => {
            const numA = parseInt(a.rollNo.replace(/[^0-9]/g, ''), 10);
            const numB = parseInt(b.rollNo.replace(/[^0-9]/g, ''), 10);
            return numA - numB;
        });

        // Return the sorted list of students with both roll numbers and names
        res.json({ students });
    } catch (error) {
        console.error("Error retrieving roll numbers and names:", error);
        res.status(500).json({ message: "Server error" });
    }
};

