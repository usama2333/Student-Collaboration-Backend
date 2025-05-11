const sendEmail = require("../utils/sendEmail");
exports.sendMessage = async (req, res) => {
    const { to, subject, message, replyTo } = req.body; // Destructure replyTo from the body
  
    if (!to || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      const htmlContent = `
        <h3>New Message</h3>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>From:</strong> ${req.body.name || 'N/A'}</p>
        <p><strong>Email:</strong> ${req.body.from || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `;
  
      // Pass replyTo to the sendEmail function
      await sendEmail({
        to,
        subject,
        text: htmlContent,
        replyTo,  // This will allow the reply-to header in the email to be set
      });
  
      res.status(200).json({ message: "Message sent!" });
    } catch (error) {
      console.error("Error sending message:", error.message);
      res.status(500).json({ message: "Failed to send message", error: error.message });
    }
  };