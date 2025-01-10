import { useState, useEffect } from "react";
import { Web3 } from "web3";
import contractAddress from "../../../ignition/deployments/chain-31337/deployed_addresses.json"
import contractAbi from "../../../artifacts/contracts/Venmo.sol/Venmo.json";

import { useForm } from "react-hook-form";

export default function App() {
  // state varibale
  const [account, setAccount] = useState<string | undefined>("");
  const [correctNet, setCorrectNet] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  // create web3 and contract instance
  const { ethereum } = window;
  const web3 = new Web3(ethereum);
  const abi = contractAbi.abi;
  const venmo = new web3.eth.Contract(abi, contractAddress["TokenModule#Venmo"]);

  // creating form instance
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

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
      // const sepolia_chain_id = "0xaa36a7"; // 11155111
      // if(chainID != sepolia_chain_id){
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
  };

  // sending ethers and message to user
  const sendEther = async (data) => {
    const {toAddress,message,amount} = data;
    try {
      if(!ethereum){
        alert("No wallet detected!!!");
        return;
      }
      const reciept = await venmo.methods.sendEthers(web3.utils.toWei(amount,'ether'), (data.toAddress), data.message).send({
        value:web3.utils.toWei(amount,'ether'),
        from:account,
        gas:"300000",
        gasPrice:undefined
      })
      console.log(reciept); 
      console.log(toAddress,message,amount);
    } catch (error) {
      console.log(error);
    }
  };


  // fetch all senders
  const fetchSenders = async()=>{
    try {
      if(!ethereum){
        alert("No metamask wallet detected!!!");
        return;
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    ConnectWalletBtn();
    fetchSenders();
  }, []);

  return (
    <div>
      {/* connect wallet btn */}
      <div className="bg-base-300 flex flex-row items-center justify-around p-4">
        <h1 className="text-3xl font-bold text-violet-600">Venmo</h1>
        {/* <div className="text-black btn btn-sm btn-accent">0x09jhfbfhbfhfbfhfbr7383903bffgfbfhf</div> */}
        {loggedIn ? (
          <div>
            <h1 className="text-black btn btn-sm btn-accent">{account}</h1>
          </div>
        ) : (
          <button
            className="text-black btn btn-sm btn-accent"
            onClick={ConnectWalletBtn}
          >
            Connect Wallet
          </button>
        )}
      </div>
      {/* form */}
      <div className="p-4 m-4">
        <form onSubmit={handleSubmit(sendEther)}>

          <input
            placeholder="enter to address"
            {...register("toAddress", { required: true, minLength: 42, maxLength: 42 })}
            className="input input-primary"
          />
          {errors.toAddress?.type === 'required' && <p role="alert">Reciever address is required</p>}
          <input
            placeholder="enter the message"
            {...register("message", { required: true, minLength: 6, maxLength: 43 })}
            className="input input-primary"
          />
          {errors.message?.type === 'required' && <p role="alert">message is required</p>}
          <input
            placeholder="enter the amount in ether"
            {...register("amount", { required: true, minLength:2 })}
            className="input input-primary"
          />
          {errors.amount?.type === 'required' && <p role="alert">amount is required</p>}
          <button 
              type="submit" 
              className="btn btn-sm btn-accent" 
              disabled={isSubmitting}
              >
            {isSubmitting ? "Loading..." : "Send"}
          </button>
        </form>
      </div>

      {/* fetch all senders */}
      <div className="p-4 m-4">
        <h1>Hello</h1>
      </div>
    </div>
  );
}
