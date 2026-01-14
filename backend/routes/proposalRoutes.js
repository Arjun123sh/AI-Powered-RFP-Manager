const express = require("express");
const Proposal = require("../models/Proposal.js");
const Vendor = require("../models/Vendor.js");
const Rfp = require("../models/Rfp.js");
const { askOllama } = require("../services/ollamaService.js");

const router = express.Router();

// Get all proposals
router.get("/", async (req, res) => {
    const proposals = await Proposal.find()
        .populate('vendorId')
        .populate('rfpId');
    res.json(proposals);
});

// Get proposals for a specific RFP
router.get("/rfp/:rfpId", async (req, res) => {
    const proposals = await Proposal.find({ rfpId: req.params.rfpId })
        .populate('vendorId');
    res.json(proposals);
});

// Get AI recommendation for proposals
router.post("/compare", async (req, res) => {
    const { rfpId } = req.body;

    const rfp = await Rfp.findById(rfpId);
    const proposals = await Proposal.find({ rfpId })
        .populate('vendorId');

    if (proposals.length === 0) {
        return res.json({ recommendation: null, message: "No proposals found" });
    }

    // Prepare data for AI
    const proposalSummary = proposals.map(p => ({
        vendor: p.vendorId.name,
        company: p.vendorId.company,
        ...p.extractedData
    }));

    const prompt = `
You are an expert procurement analyst. Analyze these vendor proposals and recommend the best option.

RFP Requirements:
${JSON.stringify(rfp.structured, null, 2)}

Vendor Proposals:
${JSON.stringify(proposalSummary, null, 2)}

Provide your recommendation in this JSON format:
{
  "recommendedVendor": "vendor name",
  "reason": "detailed explanation of why this vendor is best",
  "score": 9.5
}

Return ONLY the JSON, no markdown or explanations.
  `;

    const recommendation = await askOllama(prompt);

    const cleanJson = recommendation
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    try {
        const parsed = JSON.parse(cleanJson);
        res.json(parsed);
    } catch (err) {
        res.json({
            recommendedVendor: "Analysis Error",
            reason: recommendation,
            score: 0
        });
    }
});

module.exports = router;
