const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Serve static files from docs directory
app.use(express.static(path.join(__dirname, 'docs')));

// Serve root index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'index.html'));
});

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'admin.html'));
});

// Serve catalog
app.get('/catalogo', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'catalogo.html'));
});

// Serve login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'login.html'));
});

// Handle other static files
app.use((req, res, next) => {
    res.status(404).send('File not found');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`MoveisBonafe Catalog Server running on port ${PORT}`);
    console.log(`Admin Panel: http://localhost:${PORT}/admin`);
    console.log(`Catalog: http://localhost:${PORT}/catalogo`);
    console.log(`Login: http://localhost:${PORT}/login`);
});