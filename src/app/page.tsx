"use client";
import Features from "@/components/features-1";
import FooterSection from "@/components/footer";
import HeroSection from "@/components/hero-section";
import { auth, db } from "@/config/firebase-config";
import React from "react";

const App = () => {
  return (
    <>
      <HeroSection />
      <Features />
      <FooterSection />
    </>
  );
};

export default App;
