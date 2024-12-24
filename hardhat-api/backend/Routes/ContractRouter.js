const express = require('express');
const router = express.Router();
const MulterHandler = require('../Middleware/MulterHandler');
const MlFile = require('../Models/MlFile');
const StorageHandling = require('../Controllers/StorageHandling');
const SmartContract = require('../Controllers/SmartContract');

// Endpoint to test the server
router.get('/ping', async (req, res) => {
  console.log('ping called');
  res.status(200).send({ message: 'Pong!'});
});

// Endpoint to test the smart contract
router.get('/pingContract', async (req, res) => {
  try {
      const contractResponse = await contract.ping();
      res.status(200).send({ message: 'Contract responsed ' + contractResponse });
  } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Failed to send model\n' + error });
  }
});

// Route for uploading a PDF file
// router.post('/upload', StorageHandling.setupFileUpload('machineLearningModel'), StorageHandling.fileUpload(), async (req, res) => {
//     console.log('-- Upload Succeeded -- ');
// });
  
router.post('/upload', MulterHandler.setupFileUpload() , async (req, res) => {
    try{
        const file = await StorageHandling.saveFileToDatabase(req.file);
        // Insert line to call smart contract to upload the transaction
        const tx = await SmartContract.saveTolockchain(req.body);
        const name = req.file.originalname;
        res.status(201).send({ message: 'File uploaded successfully', name, tx});
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to upload file\n' + error });
    }
});

  // Route to display a list of uploaded files
  router.get('/files', async (req, res) => {
    try {
      const files = await MlFile.find();
      res.send(files);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error retrieving files from the database.');
    }
  });
  
  // Route to display an individual file based on its ID
  router.get('/files/:id', async (req, res) => {
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

// // Endpoint to get the file counter in the smart contract
// router.get('/getCounter', async (req, res) => {
//   try {
//       const count = await contract.getFileCounter();
//       res.status(200).send({ message: 'Files array size ' + count});
//   } catch (error) {
//       console.error(error);
//       res.status(500).send({ error: 'Failed to get file sent counter\n' + error });
//   }
// });

// //TEST CHANGING PRICE TO LOOK AT GANACHE
// router.post('/transfer', async (req, res) => {
//   const { amount, receiver } = req.body;
//   try {
//       // send transaction
//       const tx = await contract.transfer(receiver, 10);
//       // actual gas used
//       // const gasUsed = receipt.gasUsed.toString();
//       // await tx.wait();
//       res.status(200).send({message: 'Transfer sent successfully'});
//       console.log('Transfer sent successfully');
//   } catch (error) {
//       console.error(error);
//       res.status(500).send({ error: 'Failed to send transfer\n' + error });
//   }
// });

// // Endpoint to send a model to mongo and save the metadata to the blockchain
// router.post('/sendFile', async (req, res) => {
//     try {
//         const { mlName, modelType, owner, receiver} = req.body;
//         // Step 1: Validate Input
//         if (!mlName || !modelType || !owner || !receiver) {
//             return res.status(400).send({ error: "Missing required fields: mlName, modelType, owner, receiver" });
//         }

//         // enter attempt in blockchain 
//         // Step 2: Save the Model to the Database
        
//         await MLController.pushML(req, res); // Calls the controller

//         // Step 3: Interact with the Smart Contract
//         const timestamp = new Date().toString();
//         const mlHash = 'placeholder file hash';
//         const contractHash = 'placeholder constract hash';
//         try {
//           const tx = await contract.recordMetadata(mlName, mlHash, modelType, timestamp, receiver, contractHash) // Adjust as needed
//           const receipt = await tx.wait(); // Wait for transaction confirmation
//           const gasUsed = receipt.gasUsed.toString();
//           //check receipt 
//           const receiptLog = await web3instance.eth.getTransactionReceipt(tx.hash);

//           // Check if the transaction receipt has logs (event data)
//         if (receiptLog && receiptLog.logs && receiptLog.logs.length > 0) {
//           console.log('Transaction Logs:', receiptLog.logs);
          
//           // Iterate over the logs to find the MetadataRecorded event
//           receiptLog.logs.forEach(log => {
//               // Decode logs by matching the event signature
//               const eventSignature = 'MetadataRecorded(uint256,string,string,string,string,address,address,string)';
//               if (log.topics[0] === web3instance.utils.keccak256(eventSignature)) {
//                   console.log('Event Found!');
//                   // Decode log data
//                   const decodedLog = web3instance.eth.abi.decodeLog(
//                       [
//                           { type: 'uint256', metadataId: 'metadataId' },
//                           { type: 'string', mlName: 'mlName' },
//                           { type: 'string', mlHash: 'mlHash' },
//                           { type: 'string', modelType: 'modelType' },
//                           { type: 'string', timestamp: 'timestamp' },
//                           { type: 'address', owner: 'owner' },
//                           { type: 'address', receiver: 'receiver' },
//                           { type: 'string', ncontractHashame: 'contractHash' }
//                       ],
//                       log.data,
//                       log.topics.slice(1) // Remove the first topic (event signature) from the list of topics
//                   );
                  
//                   // Log the decoded values
//                   console.log('Decoded Event Data:', decodedLog);
//               }
//           });
//       } else {
//           console.log('No logs found for this transaction.');
//       }

//       // 5. last attempt at finding the logs
//       await provider.getLogs({
//         filter: { sender: owner}, // Filter by sender
//         fromBlock: 0,
//         toBlock: 'latest'
//       })
//       .then(function(events) {
//         // Process the filtered events
//         console.log(events);
//       })
//       .catch(function(error) {
//         // Handle errors
//         console.error(error);
//       });
//       // Get the transaction receipt
      
//           res.status(200).send({
//               message: "Model sent successfully",
//               txHash: tx.hash,
//               gasUsed: gasUsed,
//           });

//           console.log("Model sent successfully. Transaction Hash:", tx.hash);
//       } catch (blockchainError) {
//         console.log("Blockchain Error:", blockchainError);
//           return res.status(500).send({ error: "Failed to send the model to the blockchain: " + blockchainError.message });
//       }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ error: 'Failed to send model\n' + error });
//     }
// });

// // Endpoint to get a saved model from the mongo database
// router.get('/getFileDetails/:modelId', async (req, res) => {
//     const modelId = req.params.modelId;
//     try {
//         const [sender, receiver, content] = await contract.getFileDetails(modelId);
//         res.status(200).send({ sender, receiver, content});
//         console.log('Model retrieved successfully');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ error: 'Failed to get model\n' + error });
//     }
// });

// // Endpoint to verify signed message
// router.post("/verifyPing", async (req, res) => {
//   const { walletAddress, signature } = req.body;
//   const message = "Please sign this message to authenticate with the server.";

//   // Verify the signature
//   if (verifySignature(walletAddress, signature, message)) {
//     try {
//       const contractResponse = await contract.ping(); // Call the smart contract
//       res.status(200).send({ message: "Ping successful: " + contractResponse });
//     } catch (error) {
//       console.error("Contract call failed:", error);
//       res.status(500).send({ error: "Smart contract call failed." });
//     }
//   } else {
//     res.status(401).send({ error: "Invalid signature. Authentication failed." });
//   }
// });

// Upload And Donwload Start
// // Route for uploading a PDF file
// router.post('/upload', upload.single('machineLearningModel'), async (req, res) => {
//     try {
//       const { originalname, buffer, mimetype } = req.file;
//       const file = await new MlFile({name: originalname, data: buffer, contentType: mimetype});
  
//       await file.save();
//       res.status(201).send('File uploaded successfully.');
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Error uploading the file.');
//     }
//   }
//   );

// // Verify signed message
// function verifySignature(walletAddress, signature, message) {
//     const recoveredAddress = ethers.utils.verifyMessage(message, signature);
//     return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
//   }
module.exports = router;
