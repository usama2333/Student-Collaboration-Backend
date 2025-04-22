const express = require("express");
const router = express.Router();
const { sendMagicLink } = require("../controllers/magicLinkController");

router.post("/send-magic-link", sendMagicLink);

module.exports = router;
