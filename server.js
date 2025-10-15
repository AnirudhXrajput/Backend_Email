const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON body
app.use(express.json());

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: "smtp.Google.com", // e.g., smtp.gmail.com
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "Anirudh@finseritter.com", // your email
        pass: "Anirudh1889@"       // email password or app password
    }
});

// POST API endpoint
app.post('/echo', async (req, res) => {
    const data = req.body;

    // Email options
    const mailOptions = {
        from: 'Anirudh@finseritter.com', // sender address
        to: data.email, // client email from POST body
        subject: "Thank you for contacting us",
        text: `Hello ${data.name},\n\nWe received your message: ${data.message}\n\nBest regards,\nFinsen Ritter Team`
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);

        // Respond back with same data
        res.json({
            message: "Email sent successfully",
            data: data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send email", error: error.toString() });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
