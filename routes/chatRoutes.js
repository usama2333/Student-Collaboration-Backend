const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

router.post('/upload', protect, upload.single('file'), (req, res) => {
    try {
      console.log('Request file:', req.file);
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      const fileUrl = `${req.protocol}://${req.get('host')}/${req.file.path}`;
      res.status(200).json({ fileUrl });
    } catch (error) {
      console.error('Upload Error:', error);
      res.status(500).json({ message: 'File upload failed', error });
    }
  });
  

module.exports = router;
