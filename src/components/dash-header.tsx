import { HeaderProps } from "@/types";
import { Loader2Icon, LogOut, LogOutIcon, Menu, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useAuth } from "@/context/authContext";
import { SignOut } from "@/firebase/auth";
import toast from "react-hot-toast";

// Header Component
const Header: React.FC<HeaderProps> = ({ pageTitle, setIsOpen }) => {
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
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

  return (
    <header className="sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">{pageTitle}</h1>
        </div>

        <div className="flex justify-center items-center gap-2">
          <Button
            onClick={toggleTheme}
            variant="outline"
            size="icon"
            className="cursor-pointer hover:scale-105 transition-all duration-300"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          </Button>
          <Button
            variant={"outline"}
            className="cursor-pointer hover:scale-105 transition-all duration-300"
            onClick={handleLogout}
          >
            {loading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <LogOut className="h-[1.2rem] w-[1.2rem]" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
