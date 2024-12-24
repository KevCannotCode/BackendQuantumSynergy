const hre = require("hardhat");

async function main() {
  const FileTransferContract = await hre.ethers.getContractFactory("FileTransfer");
  // const FileTransferContract = await hre.ethers.getContractFactory("Token");
  const FileTransferInstance = await FileTransferContract.deploy();
  //   This doesn't work probably due to a solidity version problem. Will check when I have time.
  //   await FileTransferInstance.deployed();

  console.log("FileTransfer deployed to:", FileTransferInstance.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
