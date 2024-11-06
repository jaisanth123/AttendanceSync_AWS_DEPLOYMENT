const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  rollNo: { type: String, alias: 'ROLL NO' },
  name: { type: String, alias: 'NAME' },
  hostellerDayScholar: { type: String, alias: 'HOSTELLER/DAYSCHOLAR' },
  gender: { type: String, alias: 'GENDER' },
  year: { type: String, alias: 'YEAR' },
  branch: { type: String, alias: 'BRANCH' },
  section: { type: String, alias: 'SECTION' },
  parentMobileNo: { type: String, alias: 'ParentMobileNo' },
  studentMobileNo: { type: String, alias: 'StudentMobileNo' }
}, { collection: 'sample' });

// Export the model
module.exports = mongoose.model('sample', studentSchema);
