const mongoose = require("mongoose");

const rfpSchema = new mongoose.Schema({
    rawText: String,
    structured: Object,
    vendors: [String],
    selectedVendors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' }],
    sentAt: Date,
    status: { type: String, default: "created" }
},
    {
        timestamps: true
    });

module.exports = mongoose.model("Rfp", rfpSchema);
