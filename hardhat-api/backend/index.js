// Import the cors library to allow requests from different origins (the frontend)
const cors = require("cors");
// Import the express library
const express = require('express');
// Import the env variables
require('dotenv').config();
// Import the database connection
require('./Models/db');
// Import the routes
const ContractRouter = require('./Routes/ContractRouter');

// Initialize the express app
const app = express();
app.use(express.json());// Middleware to parse JSON requests
app.use(cors());// Allow requests between server and frontend since they are from different origins
app.use(express.json());// Middleware to parse JSON requests
app.use(express.static(__dirname)); // Serve static files

//Variable initialization
const PORT = process.env.PORT || 3000;
const SERVER_URL = process.env.SERVER_URL;


// // Function to calculate gas usage for sendFile
// async function calculateGasUsage() { 
//     try {
//         // Estimate gas
//         const gasEstimate = await contract.estimateGas.sendFile(testData.url, testData.receiver);
//         console.log(`Estimated Gas: ${gasEstimate.toString()} units`);

//         // Send transaction and get receipt with actual gas used
//         const tx = await contract.sendFile(testData.url, testData.receiver);
//         const receipt = await tx.wait();

//         console.log(`Actual Gas Used: ${receipt.gasUsed.toString()} units`);
//         return receipt.gasUsed;
//     } catch (error) {
//         console.error('Error calculating gas usage:', error);
//     }
// }

// // Execute the function and display result
// calculateGasUsage().then(gasUsed => {
//     console.log(`Gas used by sendFile transaction: ${gasUsed.toString()} units`);
// });
// Upload and download End


// Start the server

// Setup the routes
app.use('', ContractRouter);

app.listen(PORT, () => {
    console.log(`Server is running on ${SERVER_URL}:${PORT}`);
});