const mongoose = require("mongoose");

const proposalSchema = new mongoose.Schema({
  rfpId: String,
  vendorEmail: String,
  rawEmail: String,
  extracted: Object
});

module.exports = mongoose.model("Proposal", proposalSchema);
