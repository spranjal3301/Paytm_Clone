import Appbar from "@/Components/Appbar";
import Loader from "@/Components/Loader";
import { Button } from "@/Components/ui/button";
import { CardHeader } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { useToast } from "@/Components/ui/use-toast";
import localStoragekey from "@/config/config";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDebounceValue, useReadLocalStorage } from "usehooks-ts";



function Dashboard(){
    const {state} = useLocation();
    const token=useReadLocalStorage(localStoragekey);
    const navigate=useNavigate();
    const userName= token?.userName ?? "U";
    // console.log(state); 
    // console.log(userName);

    useEffect(()=>{
        if(!token?.token)navigate('/signin');
      },[])

    return (
       <>
        <Appbar userName={userName}/>
    
        <hr className="h-px bg-gray-200 border-0 dark:bg-gray-700"></hr>
        <YourBalance token={token?.token}/>
        <AllUsers/>
       </> 
    )
}

function YourBalance({token}){
    const [balance,setBalance]=useState(0);

    useEffect(()=>{
        (async()=>{
            try {
                const URL=`http://localhost:3000/api/v1/account/balance`
                const response=await axios.get(URL,{
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
                setBalance(response.data.balance);
            } catch (error) {
                console.error(error.response);
            }
        })();
    },[])


    return (
        <h2 className="text-xl font-normal p-5">{`Your Balance Rs ${Math.round(balance*100)/100}`}</h2>
    )
}

function AllUsers(){
    const [users,setUsers]=useState([]);
    const [isSettingUser,setIsSettingUser]=useState(false);
    const [userName,setUserName]=useDebounceValue("",500);
    const {toast}=useToast()

    useEffect(()=>{
      (async()=>{
        setIsSettingUser(true);
        try {
        //   const userName="";
          const URL=`http://localhost:3000/api/v1/user/bulk?filter=${userName}`
          const response=await axios.get(URL);
          
          setUsers(response.data.filterUser);
          
        } catch (error) {
          console.error(error.response);
          toast({
            title:"Uh oh! Something went wrong.",
            description: error?.response?.data.message ??"There was a problem with your request.",
            variant: "destructive" 
          })
        }
        finally{
          setIsSettingUser(false)
        }
      })();
    },[userName])


    return (
        <div className="p-5">
            <h2 className="text-xl font-normal py-3">Users</h2>
            <Input onChange={(e)=>{
                setUserName(e.target.value);
            }} type="search" placeholder="Search User..."/>

            {
                isSettingUser?(<Loader/>):
                (
                    users.map(({name,id},idx)=>{
                        return (
                            <User key={idx} userName={name} userId={id}/>
                        )
                    })
                )
            }

        </div>
    )
}


function User({userName,userId}){
    const navigate=useNavigate();
    return (
        <div className="flex items-center justify-between py-3">
        <div className='flex items-center gap-3'>
            <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                <span className="font-medium text-gray-600 dark:text-gray-300">{userName[0].toUpperCase()}</span>
            </div>
            <h2 className="text-1xl font-normal ">{userName}</h2>
        </div>
        <Button onClick={()=>{
            navigate('/sendmoney',{state:{to:userId}})
        }}>Send Money</Button>
    </div>
    )
}





export default Dashboard;