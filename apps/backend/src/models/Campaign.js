const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'stopped', 'completed'],
    default: 'draft'
  },
  phoneNumbers: [String],
  totalLeads: {
    type: Number,
    default: 0
  },
  ivrScript: {
    hindi: String,
    english: String,
    custom: String
  },
  voiceSettings: {
    language: { type: String, default: 'hindi' },
    gender: { type: String, enum: ['male', 'female'], default: 'female' },
    speed: { type: Number, default: 1 },
    customVoiceUrl: String
  },
  callSettings: {
    retryCount: { type: Number, default: 3 },
    retryDelay: { type: Number, default: 3600 },
    callSpeed: { type: Number, default: 5 },
    businessHoursOnly: { type: Boolean, default: true },
    businessHours: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '18:00' }
    },
    skipDND: { type: Boolean, default: true }
  },
  followupSettings: {
    whatsappFollowup: { type: Boolean, default: true },
    whatsappMessage: String,
    emailFollowup: { type: Boolean, default: false },
    telegramFollowup: { type: Boolean, default: false }
  },
  processedLeads: { type: Number, default: 0 },
  interestedLeads: { type: Number, default: 0 },
  callbackLaterLeads: { type: Number, default: 0 },
  notInterestedLeads: { type: Number, default: 0 },
  failedCalls: { type: Number, default: 0 },
  startDate: Date,
  endDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);