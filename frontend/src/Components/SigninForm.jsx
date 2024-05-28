import zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import localStoragekey from "../config/config";


const signinBody = zod.object({
    userId_Email: zod.string(),
	password: zod.string()
})





function SigninForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate=useNavigate();
  const [token,setToken,removeToken]=useLocalStorage(localStoragekey,{token:""});
  const [signinResponse,setSigninResponse]=useState({})

  const form=useForm({
    resolver:zodResolver(signinBody),
    defaultValues:{
      userId_Email:'',
      password:''
    }
  })

  useEffect(()=>{
    if(token?.token)navigate('/dashboard',{state:{signinResponse}});
  },[token]);

  const onSumithandlar= async (data)=>{
    setIsSubmitting(true);
    try {
      const URL="http://localhost:3000/api/v1/user/signin"
      const response=await axios.post(URL,data);
      toast({
        title: response.data?.success ? "Success": "Uh oh! Something went wrong.",
        description: response.data.message,
        variant: "success" 
      });

      if(response.data?.success){
        setSigninResponse(response.data);
        setToken({
          token:response.data.token,
          userId:response.data.userId,
          userName:response.data.userName
        }); 
      }
      

    } catch (error) {
      console.error(error.response);
      toast({
        title:"Uh oh! Something went wrong.",
        description: error?.response?.data.message ??"There was a problem with your request.",
        variant: "destructive" 
      })
    }
    finally{
      setIsSubmitting(false)
    }
  }


  return (
    <Form {...form}>

    <form onSubmit={form.handleSubmit(onSumithandlar)} className="space-y-4">

      <FormField
        control={form.control}
        name="userId_Email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>UserId or Email</FormLabel>
            <FormControl>
              <Input placeholder="xyz@gmail.com" {...field} />
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
      />


    <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input type="password"  placeholder="" {...field} />
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
      />    



      <Button type="submit" disabled={isSubmitting} className="w-full">
        {
           isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please wait
            </>
           ) :
           ('Signup')
        }
        </Button>
    </form>

  </Form>
  );
}

export default SigninForm;