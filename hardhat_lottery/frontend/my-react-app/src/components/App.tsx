import React,{createContext} from "react";
import { Web3 } from 'web3';
import abi from "../../../../artifacts/contracts/Lottery.sol/Lottery.json"
import { contractAddress } from "../config";
import {Context} from "./Context";

interface functionContextType{
  loggedIn:boolean;
  account:string|undefined;
  ConnectWallet:()=>void;
  prizePool:string;
  lastWinner:string;
  enterLottery:()=>void;
  owner:string;
  pickTheWinner:()=>void;
  players:[]
}


export const functionContext = createContext<functionContextType|null>(null);


export default function App() {
  // state varibale
  const [account, setAccount] = React.useState<string|undefined>("");
  const [correctNet, setCorrectNet] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);

  const [prizePool,setprizePool] = React.useState("0 ETH");
  const [players,setPlayers] = React.useState([]);
  const [lastWinner,setLastWinner] = React.useState("");
  const owner = "0x5377cc01a598cbf84f6ffa9007bdfb33cb741273";

  // create web3 n contract instance
  const {ethereum} = window;
  const web3 = new Web3(ethereum);
  const contractAbi = abi.abi;
  const lottery = new web3.eth.Contract(contractAbi,contractAddress);
  

  // connect wallet function
  const ConnectWallet = async ()=>{
    try {
        if(!ethereum){
            return <h1>Metamask wallet not found!!!</h1>
        }

        // get chain-id
        const chainId = await ethereum.request({method:"eth_chainId"});
        // console.log("ChainId:",chainId);

        // check for correct network
        const sepolia_chain_id = "0xaa36a7"; // 11155111
        if(chainId != sepolia_chain_id){
          alert("You are not connected to sepolia!!");
          return;
        }
        setCorrectNet(true);

        // get accounts
        const accounts = await ethereum.request({method:"eth_requestAccounts"});
        // console.log(accounts[0]);
        setAccount(accounts[0]);
        setLoggedIn(true);

        // set function for account changed
        ethereum.on('accountsChanged', async()=>{
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
        })

    } catch (error) {
      console.log(error);
    }
  }

  // enter the lottery
  const enterLottery = async()=>{
    try {
      if(!ethereum){
        alert("No wallet detected!!!");
        return;
      }
      await lottery.methods.enterLottery().send({
        from:account,
        value: web3.utils.toWei("0.0001", "ether"), // 0.0001 ETH,
        gas:"300000",
        gasPrice:undefined
      })
    } catch (error) {
        console.log(error);
    }
  }


  // get all the players
  const getAllPlayers = async() =>{
    try{
      if(!ethereum){
        alert("No metamask wallet detected!!!");
        return;
      }
      setPlayers(await lottery.methods.getAllUsers().call());
      // console.log(players);

      setprizePool(web3.utils.fromWei(await lottery.methods.getCurrentLotteryBalance().call(), 'ether') + " ETH");
      // console.log(prizePool);

      setLastWinner(await lottery.methods.getLatestWinnerAddress().call());
      // console.log(lastWinner);
    } catch(error){ 
      console.log(error);
    }
  }

  /**
   * Following condition should be checked before picking the winner:
        a. users length should be strictly greater than 2
        b. owner should be allowed to pick a winner
        c. lottery status should be open
   * @returns the winner
   */

  const pickTheWinner = async()=>{
      try {
          if(!ethereum){
            alert("No metamask wallet detcted!!!");
            return;
          }
          // check if current user is owner or not!!!
          if(account == owner && players.length > 2){
              await lottery.methods.selectWinner().send({
                from:account,
                gas:"300000",
                gasPrice:undefined
              });
          } else {
            alert("Condition not met!!!");
          }


      } catch (error) {
        console.log(error);
      }
  }

  // always render the connectWallet function
  React.useEffect(() => {
    ConnectWallet()
    if (correctNet) {
      getAllPlayers();
    }
    // Listen for account changes
    ethereum?.on("accountsChanged", ConnectWallet);

    return () => {
      ethereum?.removeListener("accountsChanged", ConnectWallet);
    };
  }, [lottery]);

  return (
      <functionContext.Provider value={{loggedIn,account,ConnectWallet,prizePool,lastWinner,enterLottery,owner,pickTheWinner,players}}>
        <Context></Context>
      </functionContext.Provider>
      
  )
}