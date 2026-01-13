"use client";

import { MenuItem, SidebarProps, UserType } from "@/types";
import { FileText, LayoutDashboard, NotebookIcon, User, X } from "lucide-react";
import { useEffect } from "react";
import Logo from "./logo";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import Link from "next/link";

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  currentPage,
  setCurrentPage,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const auth = useAuth();

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
    const page = pathname.replace("/", "") || "dashboard";
    const validPageId =
      menuItems.find((item) => item.id === page)?.id || "dashboard";
    setCurrentPage(validPageId as any);
  }, [pathname]);

  const user: UserType = {
    name: auth.user?.displayName ?? "User",
    email: auth.user?.email ?? "user@example.com",
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64
          bg-background text-foreground
          border-r border-border
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
        `}
      >
        {/* Header */}
        <div className="px-6 py-5.5 flex items-center justify-between ">
          <Link href="/" aria-label="go home" className="cursor-pointer">
            <Logo />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-accent transition"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
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
                  group w-full flex items-center gap-3 px-4 py-2.5 rounded-lg
                  text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }
                `}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  className={`
                    w-5 h-5 transition-colors
                    ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    }
                  `}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <span className="text-sm font-semibold text-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
