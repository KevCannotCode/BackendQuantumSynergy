
// const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
const MLModel = require("../Models/ML");
const AppointmentModel = require("../Models/Appointment");
// const JWTTokenService = require('jsonwebtoken');
const ObjectId = mongoose.Types.ObjectId;


const pushML = async (req, res, next) => {
    try {
        // Get appointment details
        const { mlName, modelType, owner, receiver} = req.body;
        
        // Data validation
        if (!mlName || !modelType || !owner || !receiver) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        
        // Create Hash
        const mlHash = hashing();
        const timestamp = new Date();
        const contractHash = 'contract hash test';

        // insert Ml model in DB
        const mlModel = new MLModel({ mlName, mlHash, modelType, timestamp, owner, receiver, contractHash });


        // // test reading the DB
        // const alreadyBooked = await AppointmentModel.findOne({ _id: new ObjectId('673fb18634b9e21af2fe78cf') });
        // if (alreadyBooked) {
        //     return res.status(409).json({ message: 'Appointment already exist!', success: false });
        // }

        await mlModel.save();
    } catch (err) {
        res.status(500).json({ message: "Internal server errror => " + err, success: false });
    }
}

const hashing = () => {
    return "hash stuff";
}

/*
    The module.exports object is used to make the functions available to other files.
*/
module.exports = {
    pushML
};