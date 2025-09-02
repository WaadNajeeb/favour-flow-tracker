const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favourSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  rewards: [{ type: String }],

  status: {
    type: String,
    enum: ['Open', 'Pending', 'RequiresVerify', 'Completed'],
    default: function () {
      return this.to ? 'Pending' : 'Open';
    }
  },

  favourType: {
    type: String,
    enum: ['Personal', 'Public'],
    default: 'Personal'
  },

  isAnonymous: {
    type: Boolean,
    default: false
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: function () {
      return !this.isAnonymous;
    }
  },

  to: { type: Schema.Types.ObjectId, ref: 'User' },

  // Proof system
  proofRequired: { type: Boolean, default: false }, // must upload proof if true
  proofImage: { type: String }, // single proof image URL/path
  redeemDetails: { type: String }, // extra notes/details from redeemer

  claimedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  claimedAt: { type: Date },

  requiredBy: { type: Date },

  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  verifiedAt: { type: Date },
  completedAt: { type: Date },
  // Additional optional fields
  dueTime: { type: String }, // e.g. "14:30"
  duration: { type: Number }, // numeric value (e.g. 30, 2, 5)
  durationType: {
    type: String,
    enum: ['Minutes', 'Hours', 'Days'],
    default: 'Hours'
  },
  requirements: [{ type: String }],
  additionalNotes: { type: String }



}, { timestamps: true });

module.exports = mongoose.model('Favour', favourSchema);
