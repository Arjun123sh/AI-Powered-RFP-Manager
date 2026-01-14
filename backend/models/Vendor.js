const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema({
  name: String,
  email: String,
  company: String
});

module.exports = mongoose.model("Vendor", vendorSchema);
