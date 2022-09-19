const mongoose = require("mongoose");

const offer = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
  },
  client_id: {
    type: String,
    required: true,
  },
  worker_id: {
    type: String,
  },
  deadline: {
    type: String,
    required: false,
  },
  compensation: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  accepted: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Offer", offer);