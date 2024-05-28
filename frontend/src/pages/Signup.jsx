import SignupForm from "../Components/SignupForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import React from "react";
import { Link } from "react-router-dom";

function Signup() {
  return (
    <div className="w-full h-screen flex place-content-center place-items-center">
      <Card className="w-[400px]">

        <CardHeader>

          <CardTitle>Sign Up</CardTitle>

          <CardDescription>
            Enter your information to create an account
          </CardDescription>

        </CardHeader>

        <CardContent>
          <SignupForm />
        </CardContent>

        <CardFooter>
          <p>
            Already have an account? <Link to={"/signin"}>Login</Link>
          </p>
        </CardFooter>

      </Card>
    </div>
  );
}



export default Signup;
