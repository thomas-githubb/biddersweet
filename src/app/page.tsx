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
    name: "Vintage Rolex Submariner 1960s",
    currentBid: 15000,
    endTime: "2h 45m",
    image: "/watch.jpg",
    bids: 23,
    watchers: 156,
  },
  {
    id: 2,
    name: "First Edition Harry Potter Set",
    currentBid: 8500,
    endTime: "4h 15m",
    image: "/book.jpg",
    bids: 15,
    watchers: 89,
  },
  {
    id: 3,
    name: "1967 Gibson Les Paul Custom",
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
    name: "Charizard 1st Edition PSA 10",
    currentBid: 75000,
    endTime: "6h 10m",
    image: "/pokemon.jpg",
    bids: 45,
    watchers: 312,
  },
  {
    id: 6,
    name: "Hermès Birkin 35 Crocodile",
    currentBid: 48000,
    endTime: "3h 55m",
    image: "/bag.jpg",
    bids: 19,
    watchers: 245,
  },
  {
    id: 7,
    name: "1955 Porsche 356 Speedster",
    currentBid: 245000,
    endTime: "2d 12h",
    image: "/car.jpg",
    bids: 28,
    watchers: 567,
  },
  {
    id: 8,
    name: "Ancient Roman Gold Coin Set",
    currentBid: 12500,
    endTime: "3d 8h",
    image: "/coins.jpg",
    bids: 27,
    watchers: 134,
  },
  {
    id: 9,
    name: "Original Star Wars Poster 1977",
    currentBid: 4800,
    endTime: "5h 45m",
    image: "/poster.jpg",
    bids: 16,
    watchers: 98,
  },
  {
    id: 10,
    name: "Signed Jordan Game-Worn Jersey",
    currentBid: 89500,
    endTime: "7h 20m",
    image: "/jersey.jpg",
    bids: 34,
    watchers: 289,
  },
  {
    id: 11,
    name: "Apple-1 Computer Original 1976",
    currentBid: 350000,
    endTime: "4d 5h",
    image: "/computer.jpg",
    bids: 15,
    watchers: 423,
  },
  {
    id: 12,
    name: "Banksy Original Street Art",
    currentBid: 155000,
    endTime: "1d 15h",
    image: "/streetart.jpg",
    bids: 42,
    watchers: 678,
  },
  {
    id: 13,
    name: "Patek Philippe Grand Complication",
    currentBid: 275000,
    endTime: "2d 8h",
    image: "/luxury-watch.jpg",
    bids: 23,
    watchers: 445,
  },
  {
    id: 14,
    name: "T-Rex Fossil Complete Skull",
    currentBid: 485000,
    endTime: "5d 12h",
    image: "/fossil.jpg",
    bids: 8,
    watchers: 892,
  },
  {
    id: 15,
    name: "Tesla Roadster Founder's Edition",
    currentBid: 185000,
    endTime: "3d 6h",
    image: "/tesla.jpg",
    bids: 37,
    watchers: 563,
  },
  {
    id: 16,
    name: "Stradivarius Violin 1714",
    currentBid: 1250000,
    endTime: "6d 18h",
    image: "/violin.jpg",
    bids: 12,
    watchers: 789,
  },
  {
    id: 17,
    name: "Original Declaration Draft",
    currentBid: 895000,
    endTime: "4d 9h",
    image: "/document.jpg",
    bids: 19,
    watchers: 934,
  },
  {
    id: 18,
    name: "Moon Landing Photo Collection",
    currentBid: 28500,
    endTime: "2d 4h",
    image: "/space.jpg",
    bids: 45,
    watchers: 367,
  },
  {
    id: 19,
    name: "First Bitcoin Paper Wallet",
    currentBid: 165000,
    endTime: "3d 12h",
    image: "/bitcoin.jpg",
    bids: 67,
    watchers: 1023,
  },
  {
    id: 20,
    name: "Van Gogh Original Sketch",
    currentBid: 435000,
    endTime: "5d 6h",
    image: "/sketch.jpg",
    bids: 28,
    watchers: 756,
  }
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

// Add these mock live auction items
const mockLiveAuctions: AuctionItem[] = [
  {
    id: "1",
    title: "Rare Vintage Leica M3 Camera",
    description: "1954 Original Leica M3 in excellent condition",
    current_bid: 4500,
    end_time: new Date(Date.now() + 86400000).toISOString(), // 24h from now
    image_url: "/camera.jpg",
    category: "Collectibles",
    watchers: 234,
    total_bids: 15,
    highest_bidder: "vintage_collector",
    isLiked: false
  },
  {
    id: "2",
    title: "First Edition Dune Novel",
    description: "1965 First Edition of Frank Herbert's Dune",
    current_bid: 8900,
    end_time: new Date(Date.now() + 43200000).toISOString(), // 12h from now
    image_url: "/book-dune.jpg",
    category: "Books",
    watchers: 189,
    total_bids: 23,
    highest_bidder: "rare_books",
    isLiked: false
  },
  {
    id: "3",
    title: "1968 Fender Stratocaster",
    description: "Original 1968 Fender Stratocaster in Sunburst",
    current_bid: 15600,
    end_time: new Date(Date.now() + 172800000).toISOString(), // 48h from now
    image_url: "/guitar-strat.jpg",
    category: "Musical Instruments",
    watchers: 456,
    total_bids: 34,
    highest_bidder: "guitar_hero",
    isLiked: false
  },
  {
    id: "4",
    title: "Ancient Egyptian Scarab",
    description: "Authentic Ancient Egyptian Scarab Amulet",
    current_bid: 12300,
    end_time: new Date(Date.now() + 129600000).toISOString(), // 36h from now
    image_url: "/scarab.jpg",
    category: "Antiques",
    watchers: 567,
    total_bids: 28,
    highest_bidder: "history_buff",
    isLiked: false
  },
  {
    id: "5",
    title: "1985 Nike Air Jordan 1",
    description: "Original 1985 Nike Air Jordan 1 Chicago",
    current_bid: 25000,
    end_time: new Date(Date.now() + 64800000).toISOString(), // 18h from now
    image_url: "/sneakers.jpg",
    category: "Fashion",
    watchers: 789,
    total_bids: 45,
    highest_bidder: "sneakerhead",
    isLiked: false
  },
  {
    id: "6",
    title: "Meteorite Fragment",
    description: "Authenticated Fragment from the Chelyabinsk Meteorite",
    current_bid: 3400,
    end_time: new Date(Date.now() + 108000000).toISOString(), // 30h from now
    image_url: "/meteorite.jpg",
    category: "Science",
    watchers: 234,
    total_bids: 12,
    highest_bidder: "space_enthusiast",
    isLiked: false
  },
  {
    id: "7",
    title: "Ming Dynasty Vase",
    description: "15th Century Ming Dynasty Blue and White Porcelain",
    current_bid: 45000,
    end_time: new Date(Date.now() + 216000000).toISOString(), // 60h from now
    image_url: "/vase.jpg",
    category: "Antiques",
    watchers: 678,
    total_bids: 19,
    highest_bidder: "art_collector",
    isLiked: false
  },
  {
    id: "8",
    title: "1942 Wonder Woman Comic",
    description: "First Appearance Wonder Woman Comic in Good Condition",
    current_bid: 89000,
    end_time: new Date(Date.now() + 151200000).toISOString(), // 42h from now
    image_url: "/comic.jpg",
    category: "Comics",
    watchers: 890,
    total_bids: 56,
    highest_bidder: "comic_fan",
    isLiked: false
  }
];

// Create a new AuctionCard component
const AuctionCard = ({ item, onLikeToggle }: { 
  item: AuctionItem; 
  onLikeToggle: (id: string) => void;
}) => {
  const timeLeft = useCountdown(item.end_time);

  return (
    <Link 
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
              {timeLeft}
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
              isLiked={item.isLiked || false}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                onLikeToggle(item.id);
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
  );
};

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
        // Combine real data with mock data
        const data = await getAllAuctions();
        const combinedAuctions = [...mockLiveAuctions, ...data].map(auction => ({
          ...auction,
          isLiked: false
        }));
        setAuctions(combinedAuctions);
      } catch (error) {
        console.error('Error fetching auctions:', error);
        // Fallback to mock data if fetch fails
        setAuctions(mockLiveAuctions);
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
            <AuctionCard 
              key={item.id} 
              item={item} 
              onLikeToggle={toggleAuctionLike}
            />
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