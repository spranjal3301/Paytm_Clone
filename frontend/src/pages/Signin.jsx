import React from 'react'
// import SignupForm from "../Components/SignupForm";
import SigninForm from '../Components/SigninForm';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Link } from "react-router-dom";

function Signin() {
  return (
    <div className="w-full h-screen flex place-content-center place-items-center">
      <Card className="w-[400px]">

        <CardHeader>

          <CardTitle>Sign In</CardTitle>

          <CardDescription>
          Enter your credentials to access your account
          </CardDescription>

        </CardHeader>

        <CardContent>
          <SigninForm />
        </CardContent>

        <CardFooter>
          <p>
          Don't have an account? <Link to={"/signup"}>SignUp</Link>
          </p>
        </CardFooter>

      </Card>
    </div>
  )
}

export default Signin
