// layout.tsx
import "./globals.css";

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
                  placeholder="Search markets"
                  className="w-[300px] rounded-md border border-border bg-background px-4 py-2 text-sm"
                />
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <a href="/markets" className="hover:text-primary transition">Markets</a>
              <a href="/dashboards" className="hover:text-primary transition">Dashboards</a>
              <a href="/sports" className="hover:text-primary transition">Sports</a>
              <a href="/activity" className="hover:text-primary transition">Activity</a>
              <a href="/ranks" className="hover:text-primary transition">Ranks</a>
              <button className="text-primary hover:text-primary/90">Log I</button>
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
              <a href="#" className="hover:text-primary">All</a>
              <a href="#" className="hover:text-primary">New</a>
              <a href="#" className="hover:text-primary">Politics</a>
              <a href="#" className="hover:text-primary">Sports</a>
              <a href="#" className="hover:text-primary">Crypto</a>
              <a href="#" className="hover:text-primary">Global Elections</a>
              <a href="#" className="hover:text-primary">Business</a>
            </div>
          </div>
        </header>
        <main className="mt-28">{children}</main>
      </body>
    </html>
  );
}
