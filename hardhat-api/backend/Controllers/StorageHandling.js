// app.js
const MlFile = require('../Models/MlFile');
require('dotenv').config();

// // Route for uploading a PDF file
// const fileUpload = async (req, res) => {
//         try {
//             const { originalname, buffer, mimetype } = req.file;
//             const file = await new MlFile({name: originalname, data: buffer, contentType: mimetype});
            
//             await file.save();
//             res.status(201).send('File uploaded successfully.');
//         } catch (error) {
//             console.error(error);
//             res.status(500).json({ message: 'Error uploading the file.' + error});
//         }
//     };

const saveFileToDatabase = async (file) => {
    try {
        const { originalname, buffer, mimetype } = file;
        const newFile = await new MlFile({name: originalname, data: buffer, contentType: mimetype});
            
        await newFile.save();
        return newFile;
    } catch (error) {
        throw new Error('Error uploading the file.' + error.message);
    }
};

// // Route to display a list of uploaded files
// app.get('/files', async (req, res) => {
//   try {
//     const files = await MlFile.find();
//     res.send(files);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error retrieving files from the database.');
//   }
// });

// // Route to display an individual file based on its ID
// app.get('/files/:id', async (req, res) => {
//   try {
//     const file = await MlFile.findOne({name: req.params.id});

//     if (!file) {TEST
//       return res.status(404).send('File not found');
//     }

//     // Send the file data as a response
//     res.contentType(file.contentType);    
//     res.setHeader('Content-Disposition', 'attachment; filename=' + file.name);// This ensures the file is downloaded
//     res.send(file.data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error retrieving the file from the database.');
//   }
// });

module.exports = {
    saveFileToDatabase
};
