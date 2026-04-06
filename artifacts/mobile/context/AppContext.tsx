import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: "beginner" | "intermediate" | "expert";
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  bio: string;
  skills: Skill[];
  reputation: number;
  tradesCompleted: number;
  memberSince: string;
  location: string;
}

export interface Trade {
  id: string;
  offeredBy: User;
  offerSkill: Skill;
  wantSkill: Skill;
  description: string;
  hoursRequired: number;
  futureDeadlineDays: number;
  status: "open" | "pending" | "active" | "completed" | "cancelled";
  createdAt: string;
  contractAddress?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  trade: Trade;
  participant: User;
  messages: Message[];
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
}

export interface Notification {
  id: string;
  type: "trade_request" | "message" | "contract_signed" | "trade_completed";
  title: string;
  body: string;
  time: string;
  read: boolean;
  tradeId?: string;
}

interface AppContextType {
  currentUser: User;
  trades: Trade[];
  conversations: Conversation[];
  notifications: Notification[];
  myTrades: Trade[];
  addTrade: (trade: Omit<Trade, "id" | "createdAt" | "status" | "offeredBy">) => void;
  acceptTrade: (tradeId: string) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
  unreadMessages: number;
}

const SKILLS_CATEGORIES = [
  "Design", "Development", "Marketing", "Finance", "Writing",
  "Music", "Photography", "Video", "Data", "Teaching"
];

const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Aisha Rahman",
    bio: "UX designer with 5 years building fintech products. Love helping people craft compelling narratives through design.",
    skills: [
      { id: "s1", name: "UX Design", category: "Design", level: "expert" },
      { id: "s2", name: "Figma", category: "Design", level: "expert" },
      { id: "s3", name: "User Research", category: "Design", level: "intermediate" },
    ],
    reputation: 4.9,
    tradesCompleted: 23,
    memberSince: "Jan 2024",
    location: "New York, USA",
  },
  {
    id: "u2",
    name: "Marcus Chen",
    bio: "Full-stack engineer who loves open source. Currently building my design skills to go indie.",
    skills: [
      { id: "s4", name: "React Native", category: "Development", level: "expert" },
      { id: "s5", name: "Node.js", category: "Development", level: "expert" },
      { id: "s6", name: "PostgreSQL", category: "Data", level: "intermediate" },
    ],
    reputation: 4.7,
    tradesCompleted: 18,
    memberSince: "Mar 2024",
    location: "San Francisco, USA",
  },
  {
    id: "u3",
    name: "Priya Sharma",
    bio: "Marketing strategist & growth hacker. Helped 10+ startups reach product-market fit.",
    skills: [
      { id: "s7", name: "Growth Marketing", category: "Marketing", level: "expert" },
      { id: "s8", name: "SEO Strategy", category: "Marketing", level: "expert" },
      { id: "s9", name: "Copywriting", category: "Writing", level: "intermediate" },
    ],
    reputation: 4.8,
    tradesCompleted: 31,
    memberSince: "Dec 2023",
    location: "London, UK",
  },
  {
    id: "u4",
    name: "Luca Ferrara",
    bio: "Musician & audio producer. Teaching logic, looking to learn how to build my own studio website.",
    skills: [
      { id: "s10", name: "Music Production", category: "Music", level: "expert" },
      { id: "s11", name: "Sound Design", category: "Music", level: "expert" },
      { id: "s12", name: "Ableton Live", category: "Music", level: "expert" },
    ],
    reputation: 4.6,
    tradesCompleted: 12,
    memberSince: "May 2024",
    location: "Milan, Italy",
  },
  {
    id: "u5",
    name: "Sofia Andersen",
    bio: "Freelance photographer. Looking to learn data analysis to better understand my audience.",
    skills: [
      { id: "s13", name: "Photography", category: "Photography", level: "expert" },
      { id: "s14", name: "Lightroom", category: "Photography", level: "expert" },
      { id: "s15", name: "Brand Photography", category: "Photography", level: "expert" },
    ],
    reputation: 4.9,
    tradesCompleted: 27,
    memberSince: "Feb 2024",
    location: "Copenhagen, Denmark",
  },
];

const MOCK_TRADES: Trade[] = [
  {
    id: "t1",
    offeredBy: MOCK_USERS[0],
    offerSkill: { id: "s1", name: "UX Design", category: "Design", level: "expert" },
    wantSkill: { id: "s4", name: "React Native", category: "Development", level: "intermediate" },
    description: "I'll design a complete mobile app UI from wireframes to high-fidelity prototypes. In return, I'd love help building it in React Native over the next 3 months.",
    hoursRequired: 20,
    futureDeadlineDays: 90,
    status: "open",
    createdAt: "2026-04-04T10:00:00Z",
    contractAddress: "0x1a2b...3c4d",
  },
  {
    id: "t2",
    offeredBy: MOCK_USERS[1],
    offerSkill: { id: "s5", name: "Node.js", category: "Development", level: "expert" },
    wantSkill: { id: "s7", name: "Growth Marketing", category: "Marketing", level: "intermediate" },
    description: "Will build a complete REST API with authentication, real-time features, and deployment setup. Looking for someone to help market my upcoming SaaS product.",
    hoursRequired: 15,
    futureDeadlineDays: 60,
    status: "open",
    createdAt: "2026-04-03T14:30:00Z",
  },
  {
    id: "t3",
    offeredBy: MOCK_USERS[2],
    offerSkill: { id: "s7", name: "Growth Marketing", category: "Marketing", level: "expert" },
    wantSkill: { id: "s13", name: "Photography", category: "Photography", level: "intermediate" },
    description: "I can create and execute a full growth strategy for your project — content calendar, social strategy, and paid ads framework. Want high-quality product photos for my portfolio.",
    hoursRequired: 12,
    futureDeadlineDays: 45,
    status: "open",
    createdAt: "2026-04-02T09:15:00Z",
    contractAddress: "0x5e6f...7a8b",
  },
  {
    id: "t4",
    offeredBy: MOCK_USERS[3],
    offerSkill: { id: "s10", name: "Music Production", category: "Music", level: "expert" },
    wantSkill: { id: "s4", name: "Web Development", category: "Development", level: "intermediate" },
    description: "I'll produce 3 original tracks for your project, app, or brand — with full commercial license. Just need a portfolio website in return.",
    hoursRequired: 10,
    futureDeadlineDays: 30,
    status: "open",
    createdAt: "2026-04-01T16:45:00Z",
  },
  {
    id: "t5",
    offeredBy: MOCK_USERS[4],
    offerSkill: { id: "s13", name: "Photography", category: "Photography", level: "expert" },
    wantSkill: { id: "s6", name: "Data Analysis", category: "Data", level: "beginner" },
    description: "Complete brand photography session — headshots, product shots, lifestyle content. 100+ edited images. Looking to learn Python data analysis to understand my Instagram audience better.",
    hoursRequired: 8,
    futureDeadlineDays: 60,
    status: "open",
    createdAt: "2026-03-30T11:20:00Z",
  },
];

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    trade: MOCK_TRADES[0],
    participant: MOCK_USERS[0],
    messages: [
      { id: "m1", senderId: "u1", text: "Hey! I saw your profile. I love the idea of this trade. Would love to chat more about the project scope.", timestamp: "2026-04-05T10:00:00Z" },
      { id: "m2", senderId: "me", text: "Hi Aisha! Yes, I'm really interested. Can we set up a call to go over details?", timestamp: "2026-04-05T10:05:00Z" },
      { id: "m3", senderId: "u1", text: "Absolutely! How about Thursday at 3pm UTC?", timestamp: "2026-04-05T10:08:00Z" },
    ],
    lastMessage: "Absolutely! How about Thursday at 3pm UTC?",
    lastMessageTime: "10:08 AM",
    unread: 1,
  },
  {
    id: "c2",
    trade: MOCK_TRADES[2],
    participant: MOCK_USERS[2],
    messages: [
      { id: "m4", senderId: "u3", text: "Thanks for reaching out! I've reviewed your work and I'm very impressed with your growth numbers.", timestamp: "2026-04-04T14:00:00Z" },
      { id: "m5", senderId: "me", text: "Thanks Priya! Your marketing case studies are incredible. Ready to start whenever.", timestamp: "2026-04-04T14:30:00Z" },
    ],
    lastMessage: "Thanks Priya! Your marketing case studies are incredible.",
    lastMessageTime: "Yesterday",
    unread: 0,
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "trade_request",
    title: "New Trade Request",
    body: "Aisha Rahman wants to trade UX Design for React Native help",
    time: "2 min ago",
    read: false,
    tradeId: "t1",
  },
  {
    id: "n2",
    type: "contract_signed",
    title: "Contract Signed",
    body: "Your trade contract with Priya Sharma has been signed on-chain",
    time: "1 hour ago",
    read: false,
    tradeId: "t3",
  },
  {
    id: "n3",
    type: "message",
    title: "New Message",
    body: "Aisha Rahman: Absolutely! How about Thursday at 3pm UTC?",
    time: "3 hours ago",
    read: true,
    tradeId: "t1",
  },
  {
    id: "n4",
    type: "trade_completed",
    title: "Trade Completed",
    body: "Your trade with Marcus Chen has been marked complete. Reputation updated!",
    time: "2 days ago",
    read: true,
  },
];

const CURRENT_USER: User = {
  id: "me",
  name: "Jordan Rivera",
  bio: "Frontend developer learning design. Building cool stuff and looking to grow my skill set through collaboration.",
  skills: [
    { id: "sk1", name: "React Native", category: "Development", level: "expert" },
    { id: "sk2", name: "TypeScript", category: "Development", level: "expert" },
    { id: "sk3", name: "CSS", category: "Design", level: "intermediate" },
  ],
  reputation: 4.8,
  tradesCompleted: 7,
  memberSince: "Mar 2025",
  location: "Austin, TX",
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>(MOCK_TRADES);
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const myTrades = trades.filter(
    (t) => t.offeredBy.id === "me" || t.status === "active" || t.status === "pending"
  );

  const unreadCount = notifications.filter((n) => !n.read).length;
  const unreadMessages = conversations.reduce((acc, c) => acc + c.unread, 0);

  const addTrade = (tradeData: Omit<Trade, "id" | "createdAt" | "status" | "offeredBy">) => {
    const newTrade: Trade = {
      ...tradeData,
      id: `t${Date.now()}`,
      offeredBy: CURRENT_USER,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    setTrades((prev) => [newTrade, ...prev]);
  };

  const acceptTrade = (tradeId: string) => {
    setTrades((prev) =>
      prev.map((t) => (t.id === tradeId ? { ...t, status: "pending" } : t))
    );
    const trade = trades.find((t) => t.id === tradeId);
    if (trade) {
      const newNotif: Notification = {
        id: `n${Date.now()}`,
        type: "trade_request",
        title: "Trade Request Sent",
        body: `You sent a trade request to ${trade.offeredBy.name}`,
        time: "Just now",
        read: false,
        tradeId,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser: CURRENT_USER,
        trades,
        conversations,
        notifications,
        myTrades,
        addTrade,
        acceptTrade,
        markNotificationRead,
        markAllNotificationsRead,
        unreadCount,
        unreadMessages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

export { SKILLS_CATEGORIES };
