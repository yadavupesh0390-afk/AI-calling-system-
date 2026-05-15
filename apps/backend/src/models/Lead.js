const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  callStatus: {
    type: String,
    enum: ['pending', 'calling', 'answered', 'no_answer', 'busy', 'failed', 'completed'],
    default: 'pending'
  },
  userResponse: {
    type: String,
    enum: ['interested', 'callback_later', 'not_interested', 'no_response'],
    default: 'no_response'
  },
  dtmfResponse: String,
  callDuration: { type: Number, default: 0 },
  retryCount: { type: Number, default: 0 },
  leadQuality: {
    type: String,
    enum: ['hot', 'warm', 'cold'],
    default: 'cold'
  },
  notes: String,
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  followupStatus: {
    type: String,
    enum: ['pending', 'whatsapp_sent', 'email_sent', 'contacted', 'converted'],
    default: 'pending'
  },
  callAttempts: [{
    attemptNumber: Number,
    timestamp: Date,
    status: String,
    errorMessage: String,
    callSid: String
  }],
  firstCalledAt: Date,
  lastCalledAt: Date,
  recordingUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

leadSchema.index({ campaignId: 1, userResponse: 1 });
leadSchema.index({ phoneNumber: 1, campaignId: 1 }, { unique: true });

module.exports = mongoose.model('Lead', leadSchema);