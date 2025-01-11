import { useState, useEffect } from "react";
import { Web3 } from "web3";
// import contractAddress from "../../../ignition/deployments/chain-31337/deployed_addresses.json"
import contractAddress from "../../../ignition/deployments/chain-11155111/deployed_addresses.json"
import contractAbi from "../../../artifacts/contracts/Venmo.sol/Venmo.json";

import { useForm } from "react-hook-form";

interface senderType {
  transactionId:number;
  senderAddress:string;
  receiverAddress:string;
  timeStamp:number;
  senderMsg:string;
  amountSend:number;
}

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
  const sendEther = async (data) => {
    const {amount } = data;
    try {
      if (!ethereum) {
        alert("No wallet detected!!!");
        return;
      }
      const reciept = await venmo.methods.sendEthers(web3.utils.toWei(amount, 'ether'), (data.toAddress), data.message).send({
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

      {/* compact form and senders info */}
      <div className="flex lg:flex-row sm:flex-col md:flex-col items-start justify-center">

        {/* fetch all senders */}
        <div className="p-4 m-4 lg:w-full">
          <h1 className="text-3xl text-white font-bold">Previous Transactions</h1>
          <div className="m-5 flex flex-col gap-5">
            {senders.length > 0 ? (
              senders
                .slice(-5) // Get the last 5 elements from the array
                .map((sender, index) => {
                  const timeStamp = Number(sender.timeStamp);
                  const date = new Date(timeStamp*1000);
                  const formatDate = date.toLocaleString();
                  return (
                    <div key={index} className="border rounded-lg flex flex-col p-2">
                      <h1 className="text-white font-semibold">{sender.senderAddress}</h1>
                      <h1 className="text-gray-500 text-sm">{formatDate}</h1>
                      <h1 className="text-purple-400">{sender.senderMsg}</h1>
                    </div>
                  );
                })
            ) : (
              <div className="m-4 p-4">
                <h1 className="text-2xl">No previous senders found...</h1>
              </div>
            )}

          </div>
        </div>

        {/* form */}
        <div className="p-4 m-4 lg:w-full">
          <form onSubmit={handleSubmit(sendEther)} className="flex flex-col gap-5">

            <input
              placeholder="reciever address"
              {...register("toAddress", { required: true, minLength: 42, maxLength: 42 })}
              className="input input-primary"
            />
            {errors.toAddress?.type === 'required' && <p role="alert">Reciever address is required</p>}
            <input
              placeholder="message to reciever"
              {...register("message", { required: true, minLength: 6, maxLength: 43 })}
              className="input input-primary"
            />
            {errors.message?.type === 'required' && <p role="alert">message is required</p>}
            <input
              placeholder="amount in ether"
              {...register("amount", { required: true, minLength: 2 })}
              className="input input-primary"
            />
            {errors.amount?.type === 'required' && <p role="alert">amount is required</p>}
            <button
              type="submit"
              className="btn btn-md btn-accent"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Send"}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
