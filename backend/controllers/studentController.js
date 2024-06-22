const { Student, Group, Course, Class, AttendanceRecord } = require('../models');

const getStudentCourses = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findByPk(studentId, {
      include: {
        model: Group,
        include: {
          model: Course
        }
      }
    });

    if (!student || !student.Group) {
      return res.status(404).json({ error: 'Student or Group not found' });
    }

    const courses = student.Group ? [student.Group.Course] : [];

    res.json(courses);
  } catch (error) {
    console.error('Error fetching student courses:', error);
    res.status(500).json({ error: 'Error fetching student courses' });
  }
};

const getClassesForCourse = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const classes = await Class.findAll({
      where: { course_id: courseId }
    });

    res.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    res.status(500).json({ error: 'Error fetching classes' });
  }
};

const getAttendanceForCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.id;

    const attendanceRecords = await AttendanceRecord.findAll({
      include: [
        {
          model: Class,
          where: { course_id: courseId },
        },
      ],
      where: { student_id: studentId },
      order: [['check_in_time', 'ASC']],
    });

    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    res.status(500).json({ message: 'Failed to fetch attendance records' });
  }
};

const checkInToClass = async (req, res) => {
  const { courseId, classId } = req.params;
  const studentId = req.user.id;

  try {
    const classDetails = await Class.findOne({ where: { id: classId, course_id: courseId } });
    if (!classDetails) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const currentTime = new Date();
    const classStartTime = new Date(classDetails.start_time);
    const classEndTime = new Date(classDetails.end_time);

    if (currentTime < classStartTime || currentTime > classEndTime) {
      return res.status(400).json({ error: 'You can only check in during the class time' });
    }

    const attendanceRecord = await AttendanceRecord.findOne({
      where: {
        student_id: studentId,
        class_id: classId,
      },
    });

    if (attendanceRecord) {
      await attendanceRecord.update({ check_in_time: currentTime, status: 'Present' });
    } else {
      await AttendanceRecord.create({
        student_id: studentId,
        class_id: classId,
        check_in_time: currentTime,
        status: 'Present',
      });
    }

    res.json({ message: 'Checked in successfully' });
  } catch (error) {
    console.error('Error checking in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getStudentCourses,
  getClassesForCourse,
  getAttendanceForCourse,
  checkInToClass
}; 