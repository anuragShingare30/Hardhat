// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";


/**
 @title Sample smart contract for Decentralized Exchange Protocol
 @author Anurag Shingare
 @notice The contract is a sample smart contract for Decentralized exchange DeFi protocol
 @dev The contract and DEX working flow will be
    1. Mint ERC20 tokens
        a. Mint three tokens with some premint value
        b. This three tokens only will be used as swapping tokens with ETH
    2. Set Exchange Rates(optinal)
        a. We can set some exchange rates for swapping tokens with ETH
    3. Swapping ETH for Tokens
        a. A user sends x ETH to the contract.
        b. Contract stores this ETH and updates the user's balance
        c. Contract transfers tokens to user
        d. User needs to approve the contract to sent the tokens/ETH
    4. Swapping Tokens for ETH
        a. The user approves the contract to spend x tokens
        b. Transfer the calculated ETH amount from the contract to the user 
        c. User get the calculated amount of ETH for tokens from contract!!!
 */


contract BaseToken is ERC20 {
    constructor(string memory tokenName, string memory tokenSymbol)
        ERC20(tokenName, tokenSymbol)
    {
        _mint(msg.sender, 1000000 * 10**decimals());
    }
}

contract DecentralizedExchange {
    // errors
    error DecentralizedExchange_ZeroAmountNotAllowed();
    error DecentralizedExchange_NotEnoughMoneySent();
    error DecentralizedExchange_swapETHToToken_TransactionFailed();
    error DecentralizedExchange_ZeroAmountSwapNotAllowed();
    error DecentralizedExchange_NotEnoghMoneyToSwapTokens();
    error DecentralizedExchange_NotEnoughAmountToSwap();
    error DecentralizedExchange_swapTokenToETH_TransactionFailed_Transfer();
    error DecentralizedExchange_ProtocolIsCurrentlyRunningLow();
    error DecentralizedExchange_swapTokenToETH_TransactionFailed_TransferFrom();
    error DecentralizedExchange_swapTokenToETH_TransactionFailed_Approve();
    error DecentralizedExchange_ZeroAmountNotAllowed_swapTokenToToken();
    error DecentralizedExchange_CannotSwapTwoSameTokens();
    error DecentralizedExchange_swapTokenToToken_transferFrom();
    error DecentralizedExchange_swapTokenToToken_transfer();
    error DecentralizedExchange_GivenTokenIsNotValid(string tokenName);

    // type declaration
    BaseToken baseToken;

    // state variables
    string[] private tokens = ["DAI", "RAI", "KREX"];
    mapping(string => ERC20) private s_token;

    // events
    event DecentralizedExchange_SwapETHToToken(
        string tokenName,
        uint256 amountToSwap,
        address to
    );
    event DecentralizedExchange_SwapTokenToETH(
        string tokenName,
        uint256 amountToSwap,
        address to
    );

    // modifiers
    modifier notValidToken(string memory tokenName){
        bool isValid = false;
        for(uint256 i=0;i<tokens.length;i++){
            if(keccak256(bytes(tokenName)) == keccak256(bytes(tokens[i]))){
                isValid = true;
                break;
            }
        }
        if(!isValid){
            revert DecentralizedExchange_GivenTokenIsNotValid(tokenName);
        }
        _;
    }

    // EXTERNAL AND PUBLIC FUNCTIONS
    constructor() {
        for (uint256 i = 0; i < tokens.length; i++) {
            baseToken = new BaseToken(tokens[i], tokens[i]);
            s_token[tokens[i]] = baseToken;
        }
    }

    function swapETHToToken(string memory tokenName, uint256 amountToSwap)
        public
        payable
        notValidToken(tokenName)
    {
        if (msg.value == 0) {
            revert DecentralizedExchange_ZeroAmountNotAllowed();
        }
        if (msg.value < amountToSwap) {
            revert DecentralizedExchange_NotEnoughMoneySent();
        }
        bool success = s_token[tokenName].transfer(msg.sender, amountToSwap);
        if (!success) {
            revert DecentralizedExchange_swapETHToToken_TransactionFailed();
        }

        emit DecentralizedExchange_SwapETHToToken(
            tokenName,
            amountToSwap,
            msg.sender
        );
    }

    function swapTokenToETH(string memory tokenName, uint256 amountToSwap)
        public
        payable
        notValidToken(tokenName)
    {   
        uint256 userBalance = s_token[tokenName].balanceOf(msg.sender);

        if (userBalance < amountToSwap) {
            revert DecentralizedExchange_NotEnoughAmountToSwap();
        }
        if (userBalance == 0) {
            revert DecentralizedExchange_NotEnoghMoneyToSwapTokens();
        }
        if (address(this).balance < amountToSwap) {
            revert DecentralizedExchange_ProtocolIsCurrentlyRunningLow();
        }

        // Check allowance before transferring tokens
        uint256 allowance = s_token[tokenName].allowance(
            msg.sender,
            address(this)
        );
        if (amountToSwap > allowance) {
            revert DecentralizedExchange_swapTokenToETH_TransactionFailed_Approve();
        }

        // Transfer tokens from user to contract
        bool success = s_token[tokenName].transferFrom(
            msg.sender,
            address(this),
            amountToSwap
        );
        if (!success) {
            revert DecentralizedExchange_swapTokenToETH_TransactionFailed_TransferFrom();
        }

        // Contract sends ETH to user
        payable(msg.sender).transfer(amountToSwap);

        emit DecentralizedExchange_SwapTokenToETH(
            tokenName,
            amountToSwap,
            msg.sender
        );
    }

    function swapTokenToToken(string memory tokenFrom,string memory tokenTo,uint256 amount)
        public 
        payable 
        notValidToken(tokenFrom)
        notValidToken(tokenTo)
    {
        if(keccak256(bytes(tokenFrom)) == keccak256(bytes(tokenTo))){
            revert DecentralizedExchange_CannotSwapTwoSameTokens();
        }
        if(amount == 0){
            revert DecentralizedExchange_ZeroAmountNotAllowed_swapTokenToToken();
        }
        bool success = s_token[tokenFrom].transferFrom(msg.sender,address(this),amount);
        if(!success){
            revert DecentralizedExchange_swapTokenToToken_transferFrom();
        }
        bool success2 = s_token[tokenTo].transfer(msg.sender,amount);
        if(!success2){
            revert DecentralizedExchange_swapTokenToToken_transfer();
        }
    }

    // GETTER FUNCTIONS

    function getBalance(string memory tokenName) public view returns (uint256) {
        return s_token[tokenName].balanceOf(msg.sender);
    }

    function getTokenAddress(string memory tokenName)
        public
        view
        returns (address)
    {
        return address(s_token[tokenName]);
    }
}
