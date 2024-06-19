const express = require('express');
const { Student, Teacher, Class, Course, Group, Room } = require('../models');
const { protect } = require('../middleware/authMiddleware');
const dataController = require('../controllers/dataController');
const router = express.Router();

router.get('/:table', protect, dataController.getData);
router.post('/:table', protect, dataController.createData);
router.put('/:table/:id', protect, dataController.updateData);
router.delete('/:table/:id', protect, dataController.deleteData);

router.get('/groups', protect, dataController.getGroups);
router.get('/courses', protect, dataController.getCourses);
router.get('/teachers', protect, dataController.getTeachers);
router.get('/rooms', protect, dataController.getRooms);

router.get('/teacher/courses', protect, dataController.getTeacherCourses);
router.get('/teacher/courses/:courseId/classes', protect, dataController.getCourseClasses);
router.get('/teacher/courses/:courseId/students', protect, dataController.getCourseStudents);
router.get('/teacher/courses/:courseId/attendance', protect, dataController.getCourseAttendance);

module.exports = router;
