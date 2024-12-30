import React from "react"
import { Web3 } from 'web3';
import abi from "../../../../artifacts/contracts/Lottery.sol/Lottery.json"
import { contractAddress } from "../config";

export default function App() {
  // state varibale
  const [account, setAccount] = React.useState<string|undefined>("");
  const [correctNet, setCorrectNet] = React.useState(false);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [prizePool,setprizePool] = React.useState("0 ETH");

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
        console.log("ChainId:",chainId);

        // check for correct network
        const sepolia_chain_id = "0xaa36a7"; // 11155111
        if(chainId != sepolia_chain_id){
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

  // enter the lottery
  const enterLottery = async()=>{
    try {
      if(!ethereum){
        alert("No wallet detected!!!");
        return;
      }
      await lottery.methods.enterLottery().send({
        from:account,
        value:web3.utils.toWei('0.001','ether'),
        gas:"300000",
        gasPrice:undefined
      })
    } catch (error) {
        console.log(error);
    }
  }

  // get the current prize pool
  const currentPrizePool = async ()=>{
    try {
        if(!ethereum){
          alert("No metamask wallet detected!!!");
          return;
        }
        if(lottery){
          const prizePool = await lottery.methods.getCurrentLotteryBalance().call();
          setprizePool(web3.utils.fromWei(prizePool, 'ether') + " ETH");
          console.log(prizePool);
        }
    } catch (error) {
      console.log(error);
      
    }
  }

  // always render the connectWallet function
  React.useEffect(() => {
    ConnectWallet()
    if (correctNet) {
      currentPrizePool();
    }
  }, [correctNet,lottery]);

  return (
    <div className="">
      {/* header */}
      <header>
        {/* Connect Wallet Btn */}
      <div className="flex flex-row items-center justify-evenly gap-5 bg-gray-300 p-5 w-full">
        <h1 className="text-red-500 text-3xl font-bold">Lottery DApp</h1>
        {loggedIn ? (
          <div>
            <p>Account: {account}</p>
          </div>
        ):(
          <div>
            <button
              onClick={ConnectWallet}
              className="bg-red-500 p-2 rounded-md text-white"
            >
              ConnectWallet
            </button>
          </div>
        )}
      </div>
      </header>
      {!loggedIn && <h1 className="text-3xl">No wallet connected!!!</h1> }



        {/* lottery card */}
        <div className="flex flex-col items-center justify-center p-5 m-10  ">
          <div className="flex flex-col items-center justify-center p-10 border border-red-800 gap-5">
            <h1 className="text-3xl text-red-500 font-bold">Lottery</h1>
            <h1 className="text-xl font-semibold">Prize Pool : {prizePool}</h1>
            <h1 className="font-semibold text-xl">Last Winner : 0x00...000</h1>
            <button 
              className="bg-red-500 p-2 rounded-md text-white"
              onClick={enterLottery}
              >
              Enter Lottery
            </button>
            <button 
              className="bg-red-500 p-2 rounded-md text-white"
              // onClick={}
              >
              Pick a winner
            </button>
          </div>
          
        </div>


        {/* player list */}

    </div>
  )
}

