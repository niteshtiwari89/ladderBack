const express = require('express');
const router = express.Router();
const careerController = require('../controllers/careerController');
const authenticateToken = require('../middlewares/authMiddleware');

// CRUD routes (protect with authenticateToken if needed)
router.post('/', careerController.createCareer);
router.get('/', careerController.getCareers);
router.get('/:id', careerController.getCareer);
router.put('/:id', careerController.updateCareer);
router.delete('/:id', careerController.deleteCareer);

module.exports = router;