

const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const studentController = require('../controllers/studentController');
const router = express.Router(); 

router.get('/courses', protect, studentController.getStudentCourses);
router.get('/course/:courseId/classes', protect, studentController.getClassesForCourse);
router.get('/course/:courseId/attendance', protect, studentController.getAttendanceForCourse);
router.post('/course/:courseId/class/:classId/checkin', protect, studentController.checkInToClass); 

module.exports = router;
