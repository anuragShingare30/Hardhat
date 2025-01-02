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
            {lastWinner == "" ? (
              <h1 className="font-semibold text-xl">No last winner!!!</h1>
            ):(
              <h1 className="font-semibold text-xl">Last Winner : {lastWinner}</h1>
            )}
            <button 
              className="bg-red-500 p-2 rounded-md text-white"
              onClick={enterLottery}
              >
              Enter Lottery
            </button>
            {(account == owner) ? (
              <button 
              className="bg-red-500 p-2 rounded-md text-white"
              onClick={pickTheWinner}
              >
              Pick a winner
            </button>
            ):(
              <div></div>
            )}
          </div>
          
        </div>


        {/* player list */}
        <div className="flex flex-col items-center p-4 gap-2 mt-8 border border-black">
            <h1 className="text-3xl font-bold mb-8">Players List</h1>
            {players.length > 0 ? (
              players.map((player, index) => (
                <div key={index} className="flex flex-row items-center p-2 gap-10">
                  <h1 className="font-semibold text-red-500">{player.userAddress}</h1>
                  <h1>0.0001 ETH</h1>
                </div>
              ))
            ) : (
              <h1>No players in the lottery yet.</h1>
            )}
          </div>

    </div>
  )
}

