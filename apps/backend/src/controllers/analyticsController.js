const Lead = require('../models/Lead');
const Campaign = require('../models/Campaign');
const logger = require('../utils/logger');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const { campaignId } = req.query;

    const query = { createdBy: req.user.id };
    if (campaignId) query._id = campaignId;

    const campaigns = await Campaign.find(query);
    const campaignIds = campaigns.map(c => c._id);

    const leadQuery = { campaignId: { $in: campaignIds } };

    const totalLeads = await Lead.countDocuments(leadQuery);
    const answeredCalls = await Lead.countDocuments({
      ...leadQuery,
      callStatus: { $in: ['answered', 'completed'] }
    });
    const failedCalls = await Lead.countDocuments({
      ...leadQuery,
      callStatus: 'failed'
    });
    const interestedLeads = await Lead.countDocuments({
      ...leadQuery,
      userResponse: 'interested'
    });
    const callbackLater = await Lead.countDocuments({
      ...leadQuery,
      userResponse: 'callback_later'
    });
    const notInterested = await Lead.countDocuments({
      ...leadQuery,
      userResponse: 'not_interested'
    });

    const conversionRate = totalLeads > 0 ? ((interestedLeads / answeredCalls) * 100).toFixed(2) : 0;

    res.json({
      success: true,
      statistics: {
        totalLeads,
        answeredCalls,
        failedCalls,
        interestedLeads,
        callbackLater,
        notInterested,
        conversionRate: `${conversionRate}%`,
        noAnswer: totalLeads - answeredCalls - failedCalls
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getDailyReport = async (req, res, next) => {
  try {
    const { campaignId, days = 7 } = req.query;

    const query = { createdBy: req.user.id };
    if (campaignId) query._id = campaignId;

    const campaigns = await Campaign.find(query);
    const campaignIds = campaigns.map(c => c._id);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const dailyData = await Lead.aggregate([
      {
        $match: {
          campaignId: { $in: campaignIds },
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          totalCalls: { $sum: 1 },
          interested: {
            $sum: { $cond: [{ $eq: ['$userResponse', 'interested'] }, 1, 0] }
          },
          failed: {
            $sum: { $cond: [{ $eq: ['$callStatus', 'failed'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ success: true, dailyData });
  } catch (error) {
    next(error);
  }
};

exports.getCampaignPerformance = async (req, res, next) => {
  try {
    const campaigns = await Campaign.find({ createdBy: req.user.id }).lean();

    const performance = await Promise.all(campaigns.map(async (campaign) => {
      const leads = await Lead.find({ campaignId: campaign._id });

      const answered = leads.filter(l => l.callStatus === 'completed').length;
      const interested = leads.filter(l => l.userResponse === 'interested').length;

      return {
        campaignName: campaign.name,
        totalLeads: campaign.totalLeads,
        answeredCalls: answered,
        interestedLeads: interested,
        conversionRate: answered > 0 ? ((interested / answered) * 100).toFixed(2) : 0,
        status: campaign.status
      };
    }));

    res.json({ success: true, performance });
  } catch (error) {
    next(error);
  }
};

module.exports = exports;