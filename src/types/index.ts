import { User } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

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

type TopicContextType = {
  topics: Topic[];
  selectedTopic: Topic | null;
  setSelectedTopic: (topic: Topic | null) => void;
  loading: boolean;
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

type Importance = "high" | "medium" | "low";

interface Topic {
  id: string;
  name: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface Note {
  topicId: string;
  userId: string;
  title: string;
  content: string;
  importance: Importance;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

type DashboardData = {
  topicCount: number;
  noteCount: number;
  recentTopics: any[];
  recentNotes: any[];
};

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
  DashboardData,
  TopicContextType,
};
