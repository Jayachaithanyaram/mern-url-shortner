const express = require("express");
const Url = require("../models/Url.js");
const nanoid = require("nanoid");

const router = express.Router();

router.post("/shorten", async (req, res) => {
    try {
        const { originalUrl } = req.body;
        if (!originalUrl) {
            return res.status(400).json({ error: "URL is required" });
        }
        try {
            new URL(originalUrl);
        } catch (error) {
            return res.status(400).json({ error: "Invalid URL" });
        }
        let shortId;
        let exists = true;
        while (exists) {
            shortId = nanoid.nanoid(7);
            exists = await Url.findOne({ shortId });
        }
        const url = await Url.create({ originalUrl, shortId });
        res.json({shortId: url.shortId, shortUrl: `${process.env.BASE_URL}/${url.shortId}` });

    }catch (error) {
        console.error("Error shortening URL:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})

router.get("/:shortId", async (req, res) => {
    try {
        const { shortId } = req.params;
        const url = await Url.findOne({ shortId });
        if (!url) {
            return res.status(404).json({ error: "URL not found" });
        }
        url.clicks += 1;
        await url.save();
        res.redirect(url.originalUrl);
    } catch (error) {
        console.error("Error retrieving URL:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})
module.exports = router;