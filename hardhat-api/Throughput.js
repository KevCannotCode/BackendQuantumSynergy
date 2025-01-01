const axios = require('axios');
const path = require('path');
const ethers = require('ethers');
const FormData = require('form-data');
const fs = require('fs');
const { model } = require('mongoose');
require('dotenv').config();

// Define server and endpoint URLs
const PORT = process.env.PORT || 8080;
const SERVER_URL = "HTTP://localhost:" + PORT;
// const SERVER_URL = "HTTP://172.236.102.179:" + PORT;
const sendFileUrl = `${SERVER_URL}/upload`;
const getFileDetailsUrl = `${SERVER_URL}/files/encrypted_data_hospital1.bin`; // Assuming fileId=1 for testing

// Function to create form data for file upload
function createFormData(filePath) {
    const form = new FormData();
    form.append('machineLearningModel', fs.createReadStream(filePath)); // Attach the file here
    form.append('mlName', 'Test ML Model');
    form.append('modelType', 'Test');
    form.append('owner', '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
    form.append('receiver', '0x70997970C51812dc3A010C7d01b50e0d17dc79C8');
    return form;
}

// Function to measure CPU usage
function getCPUUsage() {
    const usage = process.cpuUsage();
    return (usage.user + usage.system) / 1000; // Convert from microseconds to milliseconds
}

async function callPing() {
    try {
        const response = await axios.get(`${SERVER_URL}/ping`);
        return response.data.message;
    } catch (error) {
        console.error('Error calling ping:', error);
    }
}

async function callPingContract() {
    try {
        const response = await axios.get(`${SERVER_URL}/pingContract`);
        return response.data.message;
    } catch (error) {
        console.error('Error calling ping:', error);
    }
}

async function callSendFile(form) {
    try {
        // Send the file via axios POST request
        const response = await axios.post(sendFileUrl, form, {
            headers: {
                ...form.getHeaders()  // Automatically set the correct Content-Type for FormData
            }
        });

        // Check if the upload was successful
        if (response.status >= 200 && response.status < 300) {
            console.log('File uploaded successfully:', response.data);
            return true; // Success
        } else {
            console.error('Error sending file:', response.statusText);
            return false; // Failure
        }
    } catch (error) {
        console.error('Error in file upload:', error);
        return false; // Failure
    }
}

async function callGetFileDetails() {
    try {
        const response = await axios.get(getFileDetailsUrl);
        return true; // Success
    } catch (error) {
        console.error('Error calling getFileDetails:', error);
        return false; // Failure
    }
}

// Throughput test configuration
const NUM_OF_REQUESTS = 1; // Total requests for testing
let SEND_SUCCESS = 0; // Number of successful sendFile requests
let GET_SUCCESS = 0; // Number of successful getFileDetails requests

async function measureThroughput(call, data) {
    const cpuStart = getCPUUsage(); // CPU usage before transaction
    const start = Date.now();
    
    for (let i = 0; i < NUM_OF_REQUESTS; i++) {
        let success = false;
        if(call === "Send"){
            success = await callSendFile(data);
            if (success) SEND_SUCCESS++; // Only increment if success
        }
        if(call === "Get"){
            success = await callGetFileDetails();
            if (success) GET_SUCCESS++; // Only increment if success
        }
    }

    const end = Date.now();
    const totalTime = (end - start) / 1000; // Total time in seconds
    const throughput = call === 'Send' ? SEND_SUCCESS / totalTime : GET_SUCCESS / totalTime; // Requests per second
    const cpuEnd = getCPUUsage(); // CPU usage after transaction
    const cpuUsage = cpuEnd - cpuStart; // Total CPU usage in milliseconds
    const averageLatency = totalTime * 1000 / NUM_OF_REQUESTS; // Average latency per request in milliseconds

    return { totalTime, throughput, cpuUsage, averageLatency };
}

(async () => {
    const form = createFormData("C:/Users/kevin/Downloads/encrypted_data_hospital1.bin");
    console.log("Throughput Test with " + NUM_OF_REQUESTS + " requests");

    // Measure sendFile throughput
    const sendFileResult = await measureThroughput("Send", form);

    // Measure getFileDetails throughput
    const getFileDetailsResult = await measureThroughput("Get", form);

    console.log('Send File Success:', SEND_SUCCESS);
    console.log('Get File Success:', GET_SUCCESS);
    // Display results in table format
    console.table([
        { 
            Endpoint: 'Sending ML Model', 
            'Total Time (s)': sendFileResult.totalTime.toFixed(2), 
            'Throughput (req/s)': sendFileResult.throughput.toFixed(2),
            'CPU Usage (ms)': sendFileResult.cpuUsage.toFixed(2), 
            'Average Latency (ms)': sendFileResult.averageLatency.toFixed(2)
        },
        { 
            Endpoint: 'Fetching Links to ML Model Link', 
            'Total Time (s)': getFileDetailsResult.totalTime.toFixed(2), 
            'Throughput (req/s)': getFileDetailsResult.throughput.toFixed(2),
            'CPU Usage (ms)': getFileDetailsResult.cpuUsage.toFixed(2), 
            'Average Latency (ms)': getFileDetailsResult.averageLatency.toFixed(2)
        }
    ]);
})();
