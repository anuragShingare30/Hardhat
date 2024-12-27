require("@nomicfoundation/hardhat-toolbox");
const { vars } = require("hardhat/config");

/** @type import('hardhat/config').HardhatUserConfig */
const fs = require("fs");
const INFURA_API_KEY = vars.get("INFURA_API_KEY");
// const SEPOLIA_PRIVATE_KEY = fs.readFileSync(".private_key").toString().trim();
const SEPOLIA_PRIVATE_KEY = vars.get("SEPOLIA_PRIVATE_KEY");

module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: vars.get("ETHERSCAN_ID"),
  },
  sourcify: {
    enabled: true,
  },
};
