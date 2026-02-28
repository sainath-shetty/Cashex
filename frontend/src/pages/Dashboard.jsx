import React from 'react'
import { Appbar, Balance, Users } from '../assets/RequiredCompo'
import axios from 'axios'
import API_BASE from '../apiConfig'
import { useState,useEffect } from 'react';
const Dashboard = () => {
  const [balance ,setBalance]=useState("");
  const [firstname,setFirstname]=useState("");
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/v1/account/balance`, {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token")
          }
        });
        
        const { balance, firstName } = response.data;
        const roundedBalance = parseFloat(balance).toFixed(2);
        setBalance(roundedBalance);
        setFirstname(firstName);
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
  
    fetchBalance(); // fetch immediately on mount
    const interval = setInterval(fetchBalance, 5000); // then every 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);
  return (
    <div>
      <Appbar firstName={firstname|| "User"} />
      <Balance value={balance} />
      <Users />
    </div>
  )
}

export default Dashboard
