const multer = require('multer');
require('dotenv').config();

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware to setup file upload for multer before proceeding with file processing
const setupFileUpload = () => {
    // Use multer to handle file upload
    return upload.single(process.env.FILE_KEY); // 'file' should match the name of the file input in the form
};

module.exports = {   
    setupFileUpload
};
