import multer from "multer";
import path from 'path'

const storage = multer.diskStorage({
    filename: (req, file, cb)=> {
        const fileName = Date.now() + path.extname(file.originalname);
        cb(null, fileName);
    },
    destination : (req, file, cb) => {
        cb(null, 'uploads/');
    }
});

const fileFilter = (req, file, cb) => {
    // Accept image only
    if (!file.mimetype.startsWith('image/')) {
        cb(new Error('Only image files are allowed!'), false);
    } else {
        cb(null, true);
    }
};


const limits = {
    fileSize: 2 * 1024 * 1024, // 2 MB in bytes
    fileFilter
};

const upload = multer({
    storage,
    limits,
})

export default upload;