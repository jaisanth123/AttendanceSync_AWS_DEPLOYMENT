import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function AttendancePage({ status }) {
  const [students, setStudents] = useState([]);
  const [selectedRollNos, setSelectedRollNos] = useState([]);
  const { section } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await axios.get(`/api/students/${section}`);
      setStudents(res.data);
    };
    fetchStudents();
  }, [section]);

  const handleSubmit = async () => {
    await axios.post(`/api/attendance/${status}`, { rollNos: selectedRollNos });
    if (status === 'on-duty') {
      navigate(`/attendance/absent/${section}`);
    } else if (status === 'absent') {
      navigate('/dashboard');
    }
  };

  return (
    <div>
      <h2>{status === 'on-duty' ? 'Mark On Duty' : 'Mark Absent'}</h2>
      <ul>
        {students.map(student => (
          <li key={student.rollNo}>
            <input
              type="checkbox"
              onChange={(e) => {
                const rollNo = student.rollNo;
                if (e.target.checked) {
                  setSelectedRollNos(prev => [...prev, rollNo]);
                } else {
                  setSelectedRollNos(prev => prev.filter(r => r !== rollNo));
                }
              }}
            />
            {student.rollNo}
          </li>
        ))}
      </ul>
      <button onClick={handleSubmit}>Confirm</button>
    </div>
  );
}

export default AttendancePage;
