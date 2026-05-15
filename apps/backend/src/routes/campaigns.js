const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const campaignController = require('../controllers/campaignController');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.use(authenticateToken);

router.post('/', campaignController.createCampaign);
router.get('/', campaignController.getCampaigns);
router.get('/:campaignId', campaignController.getCampaign);
router.post('/:campaignId/upload', upload.single('file'), campaignController.uploadPhoneNumbers);
router.post('/:campaignId/start', campaignController.startCampaign);
router.post('/:campaignId/pause', campaignController.pauseCampaign);
router.post('/:campaignId/resume', campaignController.resumeCampaign);
router.post('/:campaignId/stop', campaignController.stopCampaign);
router.delete('/:campaignId', authorizeRole(['admin']), campaignController.deleteCampaign);

module.exports = router;