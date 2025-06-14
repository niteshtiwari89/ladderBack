const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const applicationController = require('../controllers/applicationController');
const authenticateToken = require('../middlewares/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage:storage });

router.post('/', upload.single('resume'), applicationController.createApplication);
router.get('/', applicationController.getApplications);
router.delete('/:id', applicationController.deleteApplication);

module.exports = router;