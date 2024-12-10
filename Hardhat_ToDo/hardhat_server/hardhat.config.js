require("@nomicfoundation/hardhat-toolbox");
const { vars } = require("hardhat/config");

const INFURA_API_KEY = vars.get("INFURA_API_KEY");
const ETHERSCAN_ID = vars.get("ETHERSCAN_ID");
const PRIVATE_KEY = vars.get("PRIVATE_KEY");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_ID,
  },
  sourcify: {
    enabled: true,
  },
};