import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import assert from "assert";
import { ethers } from "hardhat";


describe("Token contract", function () {
    // deploy token fixtures
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const basicNft = await ethers.deployContract("BasicNFT");
    await basicNft.waitForDeployment();
    const nftMarket = await ethers.deployContract("NFTMarket");
    await nftMarket.waitForDeployment();

    // Fixtures can return anything you consider useful for your tests
    return { basicNft, nftMarket, owner, addr1, addr2 };
  }

   // First test
  it("Check the mint function from basicNft contract!!!", async () => {
    const { basicNft, nftMarket, owner, addr1, addr2 } = await loadFixture(deployTokenFixture);
    const basicNftContractAddress = basicNft.getAddress();
    const nftMarketContractAddress = nftMarket.getAddress();
    
    const mintNft = await basicNft.connect(owner).mintNFT("anurag");
    await mintNft.wait(1);

    const setApproval = await basicNft.connect(owner).setApprovalForAll(nftMarketContractAddress,true);
    await setApproval.wait(1);

    const checkApprovalMethod = await basicNft.connect(owner).isApprovedForAll(owner,nftMarketContractAddress);
    assert(checkApprovalMethod == true);
  })
});