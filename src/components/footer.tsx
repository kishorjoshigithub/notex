"use client";
import Link from "next/link";
import Logo from "./logo";

export default function FooterSection() {
  const YEAR = new Date().getFullYear();

  return (
    <footer className="py-16 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <Link href="/" aria-label="go home" className="mx-auto block size-fit">
          <Logo />
        </Link>

        <span className="text-muted-foreground block text-center text-sm mt-6">
          {" "}
          © {YEAR} Notex, All rights reserved
        </span>
      </div>
    </footer>
  );
}
