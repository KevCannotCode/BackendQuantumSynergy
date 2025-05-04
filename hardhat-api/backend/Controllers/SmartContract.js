const {contract, NFTContract, NFTMarketplace} = require('../Utils/ContractInitiator');

// const patientAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
// const hospitalAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
// const URL = "https://example.com";

const ping = async () => {
    try {        
        const fileTransferAddress = await contract.getAddress();
        console.log('File Transfer', fileTransferAddress);
        
        const NFTAddress = await NFTContract.getAddress();
        console.log('NFT Contract', NFTAddress);
        
        const NFTMarketplaceAddress = await NFTMarketplace.getAddress();
        console.log('NFT Marketplace', NFTMarketplaceAddress);

        const FileTransferPing = await contract.ping() 
        const NFTPing = await NFTContract.ping();
        const NFTMarketplacePing = await NFTMarketplace.ping();
      // Get the transaction receipt
        return ({
            message: "Contract Ping successfully",
            FileTransfer: FileTransferPing,
            NFT: NFTPing,
            NFTMarketplace: NFTMarketplacePing
        });
    } catch (error) {
        console.error(error);
        throw new Error("Failed to send the model to the blockchain: " + error.message);
    }
};


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

      // Get the transaction receipt
        return ({
            message: "Model sent successfully",
            txHash: tx.hash,
            gasUsed: gasUsed,
            timestamp: timestamp
        });
    } catch (error) {
        console.error(error);
        throw new Error("Failed to send the model to the blockchain: " + error.message);
    }
};

const addTokenToMarket = async (body) => {
    try {
        const { patientAddress, URL} = body;
        // Step 1: Validate Input
        if (!patientAddress || !URL) {
            throw new Error("Missing required fields: patient address, URL");
        }

        const tx = await NFTMarketplace.createNFT(patientAddress, URL);
        await tx.wait();
        let token = await NFTMarketplace.getLastCreatedNFT();
        token = token.toString();
        return {
            message: "NFT was created successfully",
            nft: token,
            transaction_hash: tx.hash,
        };
    } catch (error) {
      console.error(error);
      throw new Error("Failed to send the model to the blockchain: " + error.message);
    }
  };

const getTokenCountFromMarket = async () => {
    try {
        const tokenCount = parseInt(await NFTMarketplace.getTokenCounter(), 10);
        return ({
            message: "Token Count Retrieved Successfully",
            transaction_hash: tokenCount.hash,
            tokenCount: tokenCount
        });
    } catch (error) {
        console.error(error);
        throw new Error("Failed to send the model to the blockchain: " + error.message);
    }
};

const getPatientDataFromMarket = async (body) => {
    try {
        const { tokenId, hospitalAddress} = body;
        // Step 1: Validate Input
        if (!hospitalAddress || !tokenId) {
            throw new Error("Missing required fields: hospital address, tokenId");
        }
        const result = await NFTMarketplace.accessPatientData(tokenId, hospitalAddress);

        return {
            message: "Token data retrieved successfully",
            nft: result.toString()
        };
    } catch (error) {
        console.error(error);
        throw new Error("Failed to get patient data: " + error.message);
    }
};

const grantAccessFromMarket = async (body) => {
    try {
        const { tokenId, hospitalAddress} = body;
        // Step 1: Validate Input
        if (!hospitalAddress || !tokenId) {
            throw new Error("Missing required fields: hospital address, tokenId");
        }
        const accessReq = await NFTMarketplace.grantAccess(tokenId, hospitalAddress);
        return ({
            message: "Hospital granted access successfully",// we do this manually for now because the grantAccess in the contract is not view only. It changes the state and fucntions that change states don't return values.
            //since we have a try catch in the contract, we assume that if it doesn't throw an error, it was successful.
        });
    } catch (error) {
        console.error(error);
        throw new Error("Failed to send the model to the blockchain: " + error.message);
    }
};

module.exports = {
    saveTolockchain,
    addTokenToMarket,
    ping,
    getTokenCountFromMarket,
    getPatientDataFromMarket,
    grantAccessFromMarket
}; 