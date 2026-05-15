const Lead = require('../models/Lead');
const Campaign = require('../models/Campaign');
const logger = require('../utils/logger');
const XLSX = require('xlsx');

exports.getLeadsByStatus = async (req, res, next) => {
  try {
    const { status, campaignId, page = 1, limit = 20 } = req.query;

    const query = { userResponse: status };
    if (campaignId) query.campaignId = campaignId;

    const leads = await Lead.find(query)
      .populate('assignedTo', 'name email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      leads,
      pagination: { page, limit, total }
    });
  } catch (error) {
    next(error);
  }
};

exports.getInterestedLeads = async (req, res, next) => {
  try {
    const { campaignId, page = 1, limit = 20 } = req.query;

    const query = { userResponse: 'interested' };
    if (campaignId) query.campaignId = campaignId;

    const leads = await Lead.find(query)
      .populate('campaignId', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      leads,
      pagination: { page, limit, total }
    });
  } catch (error) {
    next(error);
  }
};

exports.getCallbackLaterLeads = async (req, res, next) => {
  try {
    const { campaignId, page = 1, limit = 20 } = req.query;

    const query = { userResponse: 'callback_later' };
    if (campaignId) query.campaignId = campaignId;

    const leads = await Lead.find(query)
      .populate('campaignId', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      leads,
      pagination: { page, limit, total }
    });
  } catch (error) {
    next(error);
  }
};

exports.getNotInterestedLeads = async (req, res, next) => {
  try {
    const { campaignId, page = 1, limit = 20 } = req.query;

    const query = { userResponse: 'not_interested' };
    if (campaignId) query.campaignId = campaignId;

    const leads = await Lead.find(query)
      .populate('campaignId', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      leads,
      pagination: { page, limit, total }
    });
  } catch (error) {
    next(error);
  }
};

exports.updateLeadStatus = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    const { userResponse, notes, assignedTo, leadQuality } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      leadId,
      {
        userResponse,
        notes,
        assignedTo,
        leadQuality,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({ success: true, message: 'Lead updated', lead });
  } catch (error) {
    next(error);
  }
};

exports.searchLeads = async (req, res, next) => {
  try {
    const { campaignId, phoneNumber, userResponse, page = 1, limit = 20 } = req.query;

    const query = {};
    if (campaignId) query.campaignId = campaignId;
    if (phoneNumber) query.phoneNumber = { $regex: phoneNumber, $options: 'i' };
    if (userResponse) query.userResponse = userResponse;

    const leads = await Lead.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Lead.countDocuments(query);

    res.json({
      success: true,
      leads,
      pagination: { page, limit, total }
    });
  } catch (error) {
    next(error);
  }
};

exports.exportLeads = async (req, res, next) => {
  try {
    const { campaignId, status } = req.query;

    const query = {};
    if (campaignId) query.campaignId = campaignId;
    if (status) query.userResponse = status;

    const leads = await Lead.find(query).lean();

    const data = leads.map(lead => ({
      'Phone Number': lead.phoneNumber,
      'Call Status': lead.callStatus,
      'Response': lead.userResponse,
      'Call Duration': `${lead.callDuration}s`,
      'Retry Count': lead.retryCount,
      'Lead Quality': lead.leadQuality,
      'Notes': lead.notes,
      'Called At': lead.firstCalledAt,
      'Updated At': lead.updatedAt
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');

    const filename = `leads_${Date.now()}.xlsx`;
    XLSX.writeFile(workbook, `uploads/${filename}`);

    res.download(`uploads/${filename}`);

    logger.info(`Leads exported: ${leads.length} records`);
  } catch (error) {
    next(error);
  }
};

exports.getLeadDetails = async (req, res, next) => {
  try {
    const { leadId } = req.params;

    const lead = await Lead.findById(leadId)
      .populate('campaignId')
      .populate('assignedTo', 'name email');

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.json({ success: true, lead });
  } catch (error) {
    next(error);
  }
};

exports.addNotes = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    const { notes } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      leadId,
      { notes },
      { new: true }
    );

    res.json({ success: true, message: 'Notes added', lead });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;