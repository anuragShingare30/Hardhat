import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import Web3 from "web3";

const TokenModule = buildModule("TokenModule", (m:any) => {

  // // constructor params
  // const web3 = new Web3();
  // const entranceFee = web3.utils.toWei("0.0001", "ether"); // 0.0001 ETH
  // const interval = 30; // 30 seconds
  // const initialOwner = "0x5377CC01A598CBf84F6ffa9007Bdfb33cB741273"; 
  // const venmo = m.contract("Venmo",[entranceFee,interval,initialOwner]);


  const venmo = m.contract("Venmo");
  return { venmo };
 });
 
 module.exports = TokenModule;