import { div } from "motion/react-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign Up",
};

export default function SignUpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
