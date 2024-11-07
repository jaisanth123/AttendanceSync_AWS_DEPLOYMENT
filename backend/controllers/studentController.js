const Student = require('../models/Student');

// Controller function to get roll numbers by year, branch, and section
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
        }).select('rollNo -_id');   // Only retrieve the rollNo field, excluding _id

        console.log("Students Found:", students);

        if (students.length === 0) {
            return res.status(404).json({ message: "No students found matching the criteria" });
        }

        // Map over the students array to extract the roll numbers
        const rollNumbers = students.map(student => student.rollNo);

        // Sort the roll numbers as numeric values (ignoring the prefix '23ADR')
        rollNumbers.sort((a, b) => {
            // Extract the numeric part of the roll number
            const numA = parseInt(a.replace(/[^0-9]/g, ''), 10);
            const numB = parseInt(b.replace(/[^0-9]/g, ''), 10);
            return numA - numB;
        });

        // Return the sorted roll numbers
        res.json({ rollNumbers });
    } catch (error) {
        console.error("Error retrieving roll numbers:", error);
        res.status(500).json({ message: "Server error" });
    }
};
