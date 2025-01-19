import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import assert from "assert";
import { ethers } from "hardhat";
import { Web3 } from 'web3';
import { string } from "hardhat/internal/core/params/argumentTypes";

const web3 = new Web3();
describe("Token contract", function () {
    // deploy token fixtures
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

    const basicNft = await ethers.deployContract("BasicNFT");
    await basicNft.waitForDeployment();
    const basicNftContractAddress = basicNft.getAddress();
    const nftMarket = await ethers.deployContract("NFTMarket");
    await nftMarket.waitForDeployment();
    const nftMarketContractAddress = nftMarket.getAddress();

    // Fixtures can return anything you consider useful for your tests
    return { basicNft, nftMarket, owner, addr1, addr2,basicNftContractAddress,nftMarketContractAddress };
  }

   

  // Second test - listing nft by owner
  it("List the minted nft owned by owner", async()=>{
    const { basicNft, nftMarket, owner, addr1, addr2,basicNftContractAddress,nftMarketContractAddress } = await loadFixture(deployTokenFixture);

    const mintNft = await basicNft.connect(owner).mintNFT("anurag");
    await mintNft.wait(1);

    const setApproval = await basicNft.connect(owner).setApprovalForAll(nftMarketContractAddress,true);
    await setApproval.wait(1);

    const amount = web3.utils.toWei("1",'ether');
    const TOKEN_ID = 0;
    const listNft = await nftMarket.connect(owner).listNFT(basicNftContractAddress,0,amount);
    listNft.wait(1);

    const nftOwner = await nftMarket.connect(owner).getUserInfo(basicNftContractAddress, TOKEN_ID);
    const testOwner = await basicNft.connect(owner).ownerOf(TOKEN_ID);
    assert(testOwner == nftOwner[1]);
  });
});