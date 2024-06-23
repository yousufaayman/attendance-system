const { Student, Teacher, Class, Course, Group, Room, AttendanceRecord, CourseInstructors } = require('../models');

const getData = async (req, res) => {
  const { table } = req.params;
  try {
    const Model = getModel(table);
    const options = {};
    if (table === 'courses') {
      options.include = [{ model: Teacher, as: 'Teachers' }];
    }
    const entries = await Model.findAll(options);
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

    if (table === 'courses' && data.instructors) {
      await newEntry.setTeachers(data.instructors);
    }

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
    const entry = await Model.findByPk(id);

    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }

    await entry.update(data);

    if (table === 'courses' && data.instructors) {
      await entry.setTeachers(data.instructors);
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
};
