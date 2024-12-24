require('dotenv').config();
// Import the ethers library
const { JsonRpcProvider, Wallet, Contract } = require("ethers");
// Import the web3 library
const {Web3} = require('web3');
const web3instance = new Web3(process.env.PROVIDER_URL);

const PROVIDER_URL = process.env.PROVIDER_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
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

const provider = new JsonRpcProvider(PROVIDER_URL); //local ganache
const wallet = new Wallet(PRIVATE_KEY, provider);
console.log('Wallet Created! : ' + wallet);

// Contract instance new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
console.log('Contract Created! Here is the address : ' + contract); 

// Export the contract instance and other variables
module.exports = {
    provider,
    contract,
    wallet,
    web3instance
}