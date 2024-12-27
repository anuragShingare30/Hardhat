// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol"; 
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol"; 
import "hardhat/console.sol";

contract Web3 is ERC721, ERC721Enumerable, ERC721Pausable, Ownable { 
    uint256 private _nextTokenId;
    uint256 constant maxSupply = 3;
    uint allowListFund = 0.001 ether;
    uint publicMintFund = 0.01 ether;

    bool public publicMintOpen = false;
    bool public allowListMintOpen = false;

    mapping(address => bool) public allowListAddress;

    mapping(address => uint) public checkBalance;

    modifier minting(){
        require(totalSupply() < maxSupply, "We sold out!!!");
        _;
    }
    modifier allowListMinting(uint fund){
        // HERE WE ARE INDIRECTLY SETTING THE NFT's PRICE
        require(msg.value == fund, "Not enough funds!!!");
        _;
    }
    modifier windowStatus(bool _status){
        require(_status, "Minting is closed!!!");
        _;
    }

    constructor() ERC721("Web3", "ERC721") Ownable(msg.sender) {}

    function _baseURI() internal pure override returns (string memory) {
        // THIS STORE OUR NFTs IMAGE AND METADATA, ITS THE UNIQUE IDENTIFIER.
        return "ipfs://QmY5rPqGTN1rZxMQg2ApiSZc7JiBNs1ryDzXPZpQhC1ibm/";
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }


    function editMintingWindow(bool _publicMintOpen, bool _allowListMintOpen) external onlyOwner{
        publicMintOpen = _publicMintOpen;
        allowListMintOpen = _allowListMintOpen;
    }

    function setAllowList(address[] memory addresses) external  onlyOwner{
        for(uint i=0;i<addresses.length;i++){
            allowListAddress[addresses[i]] = true;
        }
    }

    // ONLY ALLOWED ADDRESS WILL BE ALLOWED TO MINT THE NFTS
    function allowListMint() public payable windowStatus(allowListMintOpen)  allowListMinting(allowListFund) minting{
        require(allowListAddress[msg.sender], "You are not in allow list!!!");
        mintingFuntion();
    }


    // MINTING FUNCTION TO MINT AN NFTs (public)
    function publicMint() public payable windowStatus(publicMintOpen) allowListMinting(publicMintFund) minting{
        console.log(msg.sender);
        mintingFuntion();
    }

    
    function mintingFuntion() internal {
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
    } 

    function withDrawMoney(address _address) external payable {
        uint balance = address(this).balance;
        payable(_address).transfer(balance);
    }

    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override(ERC721, ERC721Enumerable, ERC721Pausable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    receive() external payable {}
}
