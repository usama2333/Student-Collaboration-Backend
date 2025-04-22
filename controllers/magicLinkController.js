const sendEmail = require("../utils/sendEmail");

exports.sendMagicLink = async (req, res) => {
  const { to } = req.body;

  if (!to) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const loginLink = `http://localhost:3000/signup?email=${encodeURIComponent(to)}`;
    const htmlContent = `
      <h3>Hello!</h3>
      <p>You requested a magic login link. Click below to access your account:</p>
      <a href="${loginLink}">${loginLink}</a>
      <p>If you didn't request this, please ignore this email.</p>
    `;

    await sendEmail({
      to,
      subject: "Your Magic Login Link",
      text: htmlContent,
    });

    res.status(200).json({ message: "Magic link sent!" });
  } catch (error) {
    console.error("Error sending magic link:", error.message);
    res.status(500).json({ message: "Failed to send magic link", error: error.message });
  }
};
