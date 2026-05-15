const Queue = require('bull');
const logger = require('../utils/logger');
const twilioService = require('../services/twilioService');
const Lead = require('../models/Lead');
const Campaign = require('../models/Campaign');

const CallQueue = new Queue('calls', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

CallQueue.process(5, async (job) => {
  try {
    const { leadId, campaignId, phoneNumber } = job.data;

    const lead = await Lead.findById(leadId);
    if (lead.callStatus !== 'pending') {
      logger.info(`Lead already processed: ${leadId}`);
      return { status: 'skipped' };
    }

    const call = await twilioService.makeCall(leadId, campaignId, phoneNumber);

    await job.progress(50);

    return { callSid: call.sid, status: 'success' };
  } catch (error) {
    logger.error(`Call queue error: ${error.message}`);
    throw error;
  }
});

CallQueue.on('failed', async (job, err) => {
  logger.error(`Job failed: ${job.id}, Error: ${err.message}`);

  const { leadId } = job.data;
  const lead = await Lead.findById(leadId);

  if (job.attemptsMade >= job.opts.attempts) {
    await Lead.findByIdAndUpdate(leadId, {
      callStatus: 'failed'
    });

    const campaign = await Campaign.findById(lead.campaignId);
    campaign.failedCalls += 1;
    await campaign.save();

    logger.info(`Lead marked as failed: ${leadId}`);
  }
});

CallQueue.on('completed', async (job) => {
  logger.info(`Job completed: ${job.id}`);
});

module.exports = { CallQueue };