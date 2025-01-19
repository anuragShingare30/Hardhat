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

  // fourth test - withdraw the earnings
  it("withdraw the earnings of user by withdrawing money!!!", async() =>{
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

    const nftPrice = await nftMarket.connect(owner).getOwnerEarnings();
    const price = await nftMarket.connect(owner).getUserInfo(basicNftContractAddress,0);
    // assert(price[0] == nftPrice);

    const withDrawEarnings = await nftMarket.connect(owner).withdrawEarnings(0);
    withDrawEarnings.wait(1);
    
    assert(price[0] == nftPrice);
  });

});