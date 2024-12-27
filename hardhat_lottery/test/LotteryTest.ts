const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const assert = require('assert');
const { ethers } = require("hardhat");


describe("Lottery contract", function () {

  // deploy token fixtures
  async function deployTokenFixture() {
  const [owner, addr1, addr2] = await ethers.getSigners();

  const lottery = await ethers.deployContract("Lottery");
  await lottery.waitForDeployment();

  // Fixtures can return anything you consider useful for your tests
  return { lottery, owner, addr1, addr2 };
}

  // first test check
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    // for every test now we can use fixture instead of redepolying contract.
    const { lottery, owner } = await loadFixture(deployTokenFixture);

    
    });


  // second test check
  


});