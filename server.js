const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from docs directory
app.use(express.static('docs'));

// Handle client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`MoveisBonafe Admin running on http://0.0.0.0:${port}`);
    console.log(`Access: http://localhost:${port}`);
});