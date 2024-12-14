// import contract from "../../../artifacts/contracts/ToDo.sol/ToDo.json";
import { useSDK } from "@metamask/sdk-react";
import React from "react";

function App() {

  const [account, setAccount] = React.useState();
  const { sdk, connected, chainId } = useSDK();

  
  // const abi = contract.abi;
  // const contractAddress = import.meta.env.CONTRACT_ADDRESS;

  // used metamask sdk for wallet connect
  const connectWallet = async() => {
    try {
      const {ethereum} = window;

      if(!ethereum){
        return (<h1>Metamask not installed</h1>);
      }
      const accounts = await sdk?.connect();
      setAccount(accounts[0]);
    } catch (error) {
      console.warn("failed to connect..", error);
    }
  }

  // // connect wallet using ethereum
  // const connectWalletBtn = async ()=>{
  //   try {
  //     const {ethereum} = window;

  //     if(!ethereum){
  //       console.log("metamask not found!!!");
  //     }

  //     // get chain-id
  //     const chainId = await ethereum.request({method:"eth_chainId"});
  //     console.log(chainId);

  //     // check for correct network
  //     const sepoliaChainId = "0xaa36a7";
  //     if(chainId != sepoliaChainId){
  //         alert("You are not connected to sepolia test network!!!") 
  //         // setCorrectNet(false);
  //         return;
  //     }
  //     // setCorrectNet(true);

  //     // get accounts
  //     const accounts = await ethereum.request({method:"eth_requestAccounts"});
  //     console.log("account address detected : ", accounts[0]);
  //     // setLoggedIn(true);
  //     // setCurrentAcc(accounts[0]);

  //   } catch (error) {
  //     console.warn("metamask not found", error);
  //   }
  // }

  return (
    <div>
      <button className="border border-black p-2" onClick={connectWallet}>
        Connect Wallet
      </button>
      {connected && (
        <div>
          <>
            {chainId && `Connected chain: ${chainId}`}
            <p></p>
            {account && `Connected account: ${account}`}
          </>
        </div>
      )}
    </div>
  )
}

export default App;
