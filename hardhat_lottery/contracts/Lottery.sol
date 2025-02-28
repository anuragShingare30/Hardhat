// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";



/**
 * @title A sample lottery smart contract
 * @author anurag shingare
 * @notice A sample smart contract for lottery functionality on etheruem network and to interact with frontend
 * @dev Implements the simple keccak method to pick a random number!!!

 * Working model of lottery DApp
 1. enter the lottery:
    a. give some entrance fees
    b. update user in user array
 2. Select a random winner
    a. generate a random number
    b. pick a winner from our user array
    c. transfer all ETH to the winner user
    d. Reset the array and start a new lottery.
 */


contract RandomNumber {
    uint private nonce;
    uint private s_RecentWinnerIndex;

    function generateRandomNumber(uint _range) public returns (uint) {
        nonce++;
        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp, // Current block timestamp
                    msg.sender,      // Caller address
                    nonce            // A unique value to add entropy
                )
            )
        );

        s_RecentWinnerIndex = (randomNumber%_range);
        return (randomNumber%_range);
    }

}


contract Lottery is RandomNumber,Ownable{
    // errors
    error Lottery_LotteryIsNotOpen();
    error Lottery_Only5UsersAreAllowed();
    error Lottery_NotEnoughETHSent();
    error Lottery_NotEnoughTimeHasPassedToSelectWinner();
    error Lottery_NotEnoughUsersPresent();
    error Lottery_FailedToWithDrawPrizePool();

    // Type declarations
    struct User{
        uint id;
        address payable userAddress;
    }

    enum LotteryStatus {Open, PickingWinner}

    User[] public users;


    // State variables
    uint private s_entranceFee;
    uint private immutable i_interval;
    uint private i_lastTimeStamp;
    uint private s_recentwinnerIndex;
    address private s_RecentWinnerAddress;
    uint public s_prizePool;
    LotteryStatus s_lotteryStatus;
    
    // Events
    event Lottery_EmitUserEntered(address indexed userAddress);
    event Lottery_EmitUserSelectedAsWinner(address indexed winnerAddress, uint prizePool);
    event Lottery_Reset();
    
    
    // Functions 
    constructor(
        uint _interval,
        address initialOwner
    ) Ownable(initialOwner) {
        s_entranceFee = 0.0001 ether;
        i_interval = _interval;
        i_lastTimeStamp = block.timestamp;
    }

    RandomNumber rng = new RandomNumber();

    /** 
        @dev enterLottery function work as:
            a. checks for lottery status
            b. checks for number of participants
            c. check if user has sent enough value to enter lottery
    */
    function enterLottery() external payable {
        console.log("The array length is :", users.length);
        console.log("The entrance fee :", s_entranceFee);
        if(s_lotteryStatus == LotteryStatus.PickingWinner){
            revert Lottery_LotteryIsNotOpen();
        }
        if(users.length >= 5){
            revert Lottery_Only5UsersAreAllowed();
        }
        if(msg.value != s_entranceFee){
            revert Lottery_NotEnoughETHSent();
        }
        User memory newUser = User({
            id:users.length,
            userAddress:payable (msg.sender)
        });
        s_prizePool = s_prizePool+s_entranceFee;
        users.push(newUser);
        emit Lottery_EmitUserEntered(msg.sender);
    }

    /** 
        @dev selectWinner function will work as:
            a. check if enough time has passed and we have enough users
            b. pick a random user
            c. reset the users array and start the lottery again
            d. transfer all ETH(prize pool) to winner address.
    */

    function selectWinner() external payable onlyOwner{
        // check for enough time has passed
        if((block.timestamp - i_lastTimeStamp) < i_interval){
            revert Lottery_NotEnoughTimeHasPassedToSelectWinner();
        }
        if(users.length <= 2){
            revert Lottery_NotEnoughUsersPresent();
        }

        s_lotteryStatus = LotteryStatus.PickingWinner;

        s_recentwinnerIndex = rng.generateRandomNumber(users.length);
        s_RecentWinnerAddress = users[s_recentwinnerIndex].userAddress;
        console.log("The most recent winner index is :", s_recentwinnerIndex);
        emit Lottery_EmitUserSelectedAsWinner(s_RecentWinnerAddress, address(this).balance);

        // reset
        s_lotteryStatus = LotteryStatus.Open;
        i_lastTimeStamp = block.timestamp;
        delete users;
        s_prizePool = 0;
        emit Lottery_Reset();

        (bool success,) = s_RecentWinnerAddress.call{value:address(this).balance}("");
        if(!success){
            revert Lottery_FailedToWithDrawPrizePool();
        }
    }


    // Getter function
    function getLotteryEntranceFees() public view returns(uint){
        return s_entranceFee;
    }

    function getLotteryStatus() public view returns(LotteryStatus){
        return s_lotteryStatus;
    }

    function getCurrentLotteryBalance() public view returns(uint){
        return address(this).balance;
    }
    
    function getLatestWinnerAddress() public view returns(address){
        return s_RecentWinnerAddress;
    }

    function getLatestWinnerIndex() public view returns(uint){
        return s_recentwinnerIndex;
    }

    function getLastTimeStamp() public view returns(uint){
        return i_lastTimeStamp;
    }

    function getAllUsers() public view returns(User[] memory){
        return users;
    }

}