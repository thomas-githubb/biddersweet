import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, DollarSign, Eye, Heart } from "lucide-react";

// Mock data for trending items
const trendingItems = [
  {
    id: 1,
    name: "Vintage Rolex Submariner",
    currentBid: 15000,
    endTime: "2h 45m",
    image: "/watch.jpg",
    bids: 23,
    watchers: 156,
  },
  {
    id: 2,
    name: "First Edition Harry Potter",
    currentBid: 8500,
    endTime: "4h 15m",
    image: "/book.jpg",
    bids: 15,
    watchers: 89,
  },
  {
    id: 3,
    name: "1967 Gibson Les Paul",
    currentBid: 12000,
    endTime: "1h 30m",
    image: "/guitar.jpg",
    bids: 31,
    watchers: 203,
  },
  {
    id: 4,
    name: "Original Andy Warhol Print",
    currentBid: 25000,
    endTime: "5h 20m",
    image: "/art.jpg",
    bids: 12,
    watchers: 178,
  },
];

// Mock data for auction listings
const auctionItems = [
  {
    id: 1,
    name: "Antique Victorian Desk",
    currentBid: 2500,
    endTime: "12h 30m",
    image: "/desk.jpg",
    category: "Furniture",
    bids: 8,
    watchers: 45,
    highestBidder: "j***n",
  },
  // Add more items...
];

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Trending Items Carousel */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending Now</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">←</Button>
            <Button variant="outline" size="sm">→</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gradient-to-br from-primary/5 to-secondary/5">
                {/* Replace with actual images */}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="backdrop-blur-sm bg-black/50 text-white">
                    <Timer className="w-4 h-4 mr-1" />
                    {item.endTime}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center text-primary">
                    <DollarSign className="w-4 h-4 mr-1" />
                    <span className="font-bold">{item.currentBid.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {item.watchers}
                    </span>
                    <span className="flex items-center">
                      <Heart className="w-4 h-4 mr-1" />
                      {item.bids}
                    </span>
                  </div>
                </div>
                <Button className="w-full">Place Bid</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex items-center space-x-4 mb-6 overflow-x-auto pb-2">
        <Button variant="default" size="sm">All Items</Button>
        {["Art", "Collectibles", "Electronics", "Fashion", "Jewelry", "Sports"].map((category) => (
          <Button key={category} variant="outline" size="sm">
            {category}
          </Button>
        ))}
      </div>

      {/* Auction Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {auctionItems.map((item) => (
          <Card key={item.id} className="p-4 hover:shadow-lg transition">
            <div className="flex gap-4">
              <div className="w-32 h-32 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-md">
                {/* Replace with actual image */}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <Badge variant="secondary" className="mt-1">
                      {item.category}
                    </Badge>
                  </div>
                  <Badge variant="destructive" className="flex items-center">
                    <Timer className="w-4 h-4 mr-1" />
                    {item.endTime}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current Bid</span>
                    <span className="font-semibold text-primary">
                      ${item.currentBid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Highest Bidder</span>
                    <span>{item.highestBidder}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {item.watchers}
                      </span>
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {item.bids}
                      </span>
                    </div>
                    <Button size="sm">Bid Now</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
