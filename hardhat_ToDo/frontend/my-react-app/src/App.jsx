import contract from "../../../artifacts/contracts/ToDo.sol/ToDo.json";
import { contractAddress } from "./config";
// import { useSDK } from "@metamask/sdk-react";
import { useEffect, useState } from "react";
import AddTask from "./component/AddTask";
import { Web3 } from "web3";

function App() {
  // const { sdk, connected, chainId } = useSDK();
  const [account, setAccount] = useState("");
  const [correctNet, setCorrectNet] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [tasks, getTasks] = useState([]);


  // // CREATING A CONTRACT INSTANCE
  // const rpc_url = import.meta.env.INFURA_URL;
  const { ethereum } = window;
  const web3 = new Web3(ethereum);
  const abi = contract.abi;
  const token = new web3.eth.Contract(abi, contractAddress);

  // // used metamask sdk for wallet connect
  // const connectWallet = async () => {
  //   try {
  //     if (!ethereum) {
  //       return <h1>Metamask not installed</h1>;
  //     }

  //     // get chain-id
  //     console.log("the detected chain-id is :", chainId);

  //     // get accounts
  //     const accounts = await sdk?.connect();
  //     setAccount(accounts[0]);

  //   } catch (error) {
  //     console.warn("failed to connect..", error);
  //   }
  // };

  // // connect wallet using ethereum
  const connectWalletBtn = async () => {
    try {
      if (!ethereum) {
        console.log("metamask not found!!!");
        return;
      }

      // get chain-id
      const chainId = await ethereum.request({ method: "eth_chainId" });
      console.log(chainId);

      // check for correct network
      const sepoliaChainId = "0xaa36a7";
      if (chainId != sepoliaChainId) {
        alert("You are not connected to sepolia test network!!!");
        setCorrectNet(false);
        return;
      }
      setCorrectNet(true);

      // get accounts
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("account address detected : ", accounts[0]);
      setLoggedIn(true);
      setAccount(accounts[0]);
    } catch (error) {
      console.warn("metamask not found", error);
    }
  };

  useEffect(() => {
    connectWalletBtn();
    getAllTask();
  }, []);



  // ADD TASK
  const addTasks = async (task) => {
    try {
      if (!ethereum) {
        console.log("metamask not found!!!");
        return;
      }
      if (!account) {
        console.warn("Account is not connected.");
        return;
      }
      await token.methods.addTask(task).send({ from: account });
      console.log("Task added!!!", task);
    } catch (error) {
      console.warn(error);
    }
  };

  // DISPLAY ALL TASK
  const getAllTask = async () => {
    try {
      if (ethereum) {
        const allTasks = await token.methods.getAllTask().call();
        console.log(allTasks);
        getTasks(...allTasks,allTasks);
      } else {
        console.log("metamask not found!!!");
        return;
      }
    } catch (error) {
      console.warn(error);
    }
  };

  // DELETING A TASK
  const deleteTask = async (id)=>{
      try {
        if(!ethereum){
          console.log("Metamask not found!!!");
        }
        if (!account) {
          console.warn("Account is not connected.");
          return;
        }

        await token.methods.deleteTask(id).send({from:account});
        console.log(`${id} Task deleted!!!`);

        // update the task at frontend
        const updatedTasks = await token.methods.getAllTask().call();
        getTasks(updatedTasks);

      } catch (error) {
        console.warn(error);
      }
  }

  return (
    <div className="flex flex-col items-center justify-center m-10 gap-2">
      {loggedIn ? (
        <div>{account && <h1>{account}</h1>}</div>
      ) : (
        <h1>Wallet not connected</h1>
      )}

      <button className="border border-black p-2" onClick={connectWalletBtn}>
        Connect Wallet
      </button>

      <div>
        {loggedIn ? (
          <AddTask addTasks={addTasks}></AddTask>
        ) : (
          <h1>Connect to metamask</h1>
        )}
      </div>

      <div className="flex flex-col gap-5 m-5">
        <button className="border border-black p-2" onClick={getAllTask}>
          Get All tasks
        </button>
        <div className="flex flex-col gap-5">
          {tasks.length === 0 ? (
            <h1>No tasks available</h1>
          ) : (
            tasks.map((task) => {
              if (task.isDeleted === false) {
                return (
                  <div key={task.id} className="flex flex-row">
                    <h1>{task.task}</h1>
                    <button onClick={deleteTask(task.id)} className="border border-black p-1">Delete</button>
                  </div>
                  
                );
              }
              return null;
            })
          )}
        </div>
        
      </div>
    </div>
  );
}

export default App;
