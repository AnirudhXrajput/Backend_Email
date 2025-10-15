const express = require('express');
const nodemailer = require('nodemailer');

const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());


// ✅ Correct Gmail SMTP configuration
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for 587
    auth: {
      user: "anirudh@finsenritter.com",
      pass: "cqix sqju vqrh fgin"
    }
});

// ✅ Test the transporter (optional)
transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP connection failed:", error);
    } else {
        console.log("SMTP connection successful!");
    }
});

// POST API endpoint
app.post('/echo', async (req, res) => {
    const data = req.body;

    const mailOptions = {
        from: '"Finsen Ritter" <Anirudh@finseritter.com>',
        to: data.email,
        subject: "Thank you for contacting Finsen Ritter",
        text: `Hello ${data.name},\n\nWe received your message: ${data.message}\n\nBest regards,\nFinsen Ritter Team`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({
            message: "Email sent successfully",
            data: data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to send email",
            error: error.toString()
        });
    }
});




app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
