
const express = require("express");
const Rfp = require("../models/Rfp.js");
const { askOllama } = require("../services/ollamaService.js");

const router = express.Router();

router.post("/create", async (req, res) => {
    const { text } = req.body;

    const structuredRaw = await askOllama(`
You are a JSON generator.

Convert the following RFP text into valid JSON with exactly these fields:
- items (array of objects with name and specifications)
- quantities (array)
- budget (string or number)
- delivery_days (number)
- warranty (string)
- payment_terms (string)

Rules:
- Return ONLY raw JSON
- Do NOT add explanations
- Do NOT add markdown
- Do NOT wrap in code fences
- Do NOT include any text before or after JSON

RFP Text:
${text}
`);


    // Remove code fences if model still returns them
    const jsonClean = structuredRaw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    let structured;

    try {
        structured = JSON.parse(jsonClean);
    } catch (err) {
        console.error("Invalid JSON from Ollama:", structuredRaw);
        return res.status(400).json({ error: "AI returned invalid JSON" });
    }

    const rfp = await Rfp.create({
        rawText: text,
        structured
    });

    res.json(rfp);
});

router.get("/", async (req, res) => {
    res.json(await Rfp.find());
});

module.exports = router;
