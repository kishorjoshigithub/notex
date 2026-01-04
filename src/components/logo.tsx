"use client";
import Image from "next/image";

const Logo = () => {
  return (
    <>
      <Image
        src="/logo-light.png"
        alt="Notex Logo"
        width={60}
        height={60}
        className="block dark:hidden"
        priority
      />
      <Image
        src="/logo.png"
        alt="Notex Logo Dark"
        width={60}
        height={60}
        className="hidden dark:block"
        priority
      />
    </>
  );
};

export default Logo;
