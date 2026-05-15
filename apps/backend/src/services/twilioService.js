const twilio = require('twilio');

const logger = require('../../../shared/utils/logger');
const { CALLING } = require('../../../shared/constants/leadStatus');
const validatePhone = require('../../../shared/validators/phoneValidator');

const Lead = require('../models/Lead');
const Campaign = require('../models/Campaign');
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

class TwilioService {
  async makeCall(leadId, campaignId, phoneNumber) {
    try {
      const campaign = await Campaign.findById(campaignId);
      const ivrScript = campaign.ivrScript[campaign.voiceSettings.language] || campaign.ivrScript.hindi;

      const call = await client.calls.create({
        url: `${process.env.WEBHOOK_URL}/webhooks/ivr?leadId=${leadId}&campaignId=${campaignId}`,
        to: `+91${phoneNumber}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        record: true,
        machineDetection: 'Enable'
      });

      logger.info(`Call initiated: ${call.sid} to ${phoneNumber}`);

      await Lead.findByIdAndUpdate(leadId, {
        callStatus: 'calling',
        firstCalledAt: new Date()
      });

      return call;
    } catch (error) {
      logger.error(`Call initiation error: ${error.message}`);
      throw error;
    }
  }

  generateIVRTwiml(ivrScript, campaignId) {
    const VoiceResponse = require('twilio').twiml.VoiceResponse;
    const response = new VoiceResponse();

    response.gather({
      numDigits: 1,
      action: `${process.env.WEBHOOK_URL}/webhooks/dtmf?campaignId=${campaignId}`,
      method: 'POST'
    }).say({ voice: 'woman' }, ivrScript);

    response.redirect(`${process.env.WEBHOOK_URL}/webhooks/ivr?campaignId=${campaignId}`);

    return response.toString();
  }

  async sendSMS(phoneNumber, message) {
    try {
      const sms = await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${phoneNumber}`
      });

      logger.info(`SMS sent: ${sms.sid}`);
      return sms;
    } catch (error) {
      logger.error(`SMS send error: ${error.message}`);
      throw error;
    }
  }

  async getCallDetails(callSid) {
    try {
      const call = await client.calls(callSid).fetch();
      return call;
    } catch (error) {
      logger.error(`Get call details error: ${error.message}`);
      throw error;
    }
  }

  async hangupCall(callSid) {
    try {
      const call = await client.calls(callSid).update({ status: 'completed' });
      logger.info(`Call ended: ${callSid}`);
      return call;
    } catch (error) {
      logger.error(`Hangup error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new TwilioService();
