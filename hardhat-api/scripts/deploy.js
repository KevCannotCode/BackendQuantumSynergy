const hre = require("hardhat");

async function main() {
  const FileTransferContract = await hre.ethers.getContractFactory("FileTransfer");
  const NFTContract = await hre.ethers.getContractFactory("NFT");
  // const FileTransferContract = await hre.ethers.getContractFactory("Token");
  const FileTransferInstance = await FileTransferContract.deploy();
  const NFTInstance = await NFTContract.deploy();
  //   This doesn't work probably due to a solidity version problem. Will check when I have time.
  //   await FileTransferInstance.deployed();

  console.log("FileTransfer deployed to:", FileTransferInstance.address);
  console.log("NFT deployed to:", NFTInstance.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
