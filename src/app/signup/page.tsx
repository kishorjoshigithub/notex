import LoginPage from "@/components/sign-up";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Notex - Sign Up",
  description: "Sign up for an account",
};

const Signup = () => {
  return <LoginPage />;
};

export default Signup;
