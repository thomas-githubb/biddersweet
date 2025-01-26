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
  Search,
  TrendingUp,
  Package,
  Grid,
  Activity,
  Bookmark
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<any>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <html lang="en">
      <body>
        <header className="fixed top-0 w-full bg-gradient-to-b from-gray-900/95 to-gray-900/90 backdrop-blur-md border-b border-purple-500/10 z-50">
          <nav className="flex items-center justify-between p-4 max-w-[1920px] mx-auto">
            <div className="flex items-center space-x-8">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent hover:from-purple-500 hover:to-purple-700 transition-all duration-300"
              >
                BidderSuite
              </Link>
              
              <div className="relative group">
                <div className={`
                  relative flex items-center transition-all duration-300
                  ${isSearchFocused ? 'w-[400px]' : 'w-[300px]'}
                `}>
                  <Search className="absolute left-3 w-4 h-4 text-purple-400" />
                  <input
                    type="search"
                    placeholder="Search auctions..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-800/50 border border-purple-500/20 
                             text-sm text-purple-100 placeholder-purple-300/30
                             focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/40
                             transition-all duration-300"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-6">
                {[
                  { href: "/auctions", label: "Auctions", icon: Package },
                  { href: "/categories", label: "Categories", icon: Grid },
                  { href: "/activity", label: "Activity", icon: Activity },
                  { href: "/watchlist", label: "Watchlist", icon: Bookmark },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center space-x-2 text-purple-200/70 hover:text-purple-100 
                             transition-colors duration-200 group"
                  >
                    <item.icon className="w-4 h-4 group-hover:text-purple-400 transition-colors duration-200" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20
                         transition-all duration-300 hover:shadow-purple-600/40 hover:scale-105"
                asChild
              >
                <Link href="/create-auction" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Auction
                </Link>
              </Button>

              {user ? (
                <div className="flex items-center space-x-4">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-600/20 border border-purple-500/30 
                                  flex items-center justify-center">
                      <span className="text-purple-100 font-medium">
                        {user.displayName?.[0] || user.email?.[0] || "U"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm text-purple-100">
                        {user.displayName || "User"}
                      </span>
                      <span className="text-xs text-purple-400">
                        {user.email}
                      </span>
                    </div>
                    <Button
                      onClick={handleSignOut}
                      variant="ghost"
                      className="text-purple-400 hover:text-purple-100 hover:bg-purple-500/20"
                    >
                      Sign Out
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link href="/login">
                    <Button variant="ghost" 
                            className="text-purple-400 hover:text-purple-100 hover:bg-purple-500/20">
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </header>

        <aside className="fixed left-0 top-[73px] h-[calc(100vh-73px)] w-64 
                         bg-gradient-to-b from-gray-900/95 to-gray-900/90 backdrop-blur-md 
                         border-r border-purple-500/10 hidden md:block">
          <div className="p-4 h-full flex flex-col">
            {/* User Stats Summary - More compact */}
            {user && (
              <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10 mb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/30 
                                flex items-center justify-center">
                    <span className="text-purple-100 font-medium">
                      {user.displayName?.[0] || user.email?.[0] || "U"}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-purple-100">Welcome back,</div>
                    <div className="text-xs text-purple-400">{user.displayName || "User"}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-1.5 rounded-lg bg-purple-500/10">
                    <div className="text-xs text-purple-400">Active Bids</div>
                    <div className="text-sm font-medium text-purple-100">12</div>
                  </div>
                  <div className="p-1.5 rounded-lg bg-purple-500/10">
                    <div className="text-xs text-purple-400">Watchlist</div>
                    <div className="text-sm font-medium text-purple-100">8</div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Navigation - Reduced vertical spacing */}
            <div className="space-y-0.5 mb-4">
              <div className="text-xs font-medium text-purple-400/60 uppercase tracking-wider px-2 mb-1">
                Main Menu
              </div>
              {[
                { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
                { icon: User, label: "Profile", href: "/profile" },
                { icon: Eye, label: "Watchlist", href: "/watchlist", badge: "8" },
                { icon: Heart, label: "Liked Items", href: "/likes", badge: "12" },
                { icon: History, label: "Bid History", href: "/history" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-3 py-2 rounded-lg
                           text-purple-200/70 hover:text-purple-100
                           hover:bg-purple-500/10 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Notifications & Messages - Reduced spacing */}
            <div className="space-y-0.5 mb-4">
              <div className="text-xs font-medium text-purple-400/60 uppercase tracking-wider px-2 mb-1">
                Notifications
              </div>
              {[
                { icon: Bell, label: "Notifications", href: "/notifications", badge: "3" },
                { icon: MessageSquare, label: "Messages", href: "/messages", badge: "5" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between px-3 py-2 rounded-lg
                           text-purple-200/70 hover:text-purple-100
                           hover:bg-purple-500/10 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-purple-500/20 text-purple-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Settings & Support - Reduced spacing */}
            <div className="space-y-0.5">
              <div className="text-xs font-medium text-purple-400/60 uppercase tracking-wider px-2 mb-1">
                Settings
              </div>
              {[
                { icon: Settings, label: "Settings", href: "/settings" },
                { icon: HelpCircle, label: "Help & Support", href: "/help" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg
                           text-purple-200/70 hover:text-purple-100
                           hover:bg-purple-500/10 transition-all duration-200 group"
                >
                  <item.icon className="w-4 h-4 text-purple-400 group-hover:text-purple-300" />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              ))}
            </div>

            {/* Pro Upgrade Banner - At the bottom */}
            <div className="mt-auto pt-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-900/20 border border-purple-500/10">
                <div className="text-sm font-medium text-purple-100">Upgrade to Pro</div>
                <div className="text-xs text-purple-400 mb-2">Get exclusive features</div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-1">
                  Upgrade Now
                </Button>
              </div>
            </div>
          </div>
        </aside>

        <main className="mt-[93px] md:ml-64 transition-all duration-300 px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
