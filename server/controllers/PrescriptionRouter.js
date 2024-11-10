import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {v4 as uuidv4} from 'uuid';

const router = express.Router();

// Upload files 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads', 'prescriptions'); // Ensure consistency in folder name
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniquePrefix = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, `${uniquePrefix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB limit
    }
}).single('file');

// Get list of files
router.get('/files', (req, res) => {
    try {
        const uploadDir = path.join(process.cwd(), 'uploads', 'prescriptions');
        
        if (!fs.existsSync(uploadDir)) {
            return res.json({ files: [] });
        }

        const files = fs.readdirSync(uploadDir)
            .filter(file => {
                const ext = path.extname(file).toLowerCase();
                return ['.jpg', '.jpeg', '.png', '.gif', '.pdf'].includes(ext);
            })
            .map(filename => ({
                filename,
                url: `/api/prescription/view/${filename}`,
                uploadDate: fs.statSync(path.join(uploadDir, filename)).mtime
            }))
            .sort((a, b) => b.uploadDate - a.uploadDate); // Sort by newest first

        res.json({ files });
    } catch (error) {
        res.status(500).json({ error: 'Could not retrieve file list' });
    }
});

// Upload file
router.post('/upload', (req, res) => {
    upload(req, res, function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const fileUrl = `/prescription/view/${req.file.filename}`;
        res.status(200).json({
            message: 'File uploaded successfully',
            filename: req.file.filename,
            url: fileUrl
        });
    });
});

// View file
router.get('/view/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(process.cwd(), 'uploads', 'prescriptions', filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.sendFile(filePath);
    } catch (error) {
        res.status(500).json({ error: 'Could not retrieve file' });
    }
});

// Delete file
router.delete('/delete/:filename', (req, res) => {
    try {
        const filename = req.params.filename;
        const filePath = path.join(process.cwd(), 'uploads', 'prescriptions', filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        fs.unlinkSync(filePath);
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Could not delete file' });
    }
});

export { router as PrescriptionRouter };
