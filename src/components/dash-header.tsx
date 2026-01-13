"use client";

import { HeaderProps } from "@/types";
import { Loader2Icon, LogOut, Menu, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { SignOut } from "@/firebase/auth";
import toast from "react-hot-toast";

const Header: React.FC<HeaderProps> = ({ pageTitle, setIsOpen }) => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  const toggleTheme = () => {
    setTheme(currentTheme === "dark" ? "light" : "dark");
  };

  const handleLogout = async (): Promise<void> => {
    try {
      setLoading(true);
      await SignOut();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="
              lg:hidden rounded-md p-2
              text-muted-foreground
              hover:bg-accent hover:text-foreground
              transition
            "
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <h1 className="text-lg font-semibold tracking-tight">{pageTitle}</h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            className="relative"
            aria-label="Toggle theme"
          >
            <Sun
              className="
                h-[1.2rem] w-[1.2rem]
                rotate-0 scale-100 transition-all
                dark:-rotate-90 dark:scale-0
              "
            />
            <Moon
              className="
                absolute h-[1.2rem] w-[1.2rem]
                rotate-90 scale-0 transition-all
                dark:rotate-0 dark:scale-100
              "
            />
          </Button>

          {/* Logout */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleLogout}
            disabled={loading}
            aria-label="Logout"
          >
            {loading ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
