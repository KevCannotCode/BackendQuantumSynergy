// models/File.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const fileSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    data: {
        type: Buffer,
        required: true,
    },
    contentType: {
        type: String,
        required: true,
    }
});

const MlFile = mongoose.model('MlFile', fileSchema);
module.exports = MlFile;