// routes/studentRoutes.js

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const studentController = require('../controllers/studentController');
const router = express.Router(); 

router.get('/courses', protect, studentController.getStudentCourses);
router.get('/course/:courseId/classes', protect, studentController.getClassesForCourse);
router.get('/course/:courseId/attendance', protect, studentController.getAttendanceForCourse);
router.get('/course/:courseId/class/:classId/checkin', protect, studentController.getAttendanceForCourse);

module.exports = router;
