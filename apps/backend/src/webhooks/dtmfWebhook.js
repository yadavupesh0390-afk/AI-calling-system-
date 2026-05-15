const express = require('express');
const Lead = require('../models/Lead');
const Campaign = require('../models/Campaign');
const twilioService = require('../services/twilioService');
const logger = require('../utils/logger');

const router = express.Router();

router.post('/dtmf', async (req, res) => {
  try {
    const { Digits, CallSid } = req.body;
    const { leadId, campaignId } = req.query;

    if (!Digits) {
      const campaign = await Campaign.findById(campaignId);
      const ivrScript = campaign.ivrScript[campaign.voiceSettings.language];
      const twiml = twilioService.generateIVRTwiml(ivrScript, campaignId);
      res.type('text/xml');
      return res.send(twiml);
    }

    const dtmfMap = {
      '1': 'interested',
      '2': 'callback_later',
      '3': 'not_interested'
    };

    const userResponse = dtmfMap[Digits];

    if (userResponse) {
      const lead = await Lead.findByIdAndUpdate(
        leadId,
        {
          callStatus: 'completed',
          userResponse,
          dtmfResponse: Digits,
          updatedAt: new Date()
        },
        { new: true }
      );

      const campaign = await Campaign.findById(campaignId);
      if (userResponse === 'interested') {
        campaign.interestedLeads += 1;
      } else if (userResponse === 'callback_later') {
        campaign.callbackLaterLeads += 1;
      } else if (userResponse === 'not_interested') {
        campaign.notInterestedLeads += 1;
      }
      campaign.processedLeads += 1;
      await campaign.save();

      logger.info(`DTMF received: ${Digits}, Response: ${userResponse}, Lead: ${leadId}`);

      const VoiceResponse = require('twilio').twiml.VoiceResponse;
      const response = new VoiceResponse();
      response.say('Thank you for your time. Goodbye.');
      response.hangup();

      res.type('text/xml');
      res.send(response.toString());
    } else {
      const campaign = await Campaign.findById(campaignId);
      const ivrScript = campaign.ivrScript[campaign.voiceSettings.language];
      const twiml = twilioService.generateIVRTwiml(ivrScript, campaignId);
      res.type('text/xml');
      res.send(twiml);
    }
  } catch (error) {
    logger.error(`DTMF webhook error: ${error.message}`);
    const VoiceResponse = require('twilio').twiml.VoiceResponse;
    const response = new VoiceResponse();
    response.say('An error occurred. Goodbye.');
    response.hangup();
    res.type('text/xml');
    res.send(response.toString());
  }
});

module.exports = router;