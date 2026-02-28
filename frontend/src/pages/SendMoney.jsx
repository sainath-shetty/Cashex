import React from 'react'
import {ButtonComponent, Heading, InputBox} from '../assets/RequiredCompo'
import { useSearchParams } from 'react-router-dom'
import { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
import API_BASE from '../apiConfig'
import { FaMoneyCheck } from "react-icons/fa6";
const SendMoney = () => {
  const navigate=useNavigate();
  const [searchParams]=useSearchParams();
  const id=searchParams.get("id");
  const name=searchParams.get("name")
  const [amount,setAmount]=useState(0);
  return (
   <div className='flex justify-center'>
    <div className=' border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg flex flex-col rounded-3xl '>
       <div className='flex flex-col justify-center '>
      <Heading   label="Send Money"/>
      <div className="flex justify-center">
      <FaMoneyCheck className='text-5xl ml-0 mt-5' />
      </div>

      
      </div>
      <div className='flex flex-row'>
      <div className='rounded-full bg-green-300 w-12 h-12 flex flex-col ml-6 mt-10 justify-center text-xl font-bold'>{name[0].toUpperCase()}</div>
      <div className='font-bold flex flex-col mt-12 ml-7 '>{name}
      </div>
     
      </div>
      <InputBox  onChange={e=>{
        setAmount(e.target.value)
      }}placeholder={"Enter Amount"}/>
      <button onClick={async()=>{
         const response=await axios.post(`${API_BASE}/api/v1/account/transfer`,{
          to:id,
          samount:amount
         },{
         headers : {
          Authorization:"Bearer "+sessionStorage.getItem("token")
         }})
         navigate("/dashboard")

      }} className='bg-green-500 hover:bg-orange-400 text-white rounded-md py-2 w-full'>Initiate Transfer</button>
   
    </div>
    </div>
  )
}

export default SendMoney
