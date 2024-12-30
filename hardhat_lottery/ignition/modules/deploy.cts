// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TokenModule", (m) => {

  // constructor params
  const entranceFee = 1_000_000_000n; // 0.01 ETH
  const interval = 30; // 30 seconds
  const initialOwner = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; 

  const lottery = m.contract("Lottery",[entranceFee,interval,initialOwner]);
  return { lottery };
  
});
