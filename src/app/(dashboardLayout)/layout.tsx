"use client";

import Header from "@/components/dash-header";
import Sidebar from "@/components/sidebar";
import { useAuth } from "@/context/authContext";
import { PageId } from "@/types";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<PageId>("dashboard");

  const pageTitles: Record<PageId, string> = {
    dashboard: "Dashboard",
    notes: "My Notes",
    account: "Account Settings",
    topics: "Topics",
  };
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) router.replace("/login");
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <div className="w-full h-full">
        <Loader2Icon className="animate-spin size-7 text-white" />
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen  overflow-hidden">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            pageTitle={pageTitles[currentPage]}
            setIsOpen={setIsSidebarOpen}
          />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-800 rounded-tl-md rounded-tr-md">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
