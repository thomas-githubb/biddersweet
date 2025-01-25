"use client"

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, DollarSign, Eye, Heart } from "lucide-react";
import { TrendingCarousel } from "@/components/trending-carousel";
import { useState, useEffect } from "react";
import { useCountdown } from "@/hooks/useCountdown";
import { AnimatedPrice } from "@/components/ui/animated-price"
import { AnimatedHeart } from "@/components/ui/animated-heart"

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
    endTime: "2d 12h 30m",
    image: "/car.jpg",
    bids: 8,
    watchers: 567,
  },
  {
    id: 8,
    name: "Ancient Roman Coin Set",
    currentBid: 3500,
    endTime: "3d 8h 15m",
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

// Separate the mock data into a different file
const auctionItems = [
  {
    id: 1,
    name: "Original Banksy Print",
    currentBid: 12000,
    endTime: "3h 20m",
    image: "/art.jpg",
    category: "Art",
    bids: 23,
    watchers: 267,
    highestBidder: "a***x",
    isLiked: false,
  },
  {
    id: 2,
    name: "Van Gogh Reproduction",
    currentBid: 8500,
    endTime: "5h 45m",
    image: "/art2.jpg",
    category: "Art",
    bids: 15,
    watchers: 189,
    highestBidder: "m***k",
  },
  {
    id: 3,
    name: "Contemporary Abstract Painting",
    currentBid: 4200,
    endTime: "2h 15m",
    image: "/art3.jpg",
    category: "Art",
    bids: 9,
    watchers: 142,
    highestBidder: "p***r",
  },

  // Collectibles Category
  {
    id: 4,
    name: "Rare Pokemon Card Collection",
    currentBid: 5000,
    endTime: "6h 10m",
    image: "/pokemon.jpg",
    category: "Collectibles",
    bids: 45,
    watchers: 312,
    highestBidder: "j***n",
  },
  {
    id: 5,
    name: "First Edition Comic Book",
    currentBid: 3200,
    endTime: "5h 10m",
    image: "/comic.jpg",
    category: "Collectibles",
    bids: 18,
    watchers: 156,
    highestBidder: "m***k",
  },
  {
    id: 6,
    name: "Vintage Star Wars Figures",
    currentBid: 2800,
    endTime: "4h 30m",
    image: "/starwars.jpg",
    category: "Collectibles",
    bids: 27,
    watchers: 234,
    highestBidder: "r***x",
  },

  // Electronics Category
  {
    id: 7,
    name: "Vintage Apple-1 Computer",
    currentBid: 35000,
    endTime: "12h 45m",
    image: "/apple1.jpg",
    category: "Electronics",
    bids: 12,
    watchers: 445,
    highestBidder: "t***y",
  },
  {
    id: 8,
    name: "First Generation iPod",
    currentBid: 2200,
    endTime: "8h 20m",
    image: "/ipod.jpg",
    category: "Electronics",
    bids: 16,
    watchers: 178,
    highestBidder: "k***z",
  },

  // Fashion Category
  {
    id: 9,
    name: "Vintage Chanel Bag",
    currentBid: 4800,
    endTime: "3h 15m",
    image: "/chanel.jpg",
    category: "Fashion",
    bids: 28,
    watchers: 256,
    highestBidder: "l***a",
  },
  {
    id: 10,
    name: "Limited Edition Nike Shoes",
    currentBid: 1500,
    endTime: "7h 30m",
    image: "/nike.jpg",
    category: "Fashion",
    bids: 34,
    watchers: 189,
    highestBidder: "s***n",
  },

  // Jewelry Category
  {
    id: 11,
    name: "Diamond Engagement Ring",
    currentBid: 15000,
    endTime: "4h 45m",
    image: "/ring.jpg",
    category: "Jewelry",
    bids: 19,
    watchers: 312,
    highestBidder: "d***a",
  },
  {
    id: 12,
    name: "Vintage Cartier Watch",
    currentBid: 8900,
    endTime: "6h 20m",
    image: "/cartier.jpg",
    category: "Jewelry",
    bids: 23,
    watchers: 267,
    highestBidder: "w***m",
  },

  // Sports Category
  {
    id: 13,
    name: "Signed NBA Jersey",
    currentBid: 1800,
    endTime: "4h 25m",
    image: "/jersey.jpg",
    category: "Sports",
    bids: 21,
    watchers: 145,
    highestBidder: "k***n",
  },
  {
    id: 14,
    name: "Rare Baseball Card Collection",
    currentBid: 4800,
    endTime: "6h 15m",
    image: "/cards.jpg",
    category: "Sports",
    bids: 15,
    watchers: 89,
    highestBidder: "s***e",
  },

  // Antiques Category
  {
    id: 15,
    name: "Victorian Era Desk",
    currentBid: 3500,
    endTime: "9h 30m",
    image: "/desk.jpg",
    category: "Antiques",
    bids: 11,
    watchers: 167,
    highestBidder: "v***t",
  },
  {
    id: 16,
    name: "18th Century Mirror",
    currentBid: 2800,
    endTime: "5h 45m",
    image: "/mirror.jpg",
    category: "Antiques",
    bids: 14,
    watchers: 143,
    highestBidder: "h***y",
  },

  // Luxury Category
  {
    id: 17,
    name: "Vintage Rolex Daytona",
    currentBid: 28000,
    endTime: "2h 55m",
    image: "/watch.jpg",
    category: "Luxury",
    bids: 31,
    watchers: 423,
    highestBidder: "p***l",
  },
  {
    id: 18,
    name: "Hermès Birkin Bag",
    currentBid: 22000,
    endTime: "7h 15m",
    image: "/hermes.jpg",
    category: "Luxury",
    bids: 25,
    watchers: 356,
    highestBidder: "b***a",
  },
] as const;

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [visibleItems, setVisibleItems] = useState(10);
  const [auctionItemsState, setAuctionItemsState] = useState(
    auctionItems.map(item => ({
      ...item,
      isLiked: false,
      watchers: item.watchers,
      bids: item.bids,
      currentBid: item.currentBid,
      prevBid: item.currentBid // Add this to track previous bid
    }))
  );
  const [countdowns, setCountdowns] = useState<Record<number, string>>({});

  // Filter items based on selected category
  const filteredItems = auctionItemsState.filter(item => 
    selectedCategory === "All Items" ? true : item.category === selectedCategory
  );

  // Reset visible items when category changes
  useEffect(() => {
    setVisibleItems(10);
  }, [selectedCategory]);

  // Function to load more items
  const loadMore = () => {
    setVisibleItems(prev => prev + 9);
  };

  // Handle likes for auction items
  const toggleAuctionLike = (itemId: number) => {
    setAuctionItemsState(currentItems =>
      currentItems.map(item =>
        item.id === itemId
          ? { ...item, isLiked: !item.isLiked }
          : item
      )
    );
  };

  // Update bids and watchers with proper bid tracking
  useEffect(() => {
    const interval = setInterval(() => {
      setAuctionItemsState(currentItems =>
        currentItems.map(item => {
          const newWatchers = item.watchers + (Math.random() > 0.7 ? 1 : 0);
          const shouldIncreaseBid = Math.random() > 0.92;
          const bidIncrement = Math.floor(item.currentBid * (0.01 + Math.random() * 0.02));
          
          return shouldIncreaseBid ? {
            ...item,
            watchers: newWatchers,
            prevBid: item.currentBid, // Store previous bid
            currentBid: item.currentBid + bidIncrement,
            bids: item.bids + 1,
            highestBidder: ['a***x', 'b***y', 'c***z', 'd***w'][Math.floor(Math.random() * 4)]
          } : {
            ...item,
            watchers: newWatchers,
            prevBid: item.currentBid // Keep tracking previous bid
          };
        })
      );
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Handle countdown updates
  useEffect(() => {
    const updateCountdowns = () => {
      const newCountdowns: Record<number, string> = {};
      filteredItems.forEach(item => {
        newCountdowns[item.id] = useCountdown(item.endTime);
      });
      setCountdowns(newCountdowns);
    };

    const interval = setInterval(updateCountdowns, 1000);
    updateCountdowns(); // Initial update

    return () => clearInterval(interval);
  }, [filteredItems]); // Only re-run when filtered items change

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Trending Items Carousel */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-purple-100">Trending Now</h2>
        </div>
        <TrendingCarousel items={trendingItems} />
      </div>

      {/* Live Auctions Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-purple-100">Live Auctions</h2>
          <Button variant="outline" className="border-purple-700 hover:bg-purple-900/50">
            View All
          </Button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-4 mb-6 overflow-x-auto pb-2">
          <Button 
            variant={selectedCategory === "All Items" ? "default" : "outline"}
            size="sm"
            className={selectedCategory === "All Items" 
              ? "bg-purple-600 hover:bg-purple-700" 
              : "border-purple-700 hover:bg-purple-900/50"
            }
            onClick={() => setSelectedCategory("All Items")}
          >
            All Items
          </Button>
          {["Art", "Collectibles", "Electronics", "Fashion", "Jewelry", "Sports", "Antiques", "Luxury"].map((category) => (
            <Button 
              key={category} 
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              className={selectedCategory === category 
                ? "bg-purple-600 hover:bg-purple-700" 
                : "border-purple-700 hover:bg-purple-900/50"
              }
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Auction Grid - Now with visible items limit */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.slice(0, visibleItems).map((item) => (
            <Card 
              key={item.id} 
              className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-gray-900/50 border-purple-900/20"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-purple-100">{item.name}</h3>
                    <Badge variant="secondary" className="mt-2 bg-purple-900/50">
                      {item.category}
                    </Badge>
                  </div>
                  <Badge variant="destructive" className="flex items-center">
                    <Timer className="w-4 h-4 mr-1" />
                    {countdowns[item.id] || item.endTime}
                  </Badge>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Current Bid</span>
                    <AnimatedPrice 
                      value={item.currentBid}
                      className="text-purple-400" 
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Highest Bidder</span>
                    <span className="text-purple-100">{item.highestBidder}</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-purple-900/20">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {Math.floor(item.watchers)}
                      </span>
                      <AnimatedHeart 
                        isLiked={item.isLiked}
                        onClick={() => toggleAuctionLike(item.id)}
                        count={item.bids}
                        className="text-gray-400"
                      />
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
            </Card>
          ))}
        </div>

        {/* View More Button */}
        {filteredItems.length > visibleItems && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={loadMore}
              variant="outline"
              size="lg"
              className="border-purple-700 hover:bg-purple-900/50"
            >
              View More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}