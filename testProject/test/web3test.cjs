const { loadFixture, } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const assert = require('assert');
const {ethers} = require("hardhat");

describe("Token contract", function () {

  // fixture setup
  async function deployTokenFixture() {
    const {owner,addr1,addr2} = await ethers.getSigners();

    const token = await ethers.deployContract("Web3");
    await token.waitForDeployment();
    return {token, owner, addr1, addr2};
  };
  // first test check
    it("Deployment should assign the total supply of tokens to the owner", async function (){
      
      const {token,owner} = await loadFixture(deployTokenFixture);
      console.log(owner);
  
      const ownerBalance = await token.balanceOf(owner.address);
      assert.equal(await token.totalSupply(), ownerBalance);
      assert.equal(await token.name(), "Web3");
    });
  }); 