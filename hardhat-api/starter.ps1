# Define directories
$BACKEND_DIR = "/backend"
$SCRIPTS_DIR = "scripts"

# Navigate to the backend directory and install dependencies
Write-Host "SETUP MESSAGE: Navigating to backend directory and installing dependencies..."
# Set-Location -Path $BACKEND_DIR
npm install
npm install express ethers dotenv
npm install --save-dev hardhat
npm install multer

# # Initialize Hardhat in the root directory
# Write-Host "Initializing Hardhat..."
# Set-Location -Path "..\.."
# npx hardhat --init --no-interactive

# Install Hardhat toolbox
Write-Host "SETUP MESSAGE: Installing Hardhat toolbox..."
npm install --save-dev @nomicfoundation/hardhat-toolbox

# Start Hardhat local network in the background
Write-Host "SETUP MESSAGE: Starting Hardhat local network..."
Start-Process "npx" -ArgumentList "hardhat node" -NoNewWindow

# Wait for a few seconds to ensure the Hardhat node starts
Start-Sleep -Seconds 10

# Deploy the smart contract to the localhost network
Write-Host "SETUP MESSAGE: Deploying smart contract..."
npx hardhat run "$SCRIPTS_DIR\deploy.js" --network hardhatNetwork

# Navigate back to the backend directory and start the Node.js server
Write-Host "SETUP MESSAGE: Starting Node.js server..."
Set-Location -Path "./$BACKEND_DIR"
npm start

Write-Host "SETUP MESSAGE: Setup completed successfully!"
