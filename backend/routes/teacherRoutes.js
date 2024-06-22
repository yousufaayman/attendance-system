const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const teacherController = require('../controllers/teacherController');
const router = express.Router(); 

router.get('/courses', protect, teacherController.getTeacherCourses);
router.get('/courses/:courseId/classes', protect, teacherController.getCourseClasses);
router.get('/courses/:courseId/students', protect, teacherController.getCourseStudents);
router.get('/classes/:classId/attendance', protect, teacherController.getClassAttendance)
router.post('/add-classes', protect, teacherController.addClass);
router.put('/update-classes/:classId', protect, teacherController.updateClass);
router.delete('/delete-classes/:classId', protect, teacherController.deleteClass);
router.post('/classes-add-attendance/:classId/attendance', protect, teacherController.addAttendanceRecord);
router.put('/classes-update-attendance/:classId/attendance/:recordId', protect, teacherController.updateAttendanceRecord);

module.exports = router;
 