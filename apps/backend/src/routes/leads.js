const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const leadController = require('../controllers/leadController');

const router = express.Router();

router.use(authenticateToken);

router.get('/interested', leadController.getInterestedLeads);
router.get('/callback-later', leadController.getCallbackLaterLeads);
router.get('/not-interested', leadController.getNotInterestedLeads);
router.get('/status', leadController.getLeadsByStatus);
router.get('/search', leadController.searchLeads);
router.get('/export', leadController.exportLeads);
router.get('/:leadId', leadController.getLeadDetails);
router.patch('/:leadId', leadController.updateLeadStatus);
router.post('/:leadId/notes', leadController.addNotes);

module.exports = router;