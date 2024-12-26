#!/bin/bash

# Define directories
BACKEND_DIR="./backend"
SCRIPTS_DIR="./scripts"

# Navigate to the backend directory and install dependencies
echo "SETUP MESSAGE: Navigating to backend directory and installing dependencies..."
cd "$BACKEND_DIR" || exit
npm install
npm install express ethers dotenv
npm install --save-dev hardhat
npm install multer

# Install Hardhat toolbox
echo "SETUP MESSAGE: Installing Hardhat toolbox..."
npm install --save-dev @nomicfoundation/hardhat-toolbox

# Start Hardhat local network in the background
echo "SETUP MESSAGE: Starting Hardhat local network..."
nohup npx hardhat node &

# Wait for a few seconds to ensure the Hardhat node starts
echo "SETUP MESSAGE: Waiting for Hardhat network to start..."
sleep 10

# Deploy the smart contract to the localhost network
echo "SETUP MESSAGE: Deploying smart contract..."
npx hardhat run "$SCRIPTS_DIR/deploy.js" --network hardhatNetwork

# Navigate back to the backend directory and start the Node.js server
echo "SETUP MESSAGE: Starting Node.js server..."
cd "$BACKEND_DIR" || exit
npm start

echo "SETUP MESSAGE: Setup completed successfully!"
