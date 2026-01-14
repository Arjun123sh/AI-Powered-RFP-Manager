const express = require("express");
const { sendRfpEmail, readEmails } = require("../services/emailService.js");
const Vendor = require("../models/Vendor.js");
const Rfp = require("../models/Rfp.js");
const Proposal = require("../models/Proposal.js");
const { askOllama } = require("../services/ollamaService.js");

const router = express.Router();

router.post("/send/:rfpId", async (req, res) => {
    const { vendorIds } = req.body;
    const rfp = await Rfp.findById(req.params.rfpId);

    if (!rfp) {
        return res.status(404).json({ error: "RFP not found" });
    }

    const vendors = await Vendor.find({ _id: { $in: vendorIds } });

    for (let v of vendors) {
        const emailBody = `
Dear ${v.name},

We are requesting proposals for the following requirements:

${JSON.stringify(rfp.structured, null, 2)}

Please reply to this email with your proposal including:
- Total price
- Delivery timeline (in days)
- Warranty terms
- Payment terms

Thank you,
RFP Management System
    `;
        await sendRfpEmail(v.email, `RFP Request - ${rfp._id}`, emailBody);
    }

    // Update RFP with selected vendors and sent timestamp
    rfp.selectedVendors = vendorIds;
    rfp.sentAt = new Date();
    rfp.status = "sent";
    await rfp.save();

    res.json({ message: "Emails sent to selected vendors", count: vendors.length });
});

router.get("/read", async (req, res) => {
    const emails = await readEmails();

    // Parse each email and create proposals
    for (let email of emails) {
        try {
            // Extract RFP ID from subject
            const rfpIdMatch = email.subject.match(/RFP Request - ([a-f0-9]{24})/i);
            if (!rfpIdMatch) continue;

            const rfpId = rfpIdMatch[1];

            // Use AI to parse proposal
            const proposalData = await askOllama(`
Extract proposal information from this vendor email and return ONLY valid JSON with these exact fields:
- totalPrice (string)
- deliveryDays (number)
- warranty (string)
- paymentTerms (string)

Email content:
${email.text}

Return ONLY the JSON object, no explanations or markdown.
      `);

            const cleanJson = proposalData
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();

            const extracted = JSON.parse(cleanJson);

            // Find vendor by email
            const vendor = await Vendor.findOne({ email: email.from });

            if (vendor) {
                await Proposal.create({
                    rfpId,
                    vendorId: vendor._id,
                    extractedData: extracted,
                    rawEmailText: email.text
                });
            }
        } catch (err) {
            console.error("Error parsing email:", err);
        }
    }

    res.json({ message: "Inbox scanned and proposals parsed" });
});

module.exports = router;
