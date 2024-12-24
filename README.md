
# QuantumSynergy

## Repository Structure

- **root/backend**: Contains the Node.js server code that allows API endpoints to interact with the blockchain (smart contract).
- **root/contracts**: Contains smart contracts written in Solidity.
- **root/test**: Contains test files for smart contracts.
- **root/scripts**: Contains deployment scripts for publishing smart contracts to a blockchain network.

## Installation Steps

### Setup Node.js Server

1. Navigate to `hardhat-api`:
    ```sh
    cd hardhat-api
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Install additional packages:
    ```sh
    npm install express ethers dotenv
    npm install --save-dev hardhat
    ```

### Setup Hardhat

1. Initialize Hardhat in root directory (hardhat-api folder) :
    ```sh
    npx hardhat
    ```
2. Install Hardhat toolbox:
    ```sh
    npm install --save-dev @nomicfoundation/hardhat-toolbox
    ```
4. Start the localhost network:
    ```sh
    npx hardhat node
    ```
    **NOTE: all the transactions, accounts will be listed here so keep an eye on this terminal**
   
6. In a separate terminal, deploy the contract to localhost from the root directory:
    ```sh
    npx hardhat run scripts/deploy.js --network localhost
    ```
7. Start the Node.js server:
    ```sh
    cd backend
    npm start
    ```

## Testing
   - In case you need to test the smart contract, you can use a prewritten test script.
    
1. Test smart contracts:
    ```sh
    npx hardhat test
    ```
### Debugger
   - You can use the debugger uploaded in the vsode directory to put breakpoints in the server.js file

### Postman
   - When the server is running here is how you can interact with the server and the blockchain.
 
1. Test if the server is listening:
    ```http
    GET http://localhost:3000/ping
    ```
2. Test the smart contract:
    ```http
    POST http://localhost:3000/sendFile
    ```
    ```json
    {
         "url": "TEST URL SENT",
         "receiver": "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    }
    ```
    (Copy the account address from the Hardhat network)
