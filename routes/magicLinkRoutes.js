const express = require("express");
const router = express.Router();
const { sendMagicLink } = require("../controllers/magicLinkController");
const { sendMessage } = require("../controllers/messageController");

router.post("/send-magic-link", sendMagicLink);
router.post("/send-message", sendMessage);

module.exports = router;
