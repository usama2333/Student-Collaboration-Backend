const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/upload', protect, upload.single('file'), (req, res) => {
  const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;
  res.status(200).json({ fileUrl });
});

module.exports = router;
