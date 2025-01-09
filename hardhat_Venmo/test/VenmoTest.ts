import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import assert from "assert";
import { ethers } from "hardhat";
import Web3, { web3ProvidersMapUpdated } from "web3";

describe("Lottery contract", function () {

  const web3 = new Web3();

  // deploy contract instance / fixtures
  async function deployTokenFixture() {
    const [owner, addr1] = await ethers.getSigners();

    const venmo = await ethers.deployContract("Venmo");
    await venmo.waitForDeployment();

    // Fixtures can return anything you consider useful for your tests
    return { venmo, owner, addr1 };
  }

  // first test
  it("Initially the senders array is empty!!!", async function(){
      // for every test now we can use fixture instead of redepolying contract.
      const { venmo, owner } = await loadFixture(deployTokenFixture);
      assert.equal(venmo.getAllSendersInfo.length,0);
  })

  // second test
  it("After calling the sendEthers function, the array length should increase and balance of receiver should increase!!!", async function(){
      const { venmo, owner, addr1} = await loadFixture(deployTokenFixture);

      const amountToSend = web3.utils.toWei('0.001','ether');
      const message = "Have some fun!!!";
      const initialBalance = await web3.eth.getBalance(addr1.address);

      await venmo.sendEthers(amountToSend,addr1.address,message,{value:amountToSend});

      
      
      const afterTnxBalance = await web3.eth.getBalance(addr1.address); 
      assert.equal(BigInt(initialBalance)+BigInt(amountToSend),(afterTnxBalance));
      // assert.equal(await venmo.getAllSendersInfo.length,1);
      
  })
});