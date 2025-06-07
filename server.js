const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Serve static files from docs directory
app.use(express.static(path.join(__dirname, 'docs')));

// Handle HTML pages directly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'login.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'admin.html'));
});

app.get('/catalogo', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'catalogo.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`MoveisBonafe Admin running on http://0.0.0.0:${port}`);
    console.log(`Login: http://localhost:${port}/login`);
    console.log(`Admin: http://localhost:${port}/admin`);
    console.log(`Catalog: http://localhost:${port}/catalogo`);
});