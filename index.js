const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'docs')));

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs/admin.html'));
});

// Serve catalog
app.get('/catalog', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs/catalogo.html'));
});

// Serve login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs/login.html'));
});

// Default route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs/index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log('MoveisBonafe Admin Panel - GitHub Pages');
    console.log('Sistema: GitHub API integrado com fallback localStorage');
});