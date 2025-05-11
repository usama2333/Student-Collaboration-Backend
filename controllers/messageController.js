const sendEmail = require("../utils/sendEmail");

exports.sendMessage = async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const htmlContent = `
      <h3>New Message</h3>
      <p><strong>Subject:</strong> ${subject}</p>
      <p>${message}</p>
    `;

    await sendEmail({
      to,
      subject,
      text: htmlContent,
    });

    res.status(200).json({ message: "Message sent!" });
  } catch (error) {
    console.error("Error sending message:", error.message);
    res.status(500).json({ message: "Failed to send message", error: error.message });
  }
};
