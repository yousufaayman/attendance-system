const express = require('express');
const { Student, Teacher, Class, Course, Group, Room } = require('../models');
const dataController = require('../controllers/dataController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:table', protect, dataController.getData);
router.post('/:table', protect, dataController.createData);
router.put('/:table/:id', protect, dataController.updateData);
router.delete('/:table/:id', protect, dataController.deleteData);

router.get('/groups', protect, dataController.getGroups);
router.get('/courses', protect, dataController.getCourses);
router.get('/teachers', protect, dataController.getTeachers);
router.get('/rooms', protect, dataController.getRooms);


function getModel(table) {
  switch (table) {
    case 'admins':
      return Admin;
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

module.exports = router;
