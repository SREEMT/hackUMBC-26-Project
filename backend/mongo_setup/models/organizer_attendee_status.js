const mongoose = require('mongoose');

const oaNoteSchema = new mongoose.Schema({
  by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const organizerAttendeeStatusSchema = new mongoose.Schema({
  organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['ok','flagged','banned'], default: 'ok' },
  notes: [oaNoteSchema],
  updatedAt: { type: Date, default: Date.now }
});

organizerAttendeeStatusSchema.index({ organizerId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('OrganizerAttendeeStatus', organizerAttendeeStatusSchema);
