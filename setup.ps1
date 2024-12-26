# Define directories
$BACKEND_DIR = "hardhat-api\backend"
$SCRIPTS_DIR = "hardhat-api\scripts"

# Navigate to the backend directory and install dependencies
Write-Host "Navigating to backend directory and installing dependencies..."
Set-Location -Path $BACKEND_DIR
npm install
npm install express ethers dotenv
npm install --save-dev hardhat

# Initialize Hardhat in the root directory
Write-Host "Initializing Hardhat..."
Set-Location -Path "..\.."
npx hardhat --init --no-interactive

# Install Hardhat toolbox
Write-Host "Installing Hardhat toolbox..."
npm install --save-dev @nomicfoundation/hardhat-toolbox

# Start Hardhat local network in the background
Write-Host "Starting Hardhat local network..."
Start-Process "npx" -ArgumentList "hardhat node" -NoNewWindow

# Wait for a few seconds to ensure the Hardhat node starts
Start-Sleep -Seconds 5

# Deploy the smart contract to the localhost network
Write-Host "Deploying smart contract..."
npx hardhat run "$SCRIPTS_DIR\deploy.js" --network localhost

# Navigate back to the backend directory and start the Node.js server
Write-Host "Starting Node.js server..."
Set-Location -Path $BACKEND_DIR
npm start

Write-Host "Setup completed successfully!"
