import LoginPage from "@/components/login";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Notex - Login",
  description: "Login to your account",
};

const Login = () => {
  return <LoginPage />;
};

export default Login;
