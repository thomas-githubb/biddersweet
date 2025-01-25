// layout.tsx
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
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="fixed top-0 w-full bg-background border-b border-border z-50">
          <nav className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <div className="text-xl font-bold text-primary">BidderSweet</div>
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search auctions"
                  className="w-[300px] rounded-md border border-border bg-background px-4 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <a href="/auctions" className="hover:text-primary transition">Auctions</a>
              <a href="/categories" className="hover:text-primary transition">Categories</a>
              <a href="/sellers" className="hover:text-primary transition">Sellers</a>
              <a href="/activity" className="hover:text-primary transition">Activity</a>
              <a href="/watchlist" className="hover:text-primary transition">Watchlist</a>
              <button className="text-primary hover:text-primary/90">Log In</button>
              <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90">
                Sign Up
              </button>
            </div>
          </nav>
          <div className="border-t border-border">
            <div className="flex items-center space-x-6 p-2 px-4 text-sm">
              <span className="flex items-center text-red-500">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                LIVE
              </span>
              <a href="#" className="hover:text-primary">Featured</a>
              <a href="#" className="hover:text-primary">Ending Soon</a>
              <a href="#" className="hover:text-primary">Collectibles</a>
              <a href="#" className="hover:text-primary">Art</a>
              <a href="#" className="hover:text-primary">Luxury</a>
              <a href="#" className="hover:text-primary">Vintage</a>
              <a href="#" className="hover:text-primary">Electronics</a>
              <a href="#" className="hover:text-primary">Fashion</a>
              <a href="#" className="hover:text-primary">Real Estate</a>
            </div>
          </div>
        </header>

        {/* Adjusted sidebar spacing */}
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

        {/* Mobile menu button - only shows on mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-4 right-4 w-12 h-12 rounded-full shadow-lg border border-border bg-background md:hidden z-50"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Adjust main content with more top padding */}
        <main className="mt-32 md:ml-56 transition-all duration-300 px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
