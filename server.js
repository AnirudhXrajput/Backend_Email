require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Configure Nodemailer with Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465
  auth: {
    user: "anirudh@finsenritter.com",
    pass: "cqix sqju vqrh fgin"
  }
});

// Optional: verify SMTP connection
transporter.verify((error, success) => {
  if (error) console.error("SMTP connection failed:", error);
  else console.log("SMTP ready to send emails");
});

// Health check route
app.get('/', (req, res) => res.send("Server is running"));

// POST /echo - send email
app.post('/echo', async (req, res) => {
  const data = req.body;

  if (!data.email) {
    return res.status(400).json({ message: "Missing 'email' field in request body" });
  }

  const mailOptions = {
    from: `"Finsen Ritter" <${process.env.EMAIL_USER}>`,
    to: data.email,
    subject: data.subject || "Thank you for contacting Finsen Ritter",
    text: `Hello ${data.name || ''},\n\nWe received your message:\n\n${data.message || '(no message)'}\n\nBest regards,\nFinsen Ritter Team`,
    html: `<p>Hello ${data.name || ''},</p>
           <p>We received your message:</p>
           <blockquote>${data.message || '(no message)'}</blockquote>
           <p>Best regards,<br/>Finsen Ritter Team</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Email sent successfully", data });
  } catch (error) {
    console.error("sendMail error:", error);
    res.status(500).json({ message: "Failed to send email", error: error.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
