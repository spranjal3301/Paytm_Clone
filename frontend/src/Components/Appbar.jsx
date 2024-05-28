import React, { useEffect, useState } from 'react'
import { CardHeader } from './ui/card'
import { Button } from './ui/button'
import { useLocalStorage } from 'usehooks-ts';
import { useNavigate } from 'react-router-dom';


const localStoragekey='jwtWalletApp';

export default function Appbar({userName}) {

  // const [userId,setUsersId]=useState("U");
  const [token,setToken,removeToken]=useLocalStorage(localStoragekey,"");
  const navigate=useNavigate();
  useEffect(()=>{
    if(!token?.token)navigate('/signin');
  },[token])

  return (
    <div className=' flex items-center justify-between p-3'>
       <h2 className="text-2xl font-bold ">Wallet App</h2>

        <div className='flex items-center gap-3'>
            <h2 className="text-1xl font-normal ">{`Hello ${userName}`}</h2>
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                <span className="font-medium text-gray-600 dark:text-gray-300">{userName[0].toUpperCase()}</span>
            </div>
            <Button onClick={()=>{
                setToken("");
                removeToken();
                navigate('/signin');
            }}>Log out</Button>
        </div>
    </div>
  )
}
