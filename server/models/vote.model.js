const mongoose = require("mongoose");

const vote = new mongoose.Schema({
  proposalId: {
    type: String,
    required: true,
  },
  proposer_id: {
    type: String,
    required: true,
  },
  proposer_address: {
    type: Number,
    required: true,
    unique: true,
  },
  targets: { // 배열
    type: String,
    required: true,
  },
  values: { // 배열
    type: Number,
    default: 0,
  },
  calldatas: { // 배열
    type: String,
    default: 0,
  },
  descryption: {
    type: Date,
    default: Date.now
  },
  for: {
    type: Number,
  },
  against: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["Pending", "Active", "Canceled", "Defeated", "Succeeded", "Queued", "Expired", "Executed"],
    default: "Pending",
  },
});

module.exports = mongoose.model("Vote", vote)