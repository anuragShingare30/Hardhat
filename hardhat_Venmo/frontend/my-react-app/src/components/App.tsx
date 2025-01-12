import { useState, useEffect,createContext } from "react";
import { Web3 } from "web3";
// import contractAddress from "../../../ignition/deployments/chain-31337/deployed_addresses.json"
import contractAddress from "../../../../ignition/deployments/chain-11155111/deployed_addresses.json"
import contractAbi from "../../../../artifacts/contracts/Venmo.sol/Venmo.json";
import ContextFuntions from "./contextFunctions";

interface senderType {
  transactionId:number;
  senderAddress:string;
  receiverAddress:string;
  timeStamp:number;
  senderMsg:string;
  amountSend:number;
}

interface dataType{
  toAddress:string;
  message:string;
  amount:string;
}

interface functionsType{
  loggedIn:boolean;
  account:string;
  ConnectWalletBtn:()=>void;
  senders:senderType[];
  sendEther:()=>void;
}

export const functions = createContext<functionsType|null>(null);

export default function App() {
  // state varibale
  const [account, setAccount] = useState<string | undefined>("");
  const [correctNet, setCorrectNet] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [senders, setSenders] = useState<senderType[]>([]);

  // create web3 and contract instance
  const { ethereum } = window;
  const web3 = new Web3(ethereum);
  const abi = contractAbi.abi;
  const venmo = new web3.eth.Contract(abi, contractAddress["TokenModule#Venmo"]);



  // connect wallet function
  const ConnectWalletBtn = async () => {
    try {
      if (!ethereum) {
        return <h1>Metamask wallet not found!!!</h1>;
      }

      // get chain-id
      const chainID = await ethereum.request({ method: "eth_chainId" });
      console.log(chainID);

      // check for correct network(sepolia)
      const sepolia_chain_id = "0xaa36a7"; // 11155111
      if (chainID != sepolia_chain_id) {
        alert("You are not connected to sepolia!!");
        return;
      }
      setCorrectNet(true);

      // // check for correct network for testing purpose(anvil)
      // const anvil_chain_id = "0x7a69"; // 31337
      // if (chainID != anvil_chain_id) {
      //   alert("You are not connected to anvil!!");
      //   return;
      // }
      // setCorrectNet(true);



      // get accounts
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log(accounts[0]);
      setAccount(accounts[0]);
      setLoggedIn(true);

      // set function for account changed
      ethereum.on("accountsChanged", async () => {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  // sending ethers and message to user
  const sendEther = async (data:dataType) => {
    const {amount } = data;
    try {
      if (!ethereum) {
        alert("No wallet detected!!!");
        return;
      }
      await venmo.methods.sendEthers(web3.utils.toWei(amount, 'ether'), (data.toAddress), data.message).send({
        value: web3.utils.toWei(amount, 'ether'),
        from: account,
        gas: "300000",
        gasPrice: undefined
      })
      // console.log(reciept);
      // console.log(toAddress, message, amount);
    } catch (error) {
      console.log(error);
    }
  };


  // fetch all senders
  const fetchSenders = async () => {
    try {
      if (!ethereum) {
        alert("No metamask wallet detected!!!");
        return;
      }
      setSenders(await venmo.methods.getAllSendersInfo().call());
      // console.log(senders);
      // console.log(senders[0].receiverAddress);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    ConnectWalletBtn();
    if(correctNet){
      fetchSenders();
    }
  }, [correctNet,loggedIn]);

  return (
      <functions.Provider value={{loggedIn,account,ConnectWalletBtn,senders,sendEther}}>
        <ContextFuntions></ContextFuntions>
      </functions.Provider>
  );
}
