// Import the cors library to allow requests from different origins (the frontend)
const cors = require("cors");
// Import the express library
const express = require('express');
// Import the ethers library
const { JsonRpcProvider, Wallet, Contract } = require("ethers");
// Import the env variables
require('dotenv').config();
// Import the database connection
require('./backend/Models/db');
// Import the web3 library
const {Web3} = require('web3');
const web3instance = new Web3(process.env.PROVIDER_URL);
// Import the controller
const MLController = require('./backend/Controllers/MLController');

// Initialize the express app
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware to parse JSON requests
app.use(express.json());
// Allow requests between server and frontend since they are from different origins
app.use(cors());

// Contract configuration
const PROVIDER_URL = process.env.PROVIDER_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
// const PRIVATE_KEY = `0x83387401eea6d3bcc7ad6f0a3ab7502a9c4e597660b40ab6da5a2a5111ed42e5`;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
// const CONTRACT_ADDRESS = `0x7dA84d27c5684722D188127bF31ca657456C3de8`;

// // Transfer contract ABI 
// const CONTRACT_ABI = [
//   {
//     "inputs": [],
//     "stateMutability": "nonpayable",
//     "type": "constructor"
//   },
//   {
//     "anonymous": false,
//     "inputs": [
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "_from",
//         "type": "address"
//       },
//       {
//         "indexed": true,
//         "internalType": "address",
//         "name": "_to",
//         "type": "address"
//       },
//       {
//         "indexed": false,
//         "internalType": "uint256",
//         "name": "_value",
//         "type": "uint256"
//       }
//     ],
//     "name": "Transfer",
//     "type": "event"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "account",
//         "type": "address"
//       }
//     ],
//     "name": "balanceOf",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "name",
//     "outputs": [
//       {
//         "internalType": "string",
//         "name": "",
//         "type": "string"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "owner",
//     "outputs": [
//       {
//         "internalType": "address",
//         "name": "",
//         "type": "address"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "symbol",
//     "outputs": [
//       {
//         "internalType": "string",
//         "name": "",
//         "type": "string"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [],
//     "name": "totalSupply",
//     "outputs": [
//       {
//         "internalType": "uint256",
//         "name": "",
//         "type": "uint256"
//       }
//     ],
//     "stateMutability": "view",
//     "type": "function"
//   },
//   {
//     "inputs": [
//       {
//         "internalType": "address",
//         "name": "to",
//         "type": "address"
//       },
//       {
//         "internalType": "uint256",
//         "name": "amount",
//         "type": "uint256"
//       }
//     ],
//     "name": "transfer",
//     "outputs": [],
//     "stateMutability": "nonpayable",
//     "type": "function"
//   }
// ];

// FileTransfer contract ABI
const CONTRACT_ABI = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "fileId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "content",
        "type": "string"
      }
    ],
    "name": "FileSent",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "metadataId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "mlName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "mlHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "modelType",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "timestamp",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "contractHash",
        "type": "string"
      }
    ],
    "name": "MetadataRecorded",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "fileCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "fileId",
        "type": "uint256"
      }
    ],
    "name": "getFile",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getFileCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "fileId",
        "type": "uint256"
      }
    ],
    "name": "getFileDetails",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "metadataCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "ping",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "mlName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "mlHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "modelType",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "timestamp",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "contractHash",
        "type": "string"
      }
    ],
    "name": "recordMetadata",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "content",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "_receiver",
        "type": "address"
      }
    ],
    "name": "sendFile",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

// Verify env variables
console.log('PROVIDER_URL: ' + PROVIDER_URL);
console.log('PRIVATE_KEY: ' + PRIVATE_KEY);
console.log('CONTRACT_ADDRESS: ' + CONTRACT_ADDRESS);

// Configure the provider and signer
// const provider = new JsonRpcProvider('http://127.0.0.1:8545'); //old network I think Hardhat
const provider = new JsonRpcProvider(PROVIDER_URL); //local ganache
const privateKey = PRIVATE_KEY; // Replace with a test account private key from Hardhat
const wallet = new Wallet(privateKey, provider);
console.log('Wallet Created! : ' + wallet);

// Contract instance new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
console.log('Contract Created! Here is the address : ' + contract); 
// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to send a model
app.get('/ping', async (req, res) => {
  console.log('ping called');
  res.status(200).send({ message: 'Pong!'});
});

app.get('/pingContract', async (req, res) => {
  try {
      const contractResponse = await contract.ping();
      res.status(200).send({ message: 'Contract responsed ' + contractResponse });
  } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Failed to send model\n' + error });
  }
});

app.get('/getCounter', async (req, res) => {
  try {
      const count = await contract.getFileCounter();
      res.status(200).send({ message: 'Files array size ' + count});
  } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Failed to get file sent counter\n' + error });
  }
});

//TEST CHANGING PRICE TO LOOK AT GANACHE
app.post('/transfer', async (req, res) => {
  const { amount, receiver } = req.body;
  try {
      // send transaction
      const tx = await contract.transfer(receiver, 10);
      // actual gas used
      // const gasUsed = receipt.gasUsed.toString();
      // await tx.wait();
      res.status(200).send({message: 'Transfer sent successfully'});
      console.log('Transfer sent successfully');
  } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Failed to send transfer\n' + error });
  }
});

// Endpoint to send a model
app.post('/sendFile', async (req, res) => {
    try {
        const { mlName, modelType, owner, receiver} = req.body;
        // Step 1: Validate Input
        if (!mlName || !modelType || !owner || !receiver) {
            return res.status(400).send({ error: "Missing required fields: mlName, modelType, owner, receiver" });
        }

        // enter attempt in blockchain 
        // Step 2: Save the Model to the Database
        
        await MLController.pushML(req, res); // Calls the controller

        // Step 3: Interact with the Smart Contract
        const timestamp = new Date().toString();
        const mlHash = 'placeholder file hash';
        const contractHash = 'placeholder constract hash';
        try {
          const tx = await contract.recordMetadata(mlName, mlHash, modelType, timestamp, receiver, contractHash) // Adjust as needed
          const receipt = await tx.wait(); // Wait for transaction confirmation
          const gasUsed = receipt.gasUsed.toString();
          //check receipt 
          const receiptLog = await web3instance.eth.getTransactionReceipt(tx.hash);

          // Check if the transaction receipt has logs (event data)
        if (receiptLog && receiptLog.logs && receiptLog.logs.length > 0) {
          console.log('Transaction Logs:', receiptLog.logs);
          
          // Iterate over the logs to find the MetadataRecorded event
          receiptLog.logs.forEach(log => {
              // Decode logs by matching the event signature
              const eventSignature = 'MetadataRecorded(uint256,string,string,string,string,address,address,string)';
              if (log.topics[0] === web3instance.utils.keccak256(eventSignature)) {
                  console.log('Event Found!');
                  // Decode log data
                  const decodedLog = web3instance.eth.abi.decodeLog(
                      [
                          { type: 'uint256', metadataId: 'metadataId' },
                          { type: 'string', mlName: 'mlName' },
                          { type: 'string', mlHash: 'mlHash' },
                          { type: 'string', modelType: 'modelType' },
                          { type: 'string', timestamp: 'timestamp' },
                          { type: 'address', owner: 'owner' },
                          { type: 'address', receiver: 'receiver' },
                          { type: 'string', ncontractHashame: 'contractHash' }
                      ],
                      log.data,
                      log.topics.slice(1) // Remove the first topic (event signature) from the list of topics
                  );
                  
                  // Log the decoded values
                  console.log('Decoded Event Data:', decodedLog);
              }
          });
      } else {
          console.log('No logs found for this transaction.');
      }

      // 5. last attempt at finding the logs
      await provider.getLogs({
        filter: { sender: owner}, // Filter by sender
        fromBlock: 0,
        toBlock: 'latest'
      })
      .then(function(events) {
        // Process the filtered events
        console.log(events);
      })
      .catch(function(error) {
        // Handle errors
        console.error(error);
      });
      // Get the transaction receipt
      
          res.status(200).send({
              message: "Model sent successfully",
              txHash: tx.hash,
              gasUsed: gasUsed,
          });

          console.log("Model sent successfully. Transaction Hash:", tx.hash);
      } catch (blockchainError) {
        console.log("Blockchain Error:", blockchainError);
          return res.status(500).send({ error: "Failed to send the model to the blockchain: " + blockchainError.message });
      }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to send model\n' + error });
    }
});

// Endpoint to get a model
app.get('/getFileDetails/:modelId', async (req, res) => {
    const modelId = req.params.modelId;
    try {
        const [sender, receiver, content] = await contract.getFileDetails(modelId);
        res.status(200).send({ sender, receiver, content});
        console.log('Model retrieved successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to get model\n' + error });
    }
});

// Function to calculate gas usage for sendFile
async function calculateGasUsage() { 
    try {
        // Estimate gas
        const gasEstimate = await contract.estimateGas.sendFile(testData.url, testData.receiver);
        console.log(`Estimated Gas: ${gasEstimate.toString()} units`);

        // Send transaction and get receipt with actual gas used
        const tx = await contract.sendFile(testData.url, testData.receiver);
        const receipt = await tx.wait();

        console.log(`Actual Gas Used: ${receipt.gasUsed.toString()} units`);
        return receipt.gasUsed;
    } catch (error) {
        console.error('Error calculating gas usage:', error);
    }
}

// Endpoint to verify signed message
app.post("/verifyPing", async (req, res) => {
  const { walletAddress, signature } = req.body;
  const message = "Please sign this message to authenticate with the server.";

  // Verify the signature
  if (verifySignature(walletAddress, signature, message)) {
    try {
      const contractResponse = await contract.ping(); // Call the smart contract
      res.status(200).send({ message: "Ping successful: " + contractResponse });
    } catch (error) {
      console.error("Contract call failed:", error);
      res.status(500).send({ error: "Smart contract call failed." });
    }
  } else {
    res.status(401).send({ error: "Invalid signature. Authentication failed." });
  }
});


// Verify signed message
function verifySignature(walletAddress, signature, message) {
  const recoveredAddress = ethers.utils.verifyMessage(message, signature);
  return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
}

// // Execute the function and display result
// calculateGasUsage().then(gasUsed => {
//     console.log(`Gas used by sendFile transaction: ${gasUsed.toString()} units`);
// });

// Upload And Donwload Start
// Route for uploading a PDF file
app.post('/upload', upload.single('machineLearningModel'), async (req, res) => {
  try {
    const { originalname, buffer, mimetype } = req.file;
    const file = await new MlFile({name: originalname, data: buffer, contentType: mimetype});

    await file.save();
    res.status(201).send('File uploaded successfully.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error uploading the file.');
  }
}
);


// Route to display a list of uploaded files
app.get('/files', async (req, res) => {
  try {
    const files = await MlFile.find();
    res.send(files);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving files from the database.');
  }
});

// Route to display an individual file based on its ID
app.get('/files/:id', async (req, res) => {
  try {
    const file = await MlFile.findOne({name: req.params.id});

    if (!file) {TEST
      return res.status(404).send('File not found');
    }

    // Send the file data as a response
    res.contentType(file.contentType);    
    res.setHeader('Content-Disposition', 'attachment; filename=' + file.name);// This ensures the file is downloaded
    res.send(file.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error retrieving the file from the database.');
  }
});

app.use(express.static(__dirname));
// Upload and download End

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
