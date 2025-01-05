import { useState,useEffect } from "react"
import { Web3 } from 'web3';

export default function App() {
  // state varibale
  const [account, setAccount] = useState<string|undefined>("");
  const [correctNet, setCorrectNet] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // create web3 and contract instance
  const {ethereum} = window;
  const web3 = new Web3(ethereum);


  // connect wallet function
  const ConnectWalletBtn = async()=>{
    try {
      if(!ethereum){
        return <h1>Metamask wallet not found!!!</h1>
    }

    // get chain-id
    const chainID = await ethereum.request({method:"eth_chainId"});
    console.log(chainID);

    // check for correct network
    const sepolia_chain_id = "0xaa36a7"; // 11155111
    if(chainID != sepolia_chain_id){
      alert("You are not connected to sepolia!!");
      return;
    }
    setCorrectNet(true);

    // get accounts
    const accounts = await ethereum.request({method:"eth_requestAccounts"});
    console.log(accounts[0]);
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

  useEffect(() => {
    ConnectWalletBtn();
  }, [])

  return (
    <div>
      <div className="bg-base-300 flex flex-row items-center justify-around p-4">
        <h1 className="text-3xl font-bold text-violet-600">Venmo</h1>
        {/* <div className="text-black btn btn-sm btn-accent">0x09jhfbfhbfhfbfhfbr7383903bffgfbfhf</div> */}
        {loggedIn ? (
          <div>
            <h1 className="text-black btn btn-sm btn-accent">{account}</h1>
          </div>
        ):(
            <button
                className="text-black btn btn-sm btn-accent"
                onClick={ConnectWalletBtn}
            >
              Connect Wallet
            </button>
        )}
      </div>
    </div>
  )
}


