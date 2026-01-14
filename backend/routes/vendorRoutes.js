const express = require("express");
const Vendor = require("../models/Vendor.js");

const router = express.Router();

router.post("/add", async(req,res)=>{
  const vendor = await Vendor.create(req.body);
  res.json(vendor);
});

router.get("/", async(req,res)=>{
    
  res.json(await Vendor.find());
});

module.exports = router;
