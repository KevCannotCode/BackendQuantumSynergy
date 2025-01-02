const axios = require('axios');
const path = require('path');
const ethers = require('ethers');
const FormData = require('form-data');
const fs = require('fs');
const { model } = require('mongoose');
require('dotenv').config();

// Increase the max listeners to avoid memory leak warning
require('events').EventEmitter.defaultMaxListeners = 20; // Increase this number based on the number of requests

const NUM_OF_REQUESTS = 100; // Total requests for testing

// Define server and endpoint URLs
const PORT = process.env.PORT || 8080;
// const SERVER_URL = "HTTP://localhost:" + PORT;
const SERVER_URL = "HTTP://172.236.102.179:" + PORT;
const sendFileUrl = `${SERVER_URL}/upload`;
const getFileDetailsUrl = `${SERVER_URL}/files/encrypted_data_hospital1.bin`; // Assuming fileId=1 for testing

// Function to create form data for file upload
function createFormData(filePath) {
    const form = new FormData();
    // form.append('machineLearningModel', fs.createReadStream(filePath)); // Attach the file here
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

//FETCH
async function callSendFile(filePath) {
    try {

        const { default: fetch } = await import("node-fetch");
        // Create a new FormData object
        const formData = new FormData();

        // Append the file and other necessary form fields (use your own file and parameters)
        formData.append("machineLearningModel", fs.createReadStream("./encrypted_data_hospital1.bin"));
        formData.append("mlName", "Poster");
        formData.append("modelType", "Model Version Testing");
        formData.append("owner", "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266");
        formData.append("receiver", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");

        // Set up the request options
        const requestOptions = {
            method: "POST",
            body: formData,
            redirect: "follow",
            headers: formData.getHeaders(),  // Automatically set the necessary headers for FormData
        };

        // Send the request using fetch
        const response = await fetch(sendFileUrl, requestOptions);

        // Process the response
        if (response.ok) {
            const result = await response.text();  // You can also use .json() if the response is in JSON
            console.log(result);
            return true;
        } else {
            console.error('Error sending file:', response.statusText);
            return false;
        }
    } catch (error) {
        console.error('Error in file upload:', error);
        return false;
    }
}

// //GOT
// async function callSendFile(form) {
//     try {
//         const { default: got } = await import('got');
//         console.log(form.getHeaders());
//         // Send the file via got
//         const response = await got.post(sendFileUrl, {
//             // body: null,
//             headers: form.getHeaders(), // Add the necessary headers for FormData
//         });

//         // Check if the upload was successful
//         if (response.statusCode >= 200 && response.statusCode < 300) {
//             console.log('File uploaded successfully');
//             return true; // Success
//         } else {
//             console.error('Error sending file:', response.statusCode);
//             return false; // Failure
//         }
//     } catch (error) {
//         console.error('Error in file upload:', error.message);
//         return false; // Failure
//     }
// }

// //Fetch
// async function callSendFile(form) {
//     try {
//         // Validate if 'form' is a FormData object
//         if (!(form instanceof FormData)) {
//             console.error('The provided form is not an instance of FormData');
//             return false;
//         }
//         // Send the file via fetch
//         const response = await fetch(sendFileUrl, {
//             method: 'POST',
//             body: form,  // FormData object with the file
//         });

//         // Check if the upload was successful
//         if (response.ok) {
//             return true; // Success
//         } else {
//             console.error('Error sending file:', response.statusText);
//             return false; // Failure
//         }
//     } catch (error) {
//         console.error('Error in file upload:', error);
//         return false; // Failure
//     }
// }

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
    const form = createFormData("C:./encrypted_data_hospital1.bin");
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
