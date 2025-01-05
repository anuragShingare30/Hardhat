// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "hardhat/console.sol";

/**
 * @title A sample Venmo smart contract
 * @author anurag shingare
 * @notice A sample smart contract for venmo! Users can send ether to their friend with some funny message and vice versa.
 * @dev Implements a simple transfer and recieve methods. Will try to use some advance method!!!

 * Working model of Venmo DApp
 1. Connect your Wallet
 2. Sender's info
    a. Contains, sender address
    b. time interval
    c. funny message
 3. Send/Recieve ethers
    a. To address, messagae and amount of value to sent!!!
 */

contract Venmo {
    // errors
    error Venmo_NotEnoughEThSend();
    error Venmo_NoMessageSent();
    error Venmo_EtherTransferFails();
    error Venmo_ExtraEthSendTryAgain();

    // type declaration
    struct Sender{
        uint256 id;
        address senderAddress;
        address receiver;
        uint256 timeStamp;
        string senderMsg;
        uint256 amountSend;
    }

    Sender[] public s_sendersInfo;

    // state variables

    // events
    event Venmo_Transfer(address senderAddress,address receiver,uint256 amount ,string senderMessage,uint256 timeStamp);

    // functions
    
    /** 
        @dev This is a simple function that sends ethers to reciever address with some message
        * Funtion take the following params and emit the same as well!!!
            a. _amountToSent
            b. _receiver - receiever address
            c. _message - message sender wants to send to reciever
            d. timeStamp
    */
    function sendEthers(uint256 _amountToSent, address _receiver,string memory _message ) public payable {
        if(bytes(_message).length == 0){
            revert Venmo_NoMessageSent();
        }
        if(msg.value < _amountToSent){
            revert Venmo_NotEnoughEThSend();
        }
        if(msg.value > _amountToSent){
            revert Venmo_ExtraEthSendTryAgain();
        }
        // transfer ethers to specific address
        (bool success,) = payable(_receiver).call{value:_amountToSent}("");
        if(!success){
            revert Venmo_EtherTransferFails();
        }
        // store the senders transaction
        Sender memory sender = Sender({
            id: s_sendersInfo.length,   
            senderAddress:msg.sender,
            receiver:_receiver,
            timeStamp:block.timestamp, // currentTime - timeStamp   
            senderMsg:_message,
            amountSend:_amountToSent
        });
        // push the info into array
        s_sendersInfo.push(sender);
        emit Venmo_Transfer(msg.sender, _receiver, _amountToSent, _message,block.timestamp);
    }

    // get all sender info
    function getAllSendersInfo() public view returns (Sender[] memory){
        return s_sendersInfo;
    }
    // get the transaction-id
    function getTransactionId() public view returns (uint){
        return s_sendersInfo.length;
    }

}