const express = require('express');
const router = express.Router();
const multer = require('multer');
const projectController = require('../controllers/projectController');
const authenticateToken = require('../middlewares/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), projectController.createProject);
router.put('/:id', upload.single('image'), projectController.updateProject);
router.get('/', projectController.getProjects);
router.delete('/:id', projectController.deleteProject);

module.exports = router;