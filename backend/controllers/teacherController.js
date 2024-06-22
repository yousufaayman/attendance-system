const { Student, Teacher, Class, Course, Group, Room, AttendanceRecord, CourseInstructors } = require('../models');
const { Op } = require('sequelize');

const getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const courses = await Course.findAll({
      include: [{
        model: Teacher,
        through: { model: CourseInstructors, where: { teacher_id: teacherId } },
        required: true
      }]
    });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching teacher courses:', error);
    res.status(500).json({ error: 'Error fetching teacher courses' });
  }
};

const getCourseClasses = async (req, res) => {
  try {
    const { courseId } = req.params;
    const classes = await Class.findAll({
      where: {
        course_id: courseId,
        teacher_id: req.user.id
      }
    });
    res.json(classes);
  } catch (error) {
    console.error('Error fetching course classes:', error);
    res.status(500).json({ error: 'Error fetching course classes' });
  }
}; 

const getCourseStudents = async (req, res) => {
  try {
    const { courseId } = req.params;
    const groups = await Group.findAll({ where: { course_id: courseId } });
    const groupIds = groups.map(group => group.id);
    const students = await Student.findAll({ where: { group_id: groupIds } });
    res.json(students);
  } catch (error) {
    console.error('Error fetching course students:', error);
    res.status(500).json({ error: 'Error fetching course students' });
  }
};

const getClassAttendance = async (req, res) => {
  try {
    const { classId } = req.params;
    const attendanceRecords = await AttendanceRecord.findAll({ where: { class_id: classId } });
    res.json(attendanceRecords);
  } catch (error) {
    console.error('Error fetching class attendance records:', error);
    res.status(500).json({ error: 'Error fetching class attendance records' });
  }
};

const addClass = async (req, res) => {
  try {
    const { course_id, room_id, start_time, duration } = req.body;
    const teacher_id = req.user.id; 
    const parsedStartTime = new Date(start_time);
    const end_time = new Date(new Date(start_time).getTime() + duration * 60000);

    const existingClass = await Class.findOne({
      where: {
        room_id,
        start_time: {
          [Op.lt]: end_time
        },
        end_time: {
          [Op.gt]: start_time
        }
      }
    });

    if (existingClass) {
      return res.status(400).json({ error: 'Room is already booked for the selected time' });
    }

    const newClass = await Class.create({
      course_id,
      teacher_id,  
      room_id,
      start_time,
      end_time
    });

    console.log(`New class created: ${JSON.stringify(newClass)}`);  

    res.status(201).json(newClass);
  } catch (error) {
    console.error('Error adding class:', error);
    res.status(500).json({ error: 'Error adding class' });
  }
};

const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { room_id, start_time, duration } = req.body;
    const teacher_id = req.user.id;
    const end_time = new Date(new Date(start_time).getTime() + duration * 60000);

    const existingClass = await Class.findOne({
      where: {
        room_id,
        start_time: {
          [Op.lt]: end_time
        },
        end_time: {
          [Op.gt]: start_time
        },
        id: { [Op.ne]: id }
      }
    });

    if (existingClass) {
      return res.status(400).json({ error: 'Room is already booked for the selected time' });
    }

    const updatedClass = await Class.update(
      { room_id, start_time, end_time, teacher_id }, // Update teacher_id
      { where: { id } }
    );

    res.status(200).json(updatedClass);
  } catch (error) {
    console.error('Error updating class:', error);
    res.status(500).json({ error: 'Error updating class' });
  }
};

const deleteClass = async (req, res) => {
  try {
    const { classId } = req.params;
    await Class.destroy({ where: { id: classId } });
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ error: 'Error deleting class' });
  }
};

const addAttendanceRecord = async (req, res) => {
  try {
    const { class_id, student_id, status } = req.body;
    const newRecord = await AttendanceRecord.create({ class_id, student_id, status });
    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Error adding attendance record:', error);
    res.status(500).json({ error: 'Error adding attendance record' });
  }
};

const updateAttendanceRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { status } = req.body;
    const updatedRecord = await AttendanceRecord.update({ status }, { where: { id: recordId } });
    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error('Error updating attendance record:', error);
    res.status(500).json({ error: 'Error updating attendance record' });
  }
};

function getModel(table) {
  switch (table) {
    case 'students':
      return Student;
    case 'teachers':
      return Teacher;
    case 'classes':
      return Class;
    case 'courses':
      return Course;
    case 'groups':
      return Group;
    case 'rooms':
      return Room;
    default:
      throw new Error('Invalid table name');
  }
}

module.exports = {
  getTeacherCourses,
  getCourseClasses,
  getCourseStudents,
  getClassAttendance,
  addClass,
  updateClass,
  deleteClass,
  addAttendanceRecord,
  updateAttendanceRecord
};
 