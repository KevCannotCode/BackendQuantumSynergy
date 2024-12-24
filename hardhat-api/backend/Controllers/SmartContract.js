const {contract} = require('../Utils/ContractInitiator');


const saveTolockchain = async (body) => {
    try {
        const { mlName, modelType, owner, receiver} = body;
        // Step 1: Validate Input
        if (!mlName || !modelType || !owner || !receiver) {
            throw new Error("Missing required fields: mlName, modelType, owner, receiver");
        }

        // Step 2: Interact with the Smart Contract
        const timestamp = new Date().toString();
        const mlHash = 'placeholder file hash';
        const contractHash = 'placeholder constract hash';
        
        const tx = await contract.recordMetadata(mlName, mlHash, modelType, timestamp, receiver, contractHash) // Adjust as needed
        const receipt = await tx.wait(); // Wait for transaction confirmation
        const gasUsed = receipt.gasUsed.toString();

        //   //check receipt 
        //   const receiptLog = await web3instance.eth.getTransactionReceipt(tx.hash);

    //       // Check if the transaction receipt has logs (event data)
    //     if (receiptLog && receiptLog.logs && receiptLog.logs.length > 0) {
    //       console.log('Transaction Logs:', receiptLog.logs);
          
    //       // Iterate over the logs to find the MetadataRecorded event
    //       receiptLog.logs.forEach(log => {
    //           // Decode logs by matching the event signature
    //           const eventSignature = 'MetadataRecorded(uint256,string,string,string,string,address,address,string)';
    //           if (log.topics[0] === web3instance.utils.keccak256(eventSignature)) {
    //               console.log('Event Found!');
    //               // Decode log data
    //               const decodedLog = web3instance.eth.abi.decodeLog(
    //                   [
    //                       { type: 'uint256', metadataId: 'metadataId' },
    //                       { type: 'string', mlName: 'mlName' },
    //                       { type: 'string', mlHash: 'mlHash' },
    //                       { type: 'string', modelType: 'modelType' },
    //                       { type: 'string', timestamp: 'timestamp' },
    //                       { type: 'address', owner: 'owner' },
    //                       { type: 'address', receiver: 'receiver' },
    //                       { type: 'string', ncontractHashame: 'contractHash' }
    //                   ],
    //                   log.data,
    //                   log.topics.slice(1) // Remove the first topic (event signature) from the list of topics
    //               );
                  
    //               // Log the decoded values
    //               console.log('Decoded Event Data:', decodedLog);
    //           }
    //       });
    //   } else {
    //       console.log('No logs found for this transaction.');
    //   }

    //   // 5. last attempt at finding the logs
    //   await provider.getLogs({
    //     filter: { sender: owner}, // Filter by sender
    //     fromBlock: 0,
    //     toBlock: 'latest'
    //   })
    //   .then(function(events) {
    //     // Process the filtered events
    //     console.log(events);
    //   })
    //   .catch(function(error) {
    //     // Handle errors
    //     console.error(error);
    //   });

      // Get the transaction receipt
        return ({
            message: "Model sent successfully",
            txHash: tx.hash,
            gasUsed: gasUsed,
        });
    } catch (error) {
        console.error(error);
        throw new Error("Failed to send the model to the blockchain: " + error.message);
    }
};

module.exports = {
    saveTolockchain
}; 