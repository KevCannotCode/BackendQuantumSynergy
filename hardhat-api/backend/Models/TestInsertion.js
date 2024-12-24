// Models/TestInsertion.js
const mongoose = require('mongoose');

const TestInsertionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
});

const TestInsertionModel = mongoose.model('TestInsertion', TestInsertionSchema); // Unique collection name
module.exports = TestInsertionModel;