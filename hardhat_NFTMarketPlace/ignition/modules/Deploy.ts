import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export const TokenModule = buildModule("TokenModule", (m:any) => {
    // constructor params

    const basicNft = m.contract("BasicNFT");
    const nftMarket = m.contract("NFTMarket");

  return { basicNft,nftMarket };
});

module.exports = TokenModule;