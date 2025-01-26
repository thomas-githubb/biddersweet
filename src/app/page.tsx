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
import { supabase, getAllAuctions } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

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

interface AuctionItem {
  id: string;
  title: string;
  description: string;
  current_bid: number;
  end_time: string;
  image_url: string;
  category: string;
  watchers: number;
  total_bids: number;
  highest_bidder: string;
  isLiked?: boolean;
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [visibleItems, setVisibleItems] = useState(10);
  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch auctions when component mounts
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setIsLoading(true);
        const data = await getAllAuctions();
        // Add isLiked property to each auction
        const auctionsWithLikes = data.map(auction => ({
          ...auction,
          isLiked: false
        }));
        setAuctions(auctionsWithLikes);
      } catch (error) {
        console.error('Error fetching auctions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  // Filter items based on selected category
  const filteredItems = auctions.filter(item => 
    selectedCategory === "All Items" ? true : item.category === selectedCategory
  );

  // Handle likes for auction items
  const toggleAuctionLike = (itemId: string) => {
    setAuctions(currentItems =>
      currentItems.map(item =>
        item.id === itemId
          ? { ...item, isLiked: !item.isLiked }
          : item
      )
    );
  };

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
          {["All Items", "Art", "Collectibles", "Electronics", "Fashion", "Jewelry", "Sports", "Antiques", "Luxury"].map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                selectedCategory === category 
                  ? "bg-purple-600 text-white" 
                  : "bg-gray-800 text-gray-400 hover:bg-purple-900/30 hover:text-purple-100"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Auction Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredItems.slice(0, visibleItems).map((item) => (
            <Link 
              key={item.id}
              href={`/placebid?id=${item.id}&name=${encodeURIComponent(item.title)}&currentBid=${item.current_bid}&image=${encodeURIComponent(item.image_url)}&endTime=${encodeURIComponent(item.end_time)}&category=${encodeURIComponent(item.category)}&watchers=${item.watchers}&bids=${item.total_bids}&highestBidder=${encodeURIComponent(item.highest_bidder)}`}
            >
              <Card className="overflow-hidden bg-gray-900 border-gray-800 hover:border-purple-500/50 transition-colors">
                <div className="relative aspect-square">
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                  />
                  <div className="absolute top-2 right-2 space-x-2">
                    <Badge variant="destructive" className="flex items-center text-xs">
                      <Timer className="w-3 h-3 mr-1" />
                      {useCountdown(item.end_time)}
                    </Badge>
                  </div>
                </div>

                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-base text-purple-100 line-clamp-1">
                        {item.title}
                      </h3>
                      <Badge 
                        variant="secondary" 
                        className="mt-1 text-xs bg-purple-900/50 hover:bg-purple-900/70 border-purple-500/20"
                      >
                        {item.category}
                      </Badge>
                    </div>
                    <AnimatedHeart
                      isLiked={item.isLiked}
                      onClick={(e: React.MouseEvent) => {
                        e.preventDefault();
                        toggleAuctionLike(item.id);
                      }}
                      count={item.total_bids}
                    />
                  </div>

                  <div className="mt-3 space-y-2">
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {item.watchers}
                      </div>
                      <div className="flex items-center">
                        {item.total_bids} bids
                      </div>
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-gray-400">Current Bid</p>
                        <AnimatedPrice
                          value={item.current_bid}
                          className="text-sm font-bold text-purple-100"
                        />
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-400">Highest Bidder</p>
                        <p className="text-sm text-purple-100">{item.highest_bidder}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {filteredItems.length > visibleItems && (
          <div className="flex justify-center mt-8">
            <Button
              onClick={() => setVisibleItems(prev => prev + 8)}
              variant="outline"
              className="border-purple-700 hover:bg-purple-900/50"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}