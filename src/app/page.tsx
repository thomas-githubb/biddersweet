import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, DollarSign, Eye, Heart } from "lucide-react";
import { TrendingCarousel } from "@/components/trending-carousel";

// Expanded mock data for trending items
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
  {
    id: 5,
    name: "Rare Pokemon Card Collection",
    currentBid: 5000,
    endTime: "6h 10m",
    image: "/pokemon.jpg",
    bids: 45,
    watchers: 312,
  },
  {
    id: 6,
    name: "Vintage Hermès Birkin Bag",
    currentBid: 18000,
    endTime: "3h 55m",
    image: "/bag.jpg",
    bids: 19,
    watchers: 245,
  },
  {
    id: 7,
    name: "1955 Porsche Speedster",
    currentBid: 145000,
    endTime: "12h 30m",
    image: "/car.jpg",
    bids: 8,
    watchers: 567,
  },
  {
    id: 8,
    name: "Ancient Roman Coin Set",
    currentBid: 3500,
    endTime: "8h 15m",
    image: "/coins.jpg",
    bids: 27,
    watchers: 134,
  },
  {
    id: 9,
    name: "Original Star Wars Poster",
    currentBid: 2800,
    endTime: "5h 45m",
    image: "/poster.jpg",
    bids: 16,
    watchers: 98,
  },
  {
    id: 10,
    name: "Signed Michael Jordan Jersey",
    currentBid: 9500,
    endTime: "7h 20m",
    image: "/jersey.jpg",
    bids: 34,
    watchers: 289,
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
          <h2 className="text-2xl font-bold text-purple-100">Trending Now</h2>
        </div>
        <TrendingCarousel items={trendingItems} />
      </div>

      {/* Category Filters */}
      <div className="flex items-center space-x-4 mb-6 overflow-x-auto pb-2">
        <Button
          variant="default"
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
        >
          All Items
        </Button>
        {[
          "Art",
          "Collectibles",
          "Electronics",
          "Fashion",
          "Jewelry",
          "Sports",
        ].map((category) => (
          <Button
            key={category}
            variant="outline"
            size="sm"
            className="border-purple-700 hover:bg-purple-900/50"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Auction Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {auctionItems.map((item) => (
          <Card
            key={item.id}
            className="p-4 hover:shadow-lg transition bg-gray-900 border-purple-900/20"
          >
            <div className="flex gap-4">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500/10 to-gray-500/10 rounded-md">
                {/* Replace with actual image */}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg text-purple-100">
                      {item.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="mt-1 bg-purple-900/50"
                    >
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
                    <span className="text-gray-400">Current Bid</span>
                    <span className="font-semibold text-purple-400">
                      ${item.currentBid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Highest Bidder</span>
                    <span className="text-purple-100">
                      {item.highestBidder}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {item.watchers}
                      </span>
                      <span className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {item.bids}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700"
                      asChild
                    >
                      <a href="/placebid">Bid Now</a>
                    </Button>
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
