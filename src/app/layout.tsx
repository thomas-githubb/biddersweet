"use client";

import "./globals.css";
import {
  LayoutDashboard,
  User,
  Settings,
  History,
  Heart,
  Eye,
  Bell,
  MessageSquare,
  HelpCircle,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null); // Track authentication state

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null); // Reset user state to null after signing out
  };

  return (
    <html lang="en">
      <body>
        <header className="fixed top-0 w-full bg-background border-b border-border z-50">
          <nav className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                className="text-xl font-bold text-primary hover:text-primary/90 transition-colors"
              >
                BidderSuite
              </Link>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search auctions"
                  className="w-[300px] rounded-md border border-border bg-background px-4 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
                asChild
              >
                <Link href="/create-auction">
                  <Plus className="w-4 h-4" />
                  Create Auction
                </Link>
              </Button>
              <a href="/auctions" className="hover:text-primary transition">
                Auctions
              </a>
              <a href="/dashboard" className="hover:text-primary transition">
                Dashboard
              </a>
              <a href="/categories" className="hover:text-primary transition">
                Categories
              </a>
              <a href="/activity" className="hover:text-primary transition">
                Activity
              </a>
              <a href="/watchlist" className="hover:text-primary transition">
                Watchlist
              </a>
              {user ? (
                <>
                  <span className="text-primary">
                    Welcome, {user.displayName || "User"}
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button className="text-primary hover:text-primary/90">
                    <a href="/login">Log In</a>
                  </button>
                  <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                    <a href="/signup">Sign Up</a>
                  </button>
                </>
              )}
            </div>
          </nav>
          <div className="border-t border-border">
            <div className="flex items-center space-x-6 p-2 px-4 text-sm">
              <span className="flex items-center text-red-500">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                LIVE
              </span>
              <a href="#" className="hover:text-primary">
                Featured
              </a>
              <a href="#" className="hover:text-primary">
                Ending Soon
              </a>
              <a href="#" className="hover:text-primary">
                Collectibles
              </a>
              <a href="#" className="hover:text-primary">
                Art
              </a>
              <a href="#" className="hover:text-primary">
                Luxury
              </a>
              <a href="#" className="hover:text-primary">
                Vintage
              </a>
              <a href="#" className="hover:text-primary">
                Electronics
              </a>
              <a href="#" className="hover:text-primary">
                Fashion
              </a>
              <a href="#" className="hover:text-primary">
                Real Estate
              </a>
            </div>
          </div>
        </header>

        <aside className="fixed left-0 top-[89px] h-[calc(100vh-89px)] w-56 border-r border-border bg-background/50 backdrop-blur-sm hidden md:block">
          <div className="p-2 space-y-6 mt-8">
            <div className="space-y-1.5">
              <a
                href="/dashboard"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-purple-900/20 transition-colors text-sm"
              >
                <LayoutDashboard size={18} className="text-purple-400" />
                <span>Dashboard</span>
              </a>
              <a
                href="/profile"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-purple-900/20 transition-colors text-sm"
              >
                <User size={18} className="text-purple-400" />
                <span>Profile</span>
              </a>
              <a
                href="/watchlist"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-purple-900/20 transition-colors text-sm"
              >
                <Eye size={18} className="text-purple-400" />
                <span>Watchlist</span>
              </a>
              <a
                href="/likes"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-purple-900/20 transition-colors text-sm"
              >
                <Heart size={18} className="text-purple-400" />
                <span>Liked Items</span>
              </a>
              <a
                href="/history"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-purple-900/20 transition-colors text-sm"
              >
                <History size={18} className="text-purple-400" />
                <span>Bid History</span>
              </a>
            </div>

            <div className="pt-2 border-t border-border/50 space-y-1.5">
              <a
                href="/notifications"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-purple-900/20 transition-colors text-sm"
              >
                <Bell size={18} className="text-purple-400" />
                <span>Notifications</span>
              </a>
              <a
                href="/messages"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-purple-900/20 transition-colors text-sm"
              >
                <MessageSquare size={18} className="text-purple-400" />
                <span>Messages</span>
              </a>
            </div>

            <div className="pt-2 border-t border-border/50 space-y-1.5">
              <a
                href="/settings"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-purple-900/20 transition-colors text-sm"
              >
                <Settings size={18} className="text-purple-400" />
                <span>Settings</span>
              </a>
              <a
                href="/help"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-purple-900/20 transition-colors text-sm"
              >
                <HelpCircle size={18} className="text-purple-400" />
                <span>Help & Support</span>
              </a>
            </div>
          </div>
        </aside>

        <main className="mt-32 md:ml-56 transition-all duration-300 px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
