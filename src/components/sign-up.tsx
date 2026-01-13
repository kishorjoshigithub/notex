"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/axios";
import { NewUser } from "@/types";
import { SignupSchema } from "@/validation/auth";
import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import Logo from "./logo";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<NewUser>({
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError({ ...error, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = SignupSchema.safeParse(formData);
    if (!result.success) {
      const errorFields: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        errorFields[String(issue.path[0])] = issue.message;
      });
      setError(errorFields);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/signup", formData);
      console.log(response);
      if (response.status === 201) {
        toast.success(response.data.message);
      }
    } catch (error: any) {
      const errorMessage = error.response.data.error;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        onSubmit={handleSubmit}
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link
              href="/"
              aria-label="go home"
              className="mx-auto mb-4 block w-fit"
            >
              <Logo />
            </Link>

            <p className="text-sm">Welcome! Create an account to get started</p>
          </div>

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="block text-sm">
                Full Name
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
              />

              {error.name && (
                <p className="text-red-500 text-sm">{error.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email
              </Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
              />
              {error.email && (
                <p className="text-red-500 text-sm">{error.email}</p>
              )}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pwd" className="text-sm">
                  Password
                </Label>
              </div>
              <Input
                type="password"
                name="password"
                id="password"
                className="input sz-md variant-mixed"
                value={formData.password}
                onChange={handleChange}
              />
              {error.password && (
                <p className="text-red-500 text-sm">{error.password}</p>
              )}
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <Loader2Icon className="animate-spin size-7 text-white" />
              ) : (
                "Sign up"
              )}
            </Button>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Have an account ?
            <Button asChild variant="link" className="px-2">
              <Link href="/login">Sign In</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  );
}
