import abi from "../../../artifacts/contracts/Lottery.sol/Lottery.json";
import {contractAddress} from "../src/config";
import { Web3 } from 'web3';

// create web3 n contract instance
const {ethereum} = window;
const web3 = new Web3(ethereum);
const contractAbi = abi.abi;
const lottery = new web3.eth.Contract(contractAbi,contractAddress);


// function to connect wallet
export const connectWalletBtn = async() =>{

}


// function to get the prize pool money
export const prizePool = async ()=>{
    
}


// function to enter lottery
export const enterLottery = async (address:string)=>{
    try {
        if(!ethereum){
            alert("No metamask wallet detected!!!");
            return;
        }
        await lottery.methods.enterLottery().send({
            from:address,
            value:web3.utils.toWei('0.001','ether'),
            gas:'300000',
            gasPrice:undefined
        })
    } catch (error) {
        console.log(error);
        
    }
}


// function to pick the winner
export const pickAWinner = async()=>{
    
}