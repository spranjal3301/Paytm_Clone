import { Button } from "@/Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Input } from "../Components/ui/input";
import { Label } from "../Components/ui/label";
import { useReadLocalStorage } from "usehooks-ts";
import localStoragekey from "@/config/config";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/Components/ui/use-toast";
import { Loader2 } from "lucide-react";



function SendMoney() {
    const token=useReadLocalStorage(localStoragekey);
    const [istransfer,setIstranfer]=useState(false);
    const navigate=useNavigate();
    const [amount,setAmount]=useState(0);
    const {state}=useLocation();
    const {toast}=useToast();
    const to=state?.to;
    // token,to ,amount

    useEffect(()=>{
        if(!token?.token)navigate('/signin');
        if(!to)navigate('/dashboard');
      
    },[])


    const transferMoney=async()=>{
        setIstranfer(true);
        try {
            const URL=`http://localhost:3000/api/v1/account/transfer`
            const response=await axios.post(URL,{
                amount,
                to
            },{
                headers:{
                    Authorization: `Bearer ${token.token}`
                }
            });

            toast({
              title: response.data?.success ? "Success": "Uh oh! Something went wrong.",
              description: response.data.message,
              variant: "success" 
            });
            
      
          } catch (error) {
            console.error(error.response);
            toast({
              title:"Uh oh! Something went wrong.",
              description: error?.response?.data.message ??"There was a problem with your request.",
              variant: "destructive" 
            })
          }
          finally{
            setIstranfer(false)
          }
    }
  
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className='text-center'>Send Money</CardTitle>
        </CardHeader>

        <CardContent>
            <div className='flex items-center gap-3'>
                <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
                    <span className="font-medium text-gray-600 dark:text-gray-300">U</span>
                </div>
                <h2 className="text-1xl font-normal ">User</h2>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <Label>Amount (in Rs)</Label>
                <Input onChange={(e)=>{
                  setAmount(e.target.value)
                }} min="0" type="number" placeholder="Search amount"/>
              </div>
              <Button onClick={transferMoney} className="w-full">
              {
           istransfer ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
            </>
           ) :
           ('Initiate Transfer')
            }
              </Button>
            </div>
        
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link to='/dashboard' className="no-underline hover:underline">Back to Dashboard ?</Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default SendMoney;
