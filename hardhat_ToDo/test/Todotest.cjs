const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const assert = require('assert');
const { ethers } = require("hardhat");

describe("Testing contract", function(){

  // deploy token fixtures
  async function deployTokenFixture() {
    const [owner, addr1] = await ethers.getSigners();

    const token = await ethers.deployContract("ToDo");
    await token.waitForDeployment();

    // Fixtures can return anything you consider useful for your tests
    return { token, owner, addr1 };
  }

  // first test check
  it("Check for the getAllTask method to display all task correctly!!!", async function () {
    // for every test now we can use fixture instead of redepolying contract.
    const { token, owner } = await loadFixture(deployTokenFixture);

    await token.addTask("Go to gym!!!");
    await token.addTask("Do some solidity work!!!");
    let getTask = await token.getAllTask();
    console.log(getTask);
    assert.equal(getTask[0].task,"Go to gym!!!");
    assert.equal(getTask[1].task, "Do some solidity work!!!");
    });

});