// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract BasicNFT is ERC721 , Ownable {
    mapping (uint256 tokenId => string tokenUri) public s_tokenIdToTokenUri;

    uint256 private s_tokenId;

    event BasicNFT_NFTMinted(address owner,uint256 tokenId,string tokenUri);

    constructor()
        ERC721("BasicNFT", "NFT")
        Ownable(msg.sender)
    {}

    function mintNFT(string memory tokenUri) public onlyOwner {
        uint256 tokenId = s_tokenId;
        s_tokenIdToTokenUri[tokenId] = tokenUri;
        _safeMint(msg.sender, tokenId);
        s_tokenId++;
        emit BasicNFT_NFTMinted(msg.sender,tokenId,tokenUri);
    }

    function getTokenUri(uint256 tokenId) public view returns (string memory){
        return s_tokenIdToTokenUri[tokenId];
    }
}
