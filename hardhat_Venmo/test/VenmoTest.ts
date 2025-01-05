import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import assert from "assert";
import { ethers } from "hardhat";

describe("Lottery contract", function () {

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
      assert.equal(venmo.s_sendersInfo.length,0);
  })
});