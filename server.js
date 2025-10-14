// Step 1: Install dependencies
// npm init -y
// npm install express body-parser

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON body
app.use(bodyParser.json());

// POST API endpoint
app.post('/echo', (req, res) => {
    const data = req.body; // Get data from request body
    res.json({
        message: "Received successfully",
        data: data // Reply with same data
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
