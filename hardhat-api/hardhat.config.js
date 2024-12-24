require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    localganache: {
      // url: process.env.PROVIDER_URL,
      url: `HTTP://127.0.0.1:7545`,
      // accounts: [`0x${process.env.PRIVATE_KEY}`]
      accounts: [`0x83387401eea6d3bcc7ad6f0a3ab7502a9c4e597660b40ab6da5a2a5111ed42e5`]
    }
  }
};