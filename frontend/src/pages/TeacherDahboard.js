import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const TeacherDashboard = () => {
  const { user, authAxios } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await authAxios.get('/api/teacher/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [authAxios]);

  const handleCourseSelect = async (courseId) => {
    setSelectedCourse(courseId);

    try {
      const [classesResponse, studentsResponse, attendanceResponse] = await Promise.all([
        authAxios.get(`/api/teacher/courses/${courseId}/classes`),
        authAxios.get(`/api/teacher/courses/${courseId}/students`),
        authAxios.get(`/api/teacher/courses/${courseId}/attendance`),
      ]);

      setClasses(classesResponse.data);
      setStudents(studentsResponse.data);
      setAttendanceRecords(attendanceResponse.data);
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };

  return (
    <div className="teacher-dashboard">
      <h2>Welcome, {user.name}</h2>
      <h3>Your Courses</h3>
      <ul>
        {courses.map(course => (
            <li key={course.id} onClick={() => handleCourseSelect(course.id)}>
            {course.name}
          </li>
        ))}
      </ul>
      
      {selectedCourse && (
        <>
          <h3>Classes for {courses.find(course => course.id === selectedCourse)?.name}</h3>
          <ul>
            {classes.map(classItem => (
              <li key={classItem.id}>{classItem.name}</li>
            ))}
          </ul>

          <h3>Students in this Course</h3>
          <ul>
            {students.map(student => (
              <li key={student.id}>{student.name}</li>
            ))}
          </ul>

          <h3>Attendance Records</h3>
          <ul>
            {attendanceRecords.map(record => (
              <li key={record.id}>{record.date}: {record.status}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default TeacherDashboard;
