const mongoose = require('mongoose');

const performerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  portfolio: { type: mongoose.Schema.Types.Mixed },
  genres: [{ type: String }],
  availability: [{ type: Date }]
});

performerSchema.index({ genres: 1 });

module.exports = mongoose.model('Performer', performerSchema);
