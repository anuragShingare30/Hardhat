import { useState, useEffect } from "react";
import { Web3 } from "web3";


export default function App() {
  // state varibale
  const [account, setAccount] = useState<string | undefined>("");
  const [correctNet, setCorrectNet] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // create web3 and contract instance
  const { ethereum } = window;
  const web3 = new Web3(ethereum);


  // connect wallet button
  const ConnectWalletBtn = async()=>{
    try {
      if(!ethereum){
        return <h1>Metamask not detected!!!</h1>
      }

      // get chain-id
      const chainID = await ethereum.request({ method: "eth_chainId" });
      console.log(chainID);

      // // check for correct network(sepolia)
      // const sepolia_chain_id = "0xaa36a7"; // 11155111
      // if (chainID != sepolia_chain_id) {
      //   alert("You are not connected to sepolia!!");
      //   return;
      // }
      // setCorrectNet(true);

      // check for correct network for testing purpose(anvil)
      const anvil_chain_id = "0x7a69"; // 31337
      if (chainID != anvil_chain_id) {
        alert("You are not connected to anvil!!");
        return;
      }
      setCorrectNet(true);

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
  }

  useEffect(()=>{
    ConnectWalletBtn();
    if(correctNet){
      // function that should always display if correct network
    }
  },[loggedIn,account,correctNet]);
  return (
    <div>
      {/* connect wallet btn */}

      <h1 className='text-xl'>Hello world</h1>
    </div>
  )
}


