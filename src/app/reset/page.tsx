import PasswordResetPage from "@/components/reset";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Notex - Reset Password",
  description: "Reset your password",
};

const Reset = () => {
  return (
    <>
      <PasswordResetPage />
    </>
  );
};

export default Reset;
