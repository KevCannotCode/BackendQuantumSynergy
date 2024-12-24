const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_CONN, {dbName: process.env.DATABASE_NAME})
    .then(() => {
        console.log('MongoDB Connected...');
    }).catch((err) => {
        console.log('MongoDB Connection Error: ', err);
    })

module.exports = mongoose;