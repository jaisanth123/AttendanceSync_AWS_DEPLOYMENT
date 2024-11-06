import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import YearMenu from './components/YearMenu';
import AttendancePage from './components/AttendancePage';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<YearMenu />} />
        <Route path="/attendance/on-duty/:section" element={<AttendancePage status="on-duty" />} />
        <Route path="/attendance/absent/:section" element={<AttendancePage status="absent" />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
