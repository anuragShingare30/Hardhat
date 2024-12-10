// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract ToDo {
    struct AllTasks {
      uint id;  
      string task;
      bool isDeleted;
    }

    mapping (address => AllTasks[]) public tasks;


    event AddedTask(address owner, string taskAdded);
    event DeletedTask(address owner, string taskDeleted);


    // function to add task
    function addTask(string memory addtask) public {
        AllTasks memory newTask =  AllTasks({
            id:tasks[msg.sender].length,
            task:addtask,
            isDeleted:false
        });
        tasks[msg.sender].push(newTask);
        emit AddedTask(msg.sender,addtask);
    }

    // get all tasks
    function getAllTask() public view returns(AllTasks[] memory){
        require(tasks[msg.sender].length != 0, "List is empty");
        return tasks[msg.sender];
    }

    // function to delete task
    function deleteTask(uint _id) public{
        tasks[msg.sender][_id].isDeleted = true;
        emit DeletedTask(msg.sender, tasks[msg.sender][_id].task);
    }
}   