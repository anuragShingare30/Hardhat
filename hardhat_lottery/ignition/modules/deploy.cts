// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const TokenModule = buildModule("TokenModule", (m: { contract: (arg0: string) => any; }) => {
  const token = m.contract("Lottery");

  return { token };
});

module.exports = TokenModule;
