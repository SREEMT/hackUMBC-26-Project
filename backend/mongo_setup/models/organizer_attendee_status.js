const mongoose = require('mongoose');

const oaNoteSchema = new mongoose.Schema(
  {
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const organizerAttendeeStatusSchema = new mongoose.Schema(
  {
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['ok', 'flagged', 'banned'], default: 'ok' },
    notes: [oaNoteSchema]
  },
  {
    timestamps: { createdAt: false, updatedAt: true } // let mongoose manage updatedAt
  }
);

// Prevent duplicates: each (organizerId, userId) must be unique
organizerAttendeeStatusSchema.index({ organizerId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('OrganizerAttendeeStatus', organizerAttendeeStatusSchema);
