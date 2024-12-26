#!/bin/bash

# Define directories
BACKEND_DIR="./backend"
SCRIPTS_DIR="scripts"
LOG_DIR="./run_logs"
LOG_FILE="$LOG_DIR/setup.log"

# Ensure the log directory exists
mkdir -p "$LOG_DIR"

# Store the current directory before the script starts
ORIGINAL_DIR=$(pwd)

# Function to return to the original directory on exit
function go_back() {
    cd "$ORIGINAL_DIR" || exit
}

# Set the trap to go back to the original directory on exit (even on failure)
trap go_back EXIT

# Log all output to the log file
exec > >(tee -a "$LOG_FILE") 2>&1

# Start logging
echo "SETUP MESSAGE: Script started at $(date)"

# Navigate to the backend directory and install dependencies
echo "SETUP MESSAGE: Navigating to backend directory and installing dependencies..."
cd "$BACKEND_DIR" || { echo "Failed to navigate to $BACKEND_DIR"; exit 1; }

npm install || { echo "npm install failed"; exit 1; }
npm install express ethers dotenv || { echo "npm install express ethers dotenv failed"; exit 1; }
npm install --save-dev hardhat || { echo "npm install hardhat failed"; exit 1; }
npm install multer || { echo "npm install multer failed"; exit 1; }

# Install Hardhat toolbox
echo "SETUP MESSAGE: Installing Hardhat toolbox..."
npm install --save-dev @nomicfoundation/hardhat-toolbox || { echo "npm install hardhat-toolbox failed"; exit 1; }

# Start Hardhat local network in the background
echo "SETUP MESSAGE: Starting Hardhat local network..."
nohup npx hardhat node &

# Wait for a few seconds to ensure the Hardhat node starts
echo "SETUP MESSAGE: Waiting for Hardhat network to start..."
sleep 10

# Deploy the smart contract to the localhost network
echo "SETUP MESSAGE: Deploying smart contract..."
npx hardhat run "$SCRIPTS_DIR/deploy.js" --network hardhatNetwork || { echo "Hardhat deploy failed"; exit 1; }

# Navigate back to the backend directory and start the Node.js server
echo "SETUP MESSAGE: Starting Node.js server..."
cd "$BACKEND_DIR" || { echo "Failed to navigate back to $BACKEND_DIR"; exit 1; }
npm start || { echo "npm start failed"; exit 1; }

echo "SETUP MESSAGE: Setup completed successfully at $(date)"
