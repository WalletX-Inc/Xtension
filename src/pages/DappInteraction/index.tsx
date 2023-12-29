import React, { useState } from 'react';
import angleRight from "../../assets/angleRight.svg";
import arrowRight from "../../assets/arrow-right.svg";
import logo from "../../assets/matic-logo.png";
import warningRed from "../../assets/warning-red.svg";
import warningYellow from "../../assets/warning-yellow.svg";

const DappInteraction = () => {
    const [isNetworkBusy, setIsNetworkBusy] = useState(true);
    const [gasNotEnoughTxn, setGasNotEnoughTxn] = useState(true);

    const handleReject = () => {
        console.log("Reject")
      };

    const handleRejectAll = () => {
        console.log("Reject all")
      };

    const handleConfirm = () => {
        console.log("Confirm")
      };

  return (
    <div className='text-white'>
      <div className='flex items-center'>
        <div className='flex-grow text-sm p-1'>
          <p className='text-center'>1 of 2</p>
          <p className='text-center'>requests waiting to be acknowledged</p>
        </div>
        <div>
          <img className='h-6 w-6' src={angleRight} alt='angleRight'/>
        </div>
      </div>
      <hr className='border-slate-600'/>

      <div className='flex justify-end p-2'>
        <p className="w-min whitespace-nowrap p-1 px-2 border rounded-full">Sepolia test network</p>
      </div>
      <hr className='border-slate-600'/>

      <div className='flex justify-around items-center p-1'>
        <div className='flex gap-2 items-center'>
          <img className='h-6 w-6' src={logo} alt='profile'/>
          <p>Account 1</p>
        </div>
        <div className='p-1 border rounded-full'>
          <img className='h-5 w-5' src={arrowRight} alt='arrowRight'/>
        </div>
        <p>New Contract</p>
      </div>
      <hr className='border-slate-600'/>

      <div className='py-2 px-4'>
        <p className='mb-2'>https://metamask.github.io</p>
        <p className='p-1 w-min whitespace-nowrap border rounded-sm'>CONTRACT DEPLOYMENT</p>
      </div>
      <hr className='border-slate-600'/>
      <div>
            <button className='p-2'>DETAILS</button>
            <button>DATA</button>
        </div>
        <hr className='border-slate-600'/>

        <div className='p-3'>
            {isNetworkBusy && (
                <div className=" flex gap-1 border-yellow-400 rounded border-l-2  p-2 bg-[#454130] mb-2">
                    <img src={warningYellow} className="h-4 w-4" alt="warning"/>
                    <p className=''>
                        Network is busy.  Gas prices are high and estimates are less accurate.
                    </p>
                </div>
            )}
            <p className='mb-2 text-right'>{"Market >"}</p>
            <div className='flex justify-between'>
                <p className='font-bold text-lg'>{"Gas (estimated)"}</p>
                <div className='flex flex-col justify-end mb-2'>
                    <p className='text-right'>0.57699067</p>
                    <p>0.57699067 SepoliaEth</p>
                </div>
            </div>
            <div className='flex justify-between'>
                <p className='text-green-700'>{"Likely in <30 seconds"}</p>
                <p>Max fee: 0.77778042 SepoliaETH</p>
            </div>
            <hr className=' border-slate-600 mb-2'/>
            <div className='flex justify-between'>
                <p className='font-bold text-lg'>Total</p>
                <div className='flex flex-col justify-end'>
                    <p className='text-right'>0.57699067</p>
                    <p>0.57699067 SepoliaEth</p>
                </div>
            </div>

            <div className='flex justify-between mb-2'>
                <p>Amount + gas fee</p>
                <p>Max amount: 0.77778042 SepoliaETH</p>
            </div>

            {gasNotEnoughTxn && (
                <div className=' flex  gap-1 rounded border-l-2 p-2 border-red-600 bg-[#402a2f]'>
                    <img src={warningRed} className="h-4 w-4" alt="warning"/>
                    <p >
                        You do not have enough SepoliaEth in your account to pay for transaction fees on Sepolia network. Deposit SepoliaETH from another account.
                    </p>
                </div>
            )}
        </div>
        <div className='flex pt-0 p-4 pb-2 gap-4'>
            <button onClick={handleReject} className='flex-grow border p-2 rounded'>Reject</button>
            <button onClick={handleConfirm} className='flex-grow border p-2 rounded'>Confirm</button>
      </div>
      <p onClick={handleRejectAll} className='text-center text-sm'>REJECT 2 TRANSACTIONS</p>
    </div>
  );
};

export default DappInteraction;