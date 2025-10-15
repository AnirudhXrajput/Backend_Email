const express = require('express');
const nodemailer = require('nodemailer');
// require('dotenv').config(); // Optional, if using .env for secrets
const axios = require("axios"); // if Node 18+, you can use global fetch
const cors = require("cors");
const GEMINI_API_KEY = "AIzaSyDOfqiGrl0m1QlnAm8JFQfkggWFOyp5Bz8"; // replace with your key
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(cors());
app.use(express.json());


// ✅ Correct Gmail SMTP configuration
// const transporter = nodemailer.createTransport({
//     host: "smtp.gmail.com",
//     port: 465,
//     secure: true, // true for 465, false for 587
//     auth: {
//         user: "anirudhrajput1516@gmail.com", // your Gmail / Workspace email
//         pass: "Anirudh1889@"         // App Password (not regular password)
//     }
// });

// // ✅ Test the transporter (optional)
// transporter.verify((error, success) => {
//     if (error) {
//         console.error("SMTP connection failed:", error);
//     } else {
//         console.log("SMTP connection successful!");
//     }
// });

// POST API endpoint
// app.post('/echo', async (req, res) => {
//     const data = req.body;

//     const mailOptions = {
//         from: '"Finsen Ritter" <Anirudh@finseritter.com>',
//         to: data.email,
//         subject: "Thank you for contacting Finsen Ritter",
//         text: `Hello ${data.name},\n\nWe received your message: ${data.message}\n\nBest regards,\nFinsen Ritter Team`
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         res.json({
//             message: "Email sent successfully",
//             data: data
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             message: "Failed to send email",
//             error: error.toString()
//         });
//     }
// });


// POST endpoint to handle user messages
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ error: "Message text required" });
  }

  const body = {
    contents: [{ parts: [{ text: message }] }],
    generationConfig: {
      thinkingConfig: { thinkingBudget: 0 },
    },
  };

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      body,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const data = response.data;
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
    res.json({ reply });
  } catch (err) {
    console.error("Gemini API Error:", err.message);
    if (err.response) {
      console.error("Response data:", err.response.data);
      return res.status(err.response.status).json({
        error: err.response.data.error?.message || "Gemini API Error",
      });
    }
    res.status(500).json({ error: "Network Error: " + err.message });
  }
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
