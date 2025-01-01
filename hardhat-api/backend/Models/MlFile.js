// models/File.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const fileSchema = new Schema({
    fileHash: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: false,
    },
    owner: {   
        type: String,
        required: true,
    },
    receiver: {    
        type: String,
        required: true,
    },
    transactionHash: {    
        type: String,
        required: false,
    },
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