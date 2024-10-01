import express from 'express';
import multer from 'multer';
import { create } from 'ipfs-http-client';

const app = express();
const upload = multer(); // Use multer for file uploads
const ipfs = create({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }); // Connect to IPFS gateway

// Upload file to IPFS
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).send('No file uploaded.');
        }

        const result = await ipfs.add(file.buffer);
        res.send({ cid: result.path }); // CID of the uploaded file
    } catch (err) {
        console.error('Error uploading file:', err);
        res.status(500).send('Error uploading file');
    }
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
