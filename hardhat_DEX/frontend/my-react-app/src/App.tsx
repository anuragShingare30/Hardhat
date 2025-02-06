import { useState, useEffect } from "react";
import { Web3 } from "web3";
import contractAddresses from "../../../ignition/deployments/chain-31337/deployed_addresses.json";
import contractAbi from "../../../artifacts/contracts//DecentralizedExchange.sol/DecentralizedExchange.json";
import { useForm } from "react-hook-form";

interface dataType{
  SellAmount:number;
  Sell:string;
  BuyAmount:number;
  Buy:string;
}


export default function App() {
  // state varibale
  const [account, setAccount] = useState<string | undefined>("");
  const [correctNet, setCorrectNet] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const tokenNames = ["DAI", "RAI", "FREX"];
  const [tokens, setTokens] = useState([]);
  // form handling
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();



  // create web3 and contract instance
  const { ethereum } = window;
  const web3 = new Web3(ethereum);
  const contractAddress = contractAddresses["TokenModule#DecentralizedExchange"];
  const abi = contractAbi.abi;
  const protocol = new web3.eth.Contract(abi, contractAddress);



  // CONNECT WALLET BUTTON
  const ConnectWalletBtn = async () => {
    try {
      if (!ethereum) {
        return <h1>Metamask not detected!!!</h1>
      }

      // get chain-id
      const chainID = await ethereum.request({ method: "eth_chainId" });
      // console.log(chainID);

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
        setLoggedIn(false);
        return;
      }
      setCorrectNet(true);

      // get accounts
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      // console.log(accounts[0]);
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

  // FETCH ALL TOKENS BALANCE
  const fetchTokenBalance = async () => {
    try {
      if (!ethereum) {
        return <h1>No metamask detected!!!</h1>
      }

      // Fetch balances in parallel using Promise.all
      const balances = await Promise.all(
        tokenNames.map(async (token) => {
          return await protocol.methods.getBalance(token).call();
        })
      );
      
      setTokens(balances);
      // console.log(balances);
    } catch (error) {
      console.error(error);
    }
  }

  // SWAP ETH WITH TOKENS
  const swapETHToTokens = async(tokenName:string,amount:number)=>{
    try {
        await protocol.methods.swapETHToToken(tokenName,web3.utils.toWei(amount,'ether')).send({
          value:web3.utils.toWei(amount,'ether'),
          gas:"100000",
          gasPrice:undefined
        });
    } catch (error) {
        console.log(error);
    }
  }

  // SWAP TOKENS WITH ETH
  const swapTokenToETH = async(tokenName:string,amount:number)=>{
    try {
        // 
    } catch (error) {
      console.error(error);
    }
  }


  const onSubmit = async(data:dataType) => {
    console.log(data);
  }

  

  useEffect(() => {
    ConnectWalletBtn();
    if (correctNet) {
      // function that should always display if correct network
      fetchTokenBalance();
    }
  }, [loggedIn, account, correctNet,tokens]);
  return (
    <div>
      {/* connect wallet btn */}
      <div className="navbar bg-base-300 flex flex-row items-center justify-evenly">
        <h1 className="text-2xl font-bold text-violet-400">UniSwapV1.0</h1>
        <div>
          {loggedIn ? (
            <button className="btn btn-sm btn-primary">{account}</button>
          ) : (
            <button className="btn btn-sm btn-primary" onClick={ConnectWalletBtn}>Connect Wallet</button>
          )}
        </div>
      </div>


      {/* Display users token balance */}
      <div className="p-4 m-4">
        {tokens && tokens.length > 0 ? (
          <div className="flex flex-row items-center justify-evenly">
            {tokens.map((token, index) => (
              <div className="btn" key={index}>
                <h1 className="text-xl font-semibold text-violet-300" key={index}>{tokenNames[index]}: {token.toString()}</h1>
              </div>
            ))}
          </div>
        ) : (
          <h1>No tokens</h1>
        )}
      </div>


      {/* Swapping mechanism/function */}
      <div className="p-4 m-10 flex flex-col items-center ">
        <h1 className="text-4xl font-extrabold">Swapping mechanism</h1>
        <div className="m-10">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-10">

            <div className="flex flex-row">
              <input type="number" className="join p-4 text-2xl font-bold input input-bordered input-secondary w-full max-w-xs" placeholder="0" defaultValue="0" {...register("SellAmount", { required: true })} />
              <input type="text" className="btn" {...register("Sell", { required: true })} defaultValue="ETH"/>
            </div>

            <div className="flex flex-row">
              <input type="number" className=" join p-4 text-2xl font-bold input input-bordered input-secondary w-full max-w-xs" placeholder="0" defaultValue="0" {...register("BuyAmount", { required: true })} />
              <input type="text" className="btn" {...register("Buy", { required: true })} defaultValue="DAI"/>
            </div>

            <input type="submit" className="btn btn-sm btn-primary rounded-sm" />
          </form>
        </div>
      </div>


    </div>
  )
}


