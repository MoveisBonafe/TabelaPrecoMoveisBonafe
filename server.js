const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 5000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'docs', 'data', 'images');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const type = req.body.type || 'image';
        cb(null, `${type}_${timestamp}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    },
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB limit
    }
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Image upload endpoint
app.post('/upload-image', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const imagePath = `data/images/${req.file.filename}`;
        res.json({ 
            success: true, 
            filename: req.file.filename,
            path: imagePath,
            url: `/${imagePath}`
        });
    } catch (error) {
        console.error('Image upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`MoveisBonafe Admin running on http://0.0.0.0:${port}`);
    console.log(`Login: http://localhost:${port}/login`);
    console.log(`Admin: http://localhost:${port}/admin`);
    console.log(`Catalog: http://localhost:${port}/catalogo`);
});