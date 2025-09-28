const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}, { _id: false });

const attendeeSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending','approved','denied'], default: 'pending' },
  checkedIn: { type: Boolean, default: false },
  notes: [noteSchema]
}, { timestamps: { createdAt: 'createdAt' } });

attendeeSchema.index({ eventId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Attendee', attendeeSchema);
