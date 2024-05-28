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
import { useReadLocalStorage } from "usehooks-ts";

const UserSignupSchema=zod.object({
  userId:zod.string().min(3).max(30),
  userName:zod.string().max(30),
  email:zod.string().email(),
  password:zod.string().min(8)
});


const localStoragekey='jwtWalletApp';


function SignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate=useNavigate();
  const token = useReadLocalStorage(localStoragekey);

  useEffect(()=>{
    if(token?.token)navigate('/dashboard')
  },[token])
  
  const form=useForm({
    resolver:zodResolver(UserSignupSchema),
    defaultValues:{
      userId:'',
      userName:'',
      email:'',
      password:''
    }
  })

  const onSumithandlar= async (data)=>{
    setIsSubmitting(true);
    try {
      const URL="http://localhost:3000/api/v1/user/signup"
      const response=await axios.post(URL,data);
      toast({
        title: response.data?.success ? "Success": "Uh oh! Something went wrong.",
        description: response.data.message
      });

      if(response.data?.success){
        navigate('/signin')
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
        name="userId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>UserId</FormLabel>
            <FormControl>
              <Input placeholder="xyz123" {...field} />
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
      />

    <FormField
        control={form.control}
        name="userName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="xyz" {...field} />
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
      />    


    <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input  placeholder="xyz@gmail.com" {...field} />
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

export default SignupForm;