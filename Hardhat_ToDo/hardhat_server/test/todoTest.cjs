const { expect } = require("chai");
const { ethers } = require("hardhat");
const assert = require('assert');
const { describe } = require("mocha");

describe("ToDo contract", function () {
    
    // first test check
    describe("Testing", function (){
        it("Deployment should assign the total supply of tokens to the owner", async function () {

            // RETURNS THE ETHEREUM ACCOUNT. 
            // And, this account will execute the deployment
              const [owner, addr1] = await ethers.getSigners();
        
            // start the deployment of our token contract 
            // return a Promise that resolves to a Contract
            // This is the contract instance that has a method for each of your smart contract functions.
              const todo = await ethers.deployContract("ToDo");
        
            // Once contract is deployed, we can call contract methods using contract instance(todo).
            // the account in the owner variable executed the deployment,
              const ownerBalance = await todo.balanceOf(owner.address);
        
            // Here, the token's supply amount and we're checking that it's equal to ownerBalance, as it should be.
            // We have used expect(...) function from Mocha-chai to compare
              expect(await todo.totalSupply()).to.equal(ownerBalance);
        
            //   either we can use expect(...) method or assert.equal(...) method
              assert.equal(await todo.totalSupply(), ownerBalance);
            });
    })

    // second test check
    describe("Deployment", function () {
        it("Checking deployment", async function(){

        })
    })
  });