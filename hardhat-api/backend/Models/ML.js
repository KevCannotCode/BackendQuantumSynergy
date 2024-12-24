const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const MlSchema = new Schema({
    mlName: {
        type: String,
        required: true,
    },
    mlHash: {
        type: String,
        required: true,
    },
    modelType: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
    owner: {   
        type: String,
        required: true,
    },
    receiver: {    
        type: String,
        required: true,
    },
    contractHash: {    
        type: String,
        required: true,
    }
});

const MLModel = mongoose.model('mlmodels', MlSchema);
module.exports = MLModel;