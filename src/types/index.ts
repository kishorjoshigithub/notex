import { User } from "firebase/auth";

interface NewUser {
  name: string;
  email: string;
  password: string;
}

interface LoggedUser {
  email: string;
  password: string;
}

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
};

interface UserType {
  name: string;
  email: string;
}

interface MenuItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}

type PageId = "dashboard" | "topics" | "notes" | "account";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
}

interface HeaderProps {
  pageTitle: string;
  setIsOpen: (isOpen: boolean) => void;
}

type Importance = "High" | "Medium" | "Low";

interface Topic {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Note {
  id: string;
  content: string;
  importance: Importance;
  createdAt: string;
  updatedAt: string;
}

export type {
  NewUser,
  LoggedUser,
  AuthContextType,
  UserType,
  MenuItem,
  PageId,
  SidebarProps,
  HeaderProps,
  Importance,
  Topic,
  Note,
};
