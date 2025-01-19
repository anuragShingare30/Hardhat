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
  // Third test - buy nft
  it("Buy the listed nft", async()=>{
    const { basicNft, nftMarket, owner, addr1, addr2,basicNftContractAddress,nftMarketContractAddress } = await loadFixture(deployTokenFixture);
    

    const mintNft = await basicNft.connect(owner).mintNFT("anurag");
    await mintNft.wait(1);

    const setApproval = await basicNft.connect(owner).setApprovalForAll(nftMarketContractAddress,true);
    await setApproval.wait(1);

    const amount = web3.utils.toWei("1",'ether');
    const TOKEN_ID = 0;
    const listNft = await nftMarket.connect(owner).listNFT(basicNftContractAddress,0,amount);
    listNft.wait(1);

    const buyNft = await nftMarket.connect(addr1).buyNFT(basicNftContractAddress,TOKEN_ID, {
      value:amount,
      from:addr1,
      gasPrice:undefined
    })
    buyNft.wait(1);

    const newNftOwner = await nftMarket.connect(owner).getOwnerOfTokenId(basicNftContractAddress,0);
    const testOwner = await basicNft.connect(owner).ownerOf(TOKEN_ID);
    assert(newNftOwner == testOwner);
  });
});