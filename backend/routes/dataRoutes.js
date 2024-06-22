const express = require('express');
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

module.exports = router;
