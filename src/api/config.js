const express = require("express");
const router = express.Router();

router.get("/", (req,res) => {
    res.status(200).json({
        success: true,
        result: {
            domain: process.env.DOMAIN || "http://example.com",
            demo: process.env.DEMO === "true"
        }
    })

})

module.exports = router