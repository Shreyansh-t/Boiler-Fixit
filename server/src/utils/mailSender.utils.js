const nodemailer = require('nodemailer');

const mailSender = async (email, title, body) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      }
    });

    const info = await transporter.sendMail({
      from: '"Sandeep Singh - DevApp" <no-reply@devapp.test>',
      to: email,
      subject: title,
      html: body,
    });

    console.log("✅ Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Mail send error:", error.message);
    throw error;
  }
};

module.exports = mailSender;
