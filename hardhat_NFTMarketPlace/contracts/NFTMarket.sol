// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.22;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";


contract NFTMarket is ReentrancyGuard,Ownable{
    // errors
    error NFTMarket_YouAreNotOwnerOfThisNFT();
    error NFTMarket_NFTIsAlreadyListed();
    error NFTMarket_nftPriceShouldBeGreaterThanZero();
    error NFTMarket_ApprovalNotGivenForThisContract();
    error NFTMarket_NotEnoughMoneySentToBuyNFT();
    error NFTMarket_NotEnoughAmountAvailableToWithdraw();
    error NFTMarket_WithDrawTNXFailed();

    // type declaration
    struct Listing{
        uint256 nftPrice;
        address nftOwner;
    }

    // statevariables
    mapping (address nftAddress => mapping (uint256 tokenId => Listing)) public s_nftListing;
    mapping (address nftOwner => uint256 ownerEarnings) public s_NftOwnerEarnings;

    // events
    event NFTMarket_ListedNFT(address nftOwner,uint256 tokenId, uint256 nftPrice);
    event NFTMarket_BuyedNFT(address nftOwner,address nftBuyer,uint256 tokenId,uint256 nftprice);
    event NFTMarket_WithdrawOwnerEarnings(address nftOwner,uint256 tokenId,uint256 amountWithDrawed);

    // modifiers
    modifier isNotOwner(uint256 tokenId, address nftOwner,address nftAddress){
        IERC721 nft = IERC721(nftAddress);
        address owner = nft.ownerOf(tokenId);
        if(owner != nftOwner){
            revert NFTMarket_YouAreNotOwnerOfThisNFT();
        }
        _;
    }
    modifier isNotListed(address nftAddress,uint256 tokenId){
        if(s_nftListing[nftAddress][tokenId].nftPrice > 0){
            revert NFTMarket_NFTIsAlreadyListed();
        }
        _;
    }


    // external functions
    constructor()
        Ownable(msg.sender){}

    function listNFT(
        address nftAddress,
        uint256 tokenId,
        uint256 nftPrice
    ) public isNotOwner(tokenId,msg.sender,nftAddress) isNotListed(nftAddress,tokenId) nonReentrant {
        if(nftPrice <= 0){
            revert NFTMarket_nftPriceShouldBeGreaterThanZero();
        }
        IERC721 nft = IERC721(nftAddress);
        if(nft.getApproved(tokenId) != address(this)){
            revert NFTMarket_ApprovalNotGivenForThisContract();
        }
        s_nftListing[nftAddress][tokenId] = Listing(nftPrice,msg.sender);
        emit NFTMarket_ListedNFT(msg.sender,tokenId,nftPrice);
    }

    function buyNFT(
        address nftAddress,
        uint256 tokenId
    ) public payable nonReentrant {
        uint256 nftPrice = s_nftListing[nftAddress][tokenId].nftPrice;
        if(msg.value < nftPrice){
            revert NFTMarket_NotEnoughMoneySentToBuyNFT();
        }
        IERC721 nft = IERC721(nftAddress);
        address nftOwner = s_nftListing[nftAddress][tokenId].nftOwner;
        s_NftOwnerEarnings[nftOwner] += msg.value;
        nft.safeTransferFrom(nftOwner, msg.sender, tokenId, "");
        // delete (s_nftListing[nftAddress][tokenId]);
        s_nftListing[nftAddress][tokenId].nftOwner = msg.sender;
        emit NFTMarket_BuyedNFT(nftOwner,msg.sender,tokenId,nftPrice);
    }

    function withdrawEarnings(
        uint256 tokenId
    ) public payable  nonReentrant {
        uint256 amountToWithdraw = s_NftOwnerEarnings[msg.sender];
        if(amountToWithdraw <= 0){
            revert NFTMarket_NotEnoughAmountAvailableToWithdraw();
        }
        s_NftOwnerEarnings[msg.sender] = 0;
        (bool success,) = (msg.sender).call{value:amountToWithdraw}("");
        if(!success){
            revert NFTMarket_WithDrawTNXFailed();
        }
        emit NFTMarket_WithdrawOwnerEarnings(msg.sender,tokenId,amountToWithdraw);
    }
}