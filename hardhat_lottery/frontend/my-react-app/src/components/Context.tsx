import {useContext } from "react";
import { functionContext } from "./App";



export const Context:React.FC = ()=>{
    const {
            loggedIn,account,ConnectWallet,prizePool,lastWinner,enterLottery,owner,pickTheWinner,players
        } = useContext(functionContext);

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
                  className="bg-red-500 p-2 rounded-md text-white btn btn-primary"
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

