import React, {useContext} from "react";
import {functions} from "./App";
import { useForm } from "react-hook-form";

interface senderType {
    transactionId:number;
    senderAddress:string;
    receiverAddress:string;
    timeStamp:number;
    senderMsg:string;
    amountSend:number;
}

interface functionsType{
    loggedIn:boolean;
    account:string;
    ConnectWalletBtn:()=>void;
    senders:senderType[];
    sendEther:()=>void;
}

export default function ContextFuntions(){

    const {loggedIn,account,ConnectWalletBtn,senders,sendEther} = useContext<functionsType>(functions);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

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
                    .map((sender:senderType, index:number) => {
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