import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useAuth } from '../AuthContext';
import '../assets/styles/TeacherDashboard.css';

Modal.setAppElement('#root');

const TeacherDashboard = () => {
  const { authAxios } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [newClass, setNewClass] = useState({
    start_time: '',
    duration: '',
    room_id: '',
    recurring: false,
    end_date: ''
  });
  const [rooms, setRooms] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attendanceChanges, setAttendanceChanges] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await authAxios.get('/api/teacher/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await authAxios.get('/api/data/rooms');
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchCourses();
    fetchRooms();
  }, [authAxios]);

  const handleCourseSelect = async (courseId) => {
    setSelectedCourse(courseId);

    try {
      const [classesResponse, studentsResponse] = await Promise.all([
        authAxios.get(`/api/teacher/courses/${courseId}/classes`),
        authAxios.get(`/api/teacher/courses/${courseId}/students`)
      ]);

      setClasses(classesResponse.data);
      setStudents(studentsResponse.data);
      setAttendanceRecords([]);

      const attendancePromises = classesResponse.data.map(classItem =>
        authAxios.get(`/api/teacher/classes/${classItem.id}/attendance`)
      );
      const attendanceResponses = await Promise.all(attendancePromises);
      const allAttendanceRecords = attendanceResponses.map(res => res.data).flat();
      setAttendanceRecords(allAttendanceRecords);
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };

  const handleNewClassChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewClass(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddClass = async () => {
    const { start_time, duration, room_id, recurring, end_date } = newClass;
    const course_id = selectedCourse;

    try {
      if (recurring) {
        let startDate = new Date(start_time);
        let endDate = new Date(end_date);

        while (startDate <= endDate) {
          await authAxios.post('/api/teacher/add-classes', { course_id, room_id, start_time: startDate.toISOString(), duration });
          startDate.setDate(startDate.getDate() + 7);
        }
      } else {
        await authAxios.post('/api/teacher/add-classes', { course_id, room_id, start_time: new Date(start_time).toISOString(), duration });
      }
      setIsModalOpen(false);
      handleCourseSelect(selectedCourse); // Refresh classes
    } catch (error) {
      console.error('Error adding class:', error);
    }
  };

  const handleDeleteClass = async (classId) => {
    try {
      await authAxios.delete(`/api/teacher/delete-classes/${classId}`);
      handleCourseSelect(selectedCourse);
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const handleAttendanceChange = (classId, studentId, status) => {
    setAttendanceChanges(prev => ({
      ...prev,
      [`${classId}-${studentId}`]: status
    }));
  };

  const handleSaveAttendance = async () => {
    try {
      const promises = Object.entries(attendanceChanges).map(async ([key, status]) => {
        const [classId, studentId] = key.split('-');
        const attendanceRecord = attendanceRecords.find(record => record.class_id === parseInt(classId) && record.student_id === parseInt(studentId));

        if (attendanceRecord) {
          await authAxios.put(`/api/teacher/classes-update-attendance/${classId}/attendance/${attendanceRecord.id}`, { status });
        } else {
          await authAxios.post(`/api/teacher/classes-add-attendance/${classId}/attendance`, { class_id: classId, student_id: studentId, status });
        }
      });

      await Promise.all(promises);
      setAttendanceChanges({});
      handleCourseSelect(selectedCourse);
    } catch (error) {
      console.error('Error saving attendance records:', error);
    }
  };

  const openModal = () => {
    setNewClass({ start_time: '', duration: '', room_id: '', recurring: false, end_date: '' });
    setIsModalOpen(true);
  };

  return (
    <div className="teacher-dashboard">
      <h2>Welcome</h2>
      <div className="dashboard-grid">
        <div className="course-column">
          <h3>Your Courses</h3>
          <ul>
            {courses.map(course => (
              <li key={course.id} onClick={() => handleCourseSelect(course.id)}>
                {course.name}
              </li>
            ))}
          </ul>
        </div>

        {selectedCourse && (
          <>
            <div className="class-column">
              <h3>Classes for {courses.find(course => course.id === selectedCourse)?.name}</h3>
              <button onClick={openModal}>Add Class</button>
              <ul>
                {classes.map(classItem => (
                  <li key={classItem.id}>
                    {new Date(classItem.start_time).toLocaleString()} - Room: {rooms.find(room => room.id === classItem.room_id)?.name}
                    <button onClick={() => handleDeleteClass(classItem.id)}>Delete</button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="students-attendance-column">
              <h3>Students and Attendance Records</h3>
              <div className="scrollable-table">
                <table>
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      {classes.map(classItem => (
                        <th key={classItem.id}>{new Date(classItem.start_time).toLocaleDateString()}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        {classes.map(classItem => {
                          const attendance = attendanceRecords.find(record => record.class_id === classItem.id && record.student_id === student.id);
                          const currentStatus = attendance ? attendance.status : 'N/A';
                          const changeKey = `${classItem.id}-${student.id}`;

                          return (
                            <td key={classItem.id}>
                              <select
                                value={attendanceChanges[changeKey] || currentStatus}
                                onChange={(e) => handleAttendanceChange(classItem.id, student.id, e.target.value)}
                              >
                                <option value="Present">Present</option>
                                <option value="Absent">Absent</option>
                                <option value="N/A">N/A</option>
                              </select>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button onClick={handleSaveAttendance}>Save Attendance</button>
            </div>
          </>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Add New Class</h2>
        <form>
          <label>
            Start Time:
            <input type="datetime-local" name="start_time" value={newClass.start_time} onChange={handleNewClassChange} required />
          </label>
          <label>
            Duration (minutes):
            <input type="number" name="duration" value={newClass.duration} onChange={handleNewClassChange} required />
          </label>
          <label>
            Room:
            <select name="room_id" value={newClass.room_id} onChange={handleNewClassChange} required>
              <option value="">Select Room</option>
              {rooms.map(room => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </select>
          </label>
          <label>
            Recurring:
            <input type="checkbox" name="recurring" checked={newClass.recurring} onChange={handleNewClassChange} />
          </label>
          {newClass.recurring && (
            <label>
              End Date:
              <input type="date" name="end_date" value={newClass.end_date} onChange={handleNewClassChange} required />
            </label>
          )}
          <button type="button" onClick={handleAddClass}>
            Add Class
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default TeacherDashboard;
