const axios = require('axios');
const ethers = require('ethers');

// Define server and endpoint URLs
const serverUrl = 'http://localhost:3000';
const sendFileUrl = `${serverUrl}/sendFile`;
const getFileDetailsUrl = `${serverUrl}/getFileDetails/1`; // Assuming fileId=1 for testing

// Define test data
const testData = {
    url: 'https://example.com/file',
    receiver: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'
};

// Function to calculate gas usage for sendFile


// Function to measure CPU usage
function getCPUUsage() {
    const usage = process.cpuUsage();
    return (usage.user + usage.system) / 1000; // Convert from microseconds to milliseconds
}

async function callPing() {
    try {
        const response = await axios.get(`${serverUrl}/ping`);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        // console.error('Error calling ping:', error);
    }
}

async function callSendFile(data) {
    try {
        const response = await axios.post(sendFileUrl, data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // console.log(response.data);
        return response.data;
    } catch (error) {
        // console.error('Error calling sendFile:', error);
    }
}

async function callGetFileDetails() {
    try {
        const response = await axios.get(getFileDetailsUrl);
        // console.log(response.data);
        return response.data;
    } catch (error) {
        // console.error('Error calling getFileDetails:', error);
    }
}

// Throughput test configuration
const NUM_OF_REQUESTS = 100; // Total requests for testing
const GAS_TOTAL = 100000; // Total gas limit for testing

async function measureThroughput(call, data) {
    const cpuStart = getCPUUsage(); // CPU usage before transaction
    const start = Date.now();
    let gasUsed = 0;
    
    for (let i = 0; i < NUM_OF_REQUESTS; i++) {
        try {
            if(call == "Send"){
                callSendFile(data);
                // const sendFileResponse = await callSendFile(data);
                // gasUsed += sendFileResponse.gasUsed;
            }
            if(call == "Get"){
                callGetFileDetails();
            }
        } catch (error) {
            // console.error(`Error on request ${i + 1}:`, error.message);
        }
    }

    const end = Date.now();
    const totalTime = (end - start) / 1000; // Total time in seconds
    const throughput = NUM_OF_REQUESTS / totalTime; // Requests per second
    const cpuEnd = getCPUUsage(); // CPU usage after transaction
    const cpuUsage = cpuEnd - cpuStart; // Total CPU usage in milliseconds
    const averageLatency = totalTime * 1000 / NUM_OF_REQUESTS; // Average latency per request in milliseconds
    const gasPerRequest = gasUsed / NUM_OF_REQUESTS; // Average gas used per request

    return { totalTime, throughput, cpuUsage, averageLatency, gasPerRequest};
}

(async () => {
    console.log("Throughput Test with " + NUM_OF_REQUESTS + " requests");
    // Measure sendFile throughput
    const sendFileResult = await measureThroughput("Send", testData);
    // console.log('Sending Links to ML Model Results:', sendFileResult);

    // Measure getFileDetails throughput
    const getFileDetailsResult = await measureThroughput("Get", null);
    // console.log('Fetching Links to ML Model Link Results:', getFileDetailsResult);

    // Display results in table format
    console.table([
        { Endpoint: 'Sending ML Model', 'Total Time (s)': sendFileResult.totalTime.toFixed(2), 'Throughput (req/s)': sendFileResult.throughput.toFixed(2), 
            'CPU Usage (ms)': sendFileResult.cpuUsage.toFixed(2), 'Average Latency (ms)': sendFileResult.averageLatency.toFixed(2)
            // ,'Gas Per Request': sendFileResult.gasPerRequest.toFixed(2) 
        },
        { Endpoint: 'Fetching Links to ML Model Link', 'Total Time (s)': getFileDetailsResult.totalTime.toFixed(2), 'Throughput (req/s)': getFileDetailsResult.throughput.toFixed(2), 
            'CPU Usage (ms)': getFileDetailsResult.cpuUsage.toFixed(2), 'Average Latency (ms)': getFileDetailsResult.averageLatency.toFixed(2)
            // ,'Gas Per Request': getFileDetailsResult.gasPerRequest.toFixed(2) 
        }
    ]);
})();