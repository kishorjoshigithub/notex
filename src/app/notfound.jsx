"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-transparent">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 text-center shadow-md">
        <div className="mb-4 flex justify-center">
          <Logo />
        </div>

        <h1 className="text-3xl font-bold">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sorry, the page you’re looking for doesn’t exist.
        </p>

        <Button asChild className="mt-6 w-full">
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </section>
  );
}
