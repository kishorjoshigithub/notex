"use client";

import { MenuItem, SidebarProps, UserType } from "@/types";
import {
  ChevronDown,
  FileText,
  LayoutDashboard,
  NotebookIcon,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import Logo from "./logo";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  currentPage,
  setCurrentPage,
}) => {
  const [selectedNote, setSelectedNote] = useState<string>("React Js");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();

  const notes: string[] = ["React Js", "Node Js", "Java", "Javascript"];

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    { id: "topics", label: "Topics", icon: NotebookIcon, href: "/topics" },
    { id: "notes", label: "Notes", icon: FileText, href: "/notes" },
    { id: "account", label: "Account", icon: User, href: "/account" },
  ];

  useEffect(() => {
    switch (pathname) {
      case "/dashboard":
        setCurrentPage("dashboard");
        break;
      case "/notes":
        setCurrentPage("notes");
        break;
      case "/account":
        setCurrentPage("account");
        break;
      case "/topics":
        setCurrentPage("topics");
        break;
      default:
        setCurrentPage("dashboard");
        break;
    }
  }, [pathname]);

  const user: UserType = {
    name: auth.user?.displayName ?? "User",
    email: auth.user?.email ?? "user@example.com",
  };

  return (
    <>
      {isOpen && (
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden`}
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        flex flex-col
      `}
      >
        <div className="p-4 flex items-center justify-between">
          <div className="flex justify-center items-center w-full">
            <Logo />
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-100 transition-colors"
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
            >
              <span className="text-sm font-medium text-gray-700">
                {selectedNote}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div
                className="absolute top-full h-40 overflow-y-scroll left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                role="listbox"
              >
                {notes.map((note) => (
                  <button
                    key={note}
                    onClick={() => {
                      setSelectedNote(note);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm text-black first:rounded-t-lg last:rounded-b-lg transition-colors"
                    role="option"
                    aria-selected={selectedNote === note}
                  >
                    <input
                      type="checkbox"
                      name="note"
                      id="note"
                      checked={selectedNote === note}
                      onChange={() => {
                        setSelectedNote(note);
                        setIsDropdownOpen(false);
                      }}
                      className="mr-2"
                    />
                    {note}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsOpen(false);
                  router.push(item.href);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                  ${
                    isActive ? "bg-blue-50 text-blue-600" : " hover:bg-gray-600"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
              <p className="text-lg text-black font-medium">
                {user.name.charAt(0).toUpperCase()}
              </p>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
