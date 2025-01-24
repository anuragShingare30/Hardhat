import { useState,useEffect } from "react";
import { Web3 } from "web3";
// import basicNftAbi from "../../../artifacts/contracts/BasicNFT.sol/BasicNFT.json";
// import nftMarketAbi from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

export default function App(){
  // state varibale
  const [account, setAccount] = useState<string | undefined>("");
  const [correctNet, setCorrectNet] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // create web3 and contract instance
  const { ethereum } = window;
  const web3 = new Web3(ethereum);
  // const basicNft = new web3.eth.Contract(basicNftAbi.abi,"");
  // const nftMarket = new web3.eth.Contract(nftMarketAbi.abi,"");


  // Connect Wallet Button
  const connectWalletBtn = async() =>{
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
  }

  // Minting function
  const mintNft = async() =>{
    try {
      if(!ethereum){
        return <h1>Metamask wallet not found!!!</h1>;
      }
      

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    connectWalletBtn();
  },[correctNet,loggedIn]);


  return (
    <div>
      {/* Connect Wallet Btn */}
      <div className="flex flex-row items-center justify-evenly gap-10">
        <h1 className="text-2xl text-blue-500 font-semibold">NFT Marketplace</h1>
        <div>
          {loggedIn ? (
                <div>
                  <h1 className="text-black btn btn-sm btn-accent">{account}</h1>
                </div>
              ) : (
                <button
                  className="text-black btn btn-sm btn-accent"
                  onClick={connectWalletBtn}
                >
                  Connect Wallet
                </button>
              )}
        </div>
      </div>

      {/* Mint Nft */}
      <div className="p-5 m-5">
        <h1 className="text-xl text-white">Mint the nft</h1>
        <div>

        </div>
      </div>

      {/* List nft */}

      {/* buy nft */}

      {/* withdraw earnings */}

    </div>
  );
}