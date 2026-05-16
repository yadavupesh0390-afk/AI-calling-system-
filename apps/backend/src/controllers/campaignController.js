const Campaign = require('../models/Campaign');
const Lead = require('../models/Lead');
const logger = require('../utils/logger');
const fs = require('fs');
const csv = require('csv-parser');
const XLSX = require('xlsx');

// 🔥 IMPORTANT: CALL QUEUE IMPORT
const { CallQueue } = require('../queues/callQueue');

/* =========================
   CREATE CAMPAIGN
========================= */
exports.createCampaign = async (req, res, next) => {
  try {
    const {
      name,
      description,
      ivrScript,
      voiceSettings,
      callSettings,
      followupSettings
    } = req.body;

    const campaign = await Campaign.create({
      name,
      description,
      createdBy: req.user.id,
      ivrScript: ivrScript || {},
      voiceSettings: voiceSettings || {},
      callSettings: callSettings || {},
      followupSettings: followupSettings || {}
    });

    logger.info(`Campaign created: ${campaign._id}`);

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      campaign
    });

  } catch (error) {
    next(error);
  }
};

/* =========================
   UPLOAD PHONE NUMBERS
   + AUTO QUEUE START (FIXED)
========================= */
exports.uploadPhoneNumbers = async (req, res, next) => {
  try {
    const { campaignId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    let phoneNumbers = [];

    if (file.mimetype === 'text/csv') {
      phoneNumbers = await parseCSV(file.path);
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      phoneNumbers = parseExcel(file.path);
    } else {
      return res.status(400).json({
        error: 'Only CSV and Excel files are supported'
      });
    }

    // 🔥 CLEAN NUMBERS
    phoneNumbers = phoneNumbers
      .map(num => num.toString().replace(/\D/g, ''))
      .filter(num => /^\d{10,}$/.test(num))
      .filter((num, index, self) => self.indexOf(num) === index);

    // Save to campaign
    campaign.phoneNumbers = [
      ...new Set([...campaign.phoneNumbers, ...phoneNumbers])
    ];
    campaign.totalLeads = campaign.phoneNumbers.length;
    await campaign.save();

    // Save leads
    const leads = phoneNumbers.map(phoneNumber => ({
      campaignId: campaign._id,
      phoneNumber
    }));

    await Lead.insertMany(leads, { ordered: false }).catch(err => {
      if (err.code !== 11000) throw err;
    });

    // 🔥 AUTO CALL QUEUE START (IMPORTANT FIX)
    const savedLeads = await Lead.find({ campaignId });

    for (const lead of savedLeads) {
      if (lead.callStatus === 'pending') {
        await CallQueue.add({
          leadId: lead._id,
          campaignId: campaign._id,
          phoneNumber: lead.phoneNumber
        }, {
          attempts: 3,
          removeOnComplete: true,
          delay: 2000
        });
      }
    }

    fs.unlinkSync(file.path);

    logger.info(`🔥 Call Queue started after upload: ${campaignId}`);

    res.json({
      success: true,
      message: `${phoneNumbers.length} numbers uploaded & calling started`,
      totalLeads: campaign.phoneNumbers.length
    });

  } catch (error) {
    next(error);
  }
};

/* =========================
   START CAMPAIGN
   + QUEUE TRIGGER FIXED
========================= */
exports.startCampaign = async (req, res, next) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findByIdAndUpdate(
      campaignId,
      { status: 'active', startDate: new Date() },
      { new: true }
    );

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // 🔥 TRIGGER CALL QUEUE
    const leads = await Lead.find({ campaignId });

    for (const lead of leads) {
      if (lead.callStatus === 'pending') {
        await CallQueue.add({
          leadId: lead._id,
          campaignId,
          phoneNumber: lead.phoneNumber
        }, {
          attempts: 3,
          removeOnComplete: true,
          delay: 2000
        });
      }
    }

    logger.info(`🚀 Campaign started + calls queued: ${campaignId}`);

    res.json({
      success: true,
      message: 'Campaign started & calling initiated',
      campaign
    });

  } catch (error) {
    next(error);
  }
};

/* =========================
   PAUSE
========================= */
exports.pauseCampaign = async (req, res, next) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findByIdAndUpdate(
      campaignId,
      { status: 'paused' },
      { new: true }
    );

    res.json({ success: true, message: 'Campaign paused', campaign });

  } catch (error) {
    next(error);
  }
};

/* =========================
   RESUME
========================= */
exports.resumeCampaign = async (req, res, next) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findByIdAndUpdate(
      campaignId,
      { status: 'active' },
      { new: true }
    );

    res.json({ success: true, message: 'Campaign resumed', campaign });

  } catch (error) {
    next(error);
  }
};

/* =========================
   STOP
========================= */
exports.stopCampaign = async (req, res, next) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findByIdAndUpdate(
      campaignId,
      { status: 'stopped', endDate: new Date() },
      { new: true }
    );

    res.json({ success: true, message: 'Campaign stopped', campaign });

  } catch (error) {
    next(error);
  }
};

/* =========================
   GET SINGLE
========================= */
exports.getCampaign = async (req, res, next) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.json({ success: true, campaign });

  } catch (error) {
    next(error);
  }
};

/* =========================
   LIST
========================= */
exports.getCampaigns = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { createdBy: req.user.id };
    if (status) query.status = status;

    const campaigns = await Campaign.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Campaign.countDocuments(query);

    res.json({
      success: true,
      campaigns,
      pagination: { page, limit, total }
    });

  } catch (error) {
    next(error);
  }
};

/* =========================
   DELETE
========================= */
exports.deleteCampaign = async (req, res, next) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findByIdAndDelete(campaignId);

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    await Lead.deleteMany({ campaignId });

    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

/* =========================
   CSV PARSER
========================= */
const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const phoneNumber = Object.values(data)[0];
        if (phoneNumber) results.push(phoneNumber);
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

/* =========================
   EXCEL PARSER
========================= */
const parseExcel = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  return data.flat().filter(val => val);
};
