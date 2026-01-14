const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect("mongodb://0.0.0.0:27017/rfp_ai");
    console.log("MongoDB Connected");
};


const rfpRoutes = require("./routes/rfpRoutes.js");
const vendorRoutes = require("./routes/vendorRoutes.js");
const emailRoutes = require("./routes/emailRoutes.js");
const proposalRoutes = require("./routes/proposalRoutes.js");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/rfp", rfpRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/proposals", proposalRoutes);

app.listen(5000, () => console.log("Backend running on 5000"));
