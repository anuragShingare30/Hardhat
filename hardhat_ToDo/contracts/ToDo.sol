// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";


contract ToDo {

    struct userTask { 
      uint id;  
      string task;
      bool isDeleted;
    }

    mapping (address => userTask[]) public tasks;


    event AddedTask(address owner, string taskAdded);
    event DeletedTask(address owner, string taskDeleted);


    // test function
    function testContract() public pure returns(string memory) {
        return "Token";
    }

    // function to add task
    function addTask(string memory task) public {
        userTask memory newTask =  userTask({
            id:tasks[msg.sender].length,
            task:task,
            isDeleted:false
        });
        tasks[msg.sender].push(newTask);
        emit AddedTask(msg.sender,task);
    }

    // get all tasks
    function getAllTask() public view returns(userTask[] memory){
        require(tasks[msg.sender].length != 0, "List is empty");
        return tasks[msg.sender];
    }

    // function to delete task
    function deleteTask(uint _id) public{
        tasks[msg.sender][_id].isDeleted = true;
        emit DeletedTask(msg.sender, tasks[msg.sender][_id].task);
    }
}   