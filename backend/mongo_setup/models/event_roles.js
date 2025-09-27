const mongoose = require('mongoose');

const eventRoleSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['organizer','bouncer','attendee','performer'], required: true },
  permissions: [{ type: String }]
}, { timestamps: { createdAt: 'createdAt' } });

eventRoleSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('EventRole', eventRoleSchema);
