import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../assets/styles/StudentDashboard.css';

const StudentDashboard = () => {
  const { user, authAxios } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [classes, setClasses] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [classDetails, setClassDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await authAxios.get('/api/student/courses');
        console.log('Fetched courses:', response.data);
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching student courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [authAxios]);

  const handleCourseSelect = async (courseId) => {
    setSelectedCourse(courseId);
    setSelectedDate(null);
    setClassDetails(null);
    try {
      const classesResponse = await authAxios.get(`/api/student/course/${courseId}/classes`);
      console.log('Fetched classes for course:', classesResponse.data);
      setClasses(classesResponse.data);

      const attendanceResponse = await authAxios.get(`/api/student/course/${courseId}/attendance`);
      console.log('Fetched attendance records for course:', attendanceResponse.data);
      setAttendanceRecords(attendanceResponse.data);
    } catch (error) {
      console.error('Error fetching classes or attendance records:', error);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const classForDate = classes.find(classItem => 
      new Date(classItem.start_time).toDateString() === date.toDateString()
    );
    setClassDetails(classForDate);
  };

  const handleCheckIn = async () => {
    if (!classDetails) return;

    const currentTime = new Date();
    const classStartTime = new Date(classDetails.start_time);
    const classEndTime = new Date(classDetails.end_time);

    if (currentTime < classStartTime || currentTime > classEndTime) {
      alert("You can only check in during the class time.");
      return;
    }

    try {
      await authAxios.post(`/api/student/course/${selectedCourse}/class/${classDetails.id}/checkin`);
      alert("Checked in successfully!");

      const attendanceResponse = await authAxios.get(`/api/student/course/${selectedCourse}/attendance`);
      setAttendanceRecords(attendanceResponse.data);
    } catch (error) {
      console.error('Error checking in:', error);
      alert("Check-in failed.");
    }
  };

  const getClassDates = () => {
    const dates = classes.map(classItem => new Date(classItem.start_time));
    console.log('Class dates:', dates);
    return dates;
  };

  const classDates = getClassDates();

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (classDates.some(d => d.toDateString() === date.toDateString())) {
        return 'highlight';
      }
    }
    return null;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="student-dashboard">
      <h2>Student Dashboard</h2>
      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <div>
          <ul className="course-list">
            {courses.map(course => (
              <li key={course.id} onClick={() => handleCourseSelect(course.id)}>
                {course.name}
              </li>
            ))}
          </ul>
          {selectedCourse && (
            <div className="selected-course">
              <h3>Classes for {courses.find(course => course.id === selectedCourse)?.name}</h3>
              <div className="calendar-container">
                <Calendar
                  onClickDay={handleDateSelect}
                  tileClassName={tileClassName}
                />
              </div>
              {selectedDate && classDetails && (
                <div className="class-details">
                  <h4>Class Details</h4>
                  <p>Date: {selectedDate.toDateString()}</p>
                  <p>Time: {new Date(classDetails.start_time).toLocaleTimeString()} - {new Date(classDetails.end_time).toLocaleTimeString()}</p>
                  <p>Room: {classDetails.room_id}</p>
                  <button onClick={handleCheckIn}>Check In</button>
                </div>
              )}
              <h4>Attendance Records</h4>
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map(record => {
                    const startTime = new Date(record.Class.start_time);
                    const endTime = new Date(record.Class.end_time);
                    return (
                      <tr key={record.id}>
                        <td>{!isNaN(startTime) ? startTime.toDateString() : 'Invalid Date'}</td>
                        <td>{!isNaN(startTime) ? startTime.toLocaleTimeString() : 'Invalid Date'}</td>
                        <td>{!isNaN(endTime) ? endTime.toLocaleTimeString() : 'Invalid Date'}</td>
                        <td>{record.status}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
 