const mongoose = require("mongoose");

const transaction = new mongoose.Schema({
    hash: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        required: true,
    },
    block: {
        type: String,
        required: true,
    },
    timestamp: {
        type: String,
    },
    from: {
        type: String,
        required: true,
    },
    tokens_transferred: {
        type: String,
    },
    value: {
        type: Number,
    },
    transaction_fee: {
        type: Number,
    },
    gas_price: {
        type: Number,
    },
    gas_limit: {
        type: Number,
    }
});