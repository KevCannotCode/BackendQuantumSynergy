// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition
const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FileTransferModule", (m) => {
  const FileTransfer = m.contract("FileTransfer");

  return { FileTransfer };
});

module.exports = FileTransferModule;