const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

router.use(authenticateToken);

router.get('/dashboard', analyticsController.getDashboardStats);
router.get('/daily-report', analyticsController.getDailyReport);
router.get('/campaign-performance', analyticsController.getCampaignPerformance);

module.exports = router;