const { Student, Teacher, Class, Course, Group, Room, AttendanceRecord } = require('../models');

const getData = async (req, res) => {
  const { table } = req.params;
  try {
    const Model = getModel(table);
    const entries = await Model.findAll();
    res.json(entries);
  } catch (error) {
    console.error(`Error fetching data for table ${table}:`, error);
    res.status(500).json({ error: 'Error fetching data' });
  }
};

const createData = async (req, res) => {
  const { table } = req.params;
  const data = req.body;
  try {
    const Model = getModel(table);
    const newEntry = await Model.create(data);
    res.status(201).json(newEntry);
  } catch (error) {
    console.error(`Error adding data to table ${table}:`, error);
    res.status(500).json({ error: 'Error adding data' });
  }
};

const updateData = async (req, res) => {
  const { table, id } = req.params;
  const data = req.body;
  try {
    const Model = getModel(table);
    const updatedEntry = await Model.update(data, { where: { id } });
    if (updatedEntry[0] === 0) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    res.json({ message: 'Entry updated successfully' });
  } catch (error) {
    console.error(`Error updating data in table ${table}:`, error);
    res.status(500).json({ error: 'Error updating data' });
  }
};

const deleteData = async (req, res) => {
  const { table, id } = req.params;
  try {
    const Model = getModel(table);
    await Model.destroy({ where: { id } });
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    console.error(`Error deleting data from table ${table}:`, error);
    res.status(500).json({ error: 'Error deleting data' });
  }
};

const getGroups = async (req, res) => {
  try {
    const groups = await Group.findAll();
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Error fetching groups' });
  }
};

const getCourses = async (req, res) => {
  try {
    const courses = await Course.findAll();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Error fetching courses' });
  }
};

const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll();
    res.json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: 'Error fetching teachers' });
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Error fetching rooms' });
  }
};

const getTeacherCourses = async (req, res) => {
  try {
    const teacherId = req.user.id; 
    const courses = await Course.findAll({
      include: [
        {
          model: Teacher,
          as: 'teachers',
          where: { id: teacherId },
          through: { attributes: [] } // exclude the join table attributes
        }
      ]
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
    const classes = await Class.findAll({ where: { course_id: courseId } });
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

const getCourseAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    const groups = await Group.findAll({ where: { course_id: courseId } });
    const groupIds = groups.map(group => group.id);
    const students = await Student.findAll({ where: { group_id: groupIds } });
    const studentIds = students.map(student => student.id);
    const attendanceRecords = await AttendanceRecord.findAll({ where: { student_id: studentIds } });
    res.json(attendanceRecords);
  } catch (error) {
    console.error('Error fetching course attendance records:', error);
    res.status(500).json({ error: 'Error fetching course attendance records' });
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
  getData,
  createData,
  updateData,
  deleteData,
  getGroups,
  getCourses,
  getTeachers,
  getRooms,
  getTeacherCourses,
  getCourseClasses,
  getCourseStudents,
  getCourseAttendance,
};
