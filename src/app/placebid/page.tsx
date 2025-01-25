"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Eye, Heart, DollarSign, ChevronUp, ChevronDown, Share2, Bell, Info } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Enhanced mock data
const auctionItem = {
  id: 1,
  name: "Antique Victorian Desk",
  description: "A beautifully crafted antique Victorian desk made in the 1800s. Perfect for collectors or as a centerpiece in your study. Features intricate hand-carved details, original brass hardware, and a rich mahogany finish. This piece has been professionally restored while maintaining its authentic character.",
  currentBid: 2500,
  endTime: "12h 30m",
  images: ["/desk.jpg", "/desk2.jpg", "/desk3.jpg", "/desk4.jpg"],
  category: "Furniture",
  bids: 8,
  watchers: 45,
  highestBidder: "j***n",
  seller: {
    name: "VintageFinds",
    rating: 4.9,
    sales: 156,
    joined: "2022",
  },
  details: {
    condition: "Excellent",
    period: "Victorian (1837-1901)",
    material: "Mahogany",
    dimensions: "W: 120cm, D: 60cm, H: 75cm",
    provenance: "Private collection, London",
  },
  bidHistory: [
    { bidder: "j***n", bid: 2500, timestamp: "2025-01-25T12:00:00Z" },
    { bidder: "m***e", bid: 2300, timestamp: "2025-01-25T11:50:00Z" },
    { bidder: "s***k", bid: 2200, timestamp: "2025-01-25T11:40:00Z" },
  ],
};

export default function AuctionItemPage() {
  const [selectedImage, setSelectedImage] = useState(auctionItem.images[0]);
  const [currentBid, setCurrentBid] = useState(auctionItem.currentBid);
  const [bidHistory, setBidHistory] = useState(auctionItem.bidHistory);
  const [isWatching, setIsWatching] = useState(false);
  const [customBidAmount, setCustomBidAmount] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [zoomedImage, setZoomedImage] = useState(false);

  const handlePlaceBid = (increment: number) => {
    const newBid = currentBid + increment;
    const newBidEntry = {
      bidder: "You",
      bid: newBid,
      timestamp: new Date().toISOString(),
    };

    setCurrentBid(newBid);
    setBidHistory([newBidEntry, ...bidHistory]);
  };

  const handleCustomBid = () => {
    const amount = parseInt(customBidAmount);
    if (amount > currentBid) {
      handlePlaceBid(amount - currentBid);
      setCustomBidAmount("");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image Section */}
        <div className="space-y-4">
          <div 
            className="relative w-full aspect-square bg-gray-900 rounded-lg overflow-hidden cursor-zoom-in"
            onClick={() => setZoomedImage(!zoomedImage)}
          >
            <motion.div
              className="relative w-full h-full"
              animate={{ scale: zoomedImage ? 1.5 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={selectedImage}
                alt={auctionItem.name}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300"
              />
            </motion.div>
            <div className="absolute top-4 right-4 space-x-2">
              <Button 
                size="sm" 
                variant="secondary" 
                className="bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsWatching(!isWatching);
                }}
              >
                {isWatching ? <Bell className="w-4 h-4 text-purple-400" /> : <Bell className="w-4 h-4" />}
              </Button>
              <Button 
                size="sm" 
                variant="secondary" 
                className="bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {auctionItem.images.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`relative w-24 h-24 rounded-md overflow-hidden cursor-pointer flex-shrink-0 ${
                  selectedImage === image ? "ring-2 ring-purple-500" : ""
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image}
                  alt={`View ${index + 1}`}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-110"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="bg-purple-900/50">
                {auctionItem.category}
              </Badge>
              <Badge variant="destructive" className="flex items-center">
                <Timer className="w-4 h-4 mr-1" />
                {auctionItem.endTime}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-purple-100 mb-4">
              {auctionItem.name}
            </h1>
            <p className="text-gray-400 leading-relaxed">
              {auctionItem.description}
            </p>
          </div>

          {/* Current Bid Section */}
          <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-gray-900/20 border-purple-900/20">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Bid</span>
                <div className="text-2xl font-bold text-purple-100">
                  ${currentBid.toLocaleString()}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => handlePlaceBid(100)}
                >
                  +$100
                </Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => handlePlaceBid(250)}
                >
                  +$250
                </Button>
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => handlePlaceBid(500)}
                >
                  +$500
                </Button>
              </div>

              <div className="flex space-x-2">
                <input
                  type="number"
                  value={customBidAmount}
                  onChange={(e) => setCustomBidAmount(e.target.value)}
                  placeholder="Enter custom amount"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={handleCustomBid}
                >
                  Bid
                </Button>
              </div>
            </div>
          </Card>

          {/* Tabs */}
          <div className="border-b border-gray-800">
            <div className="flex space-x-6">
              <button
                className={`py-2 px-1 -mb-px ${
                  activeTab === "details"
                    ? "border-b-2 border-purple-500 text-purple-100"
                    : "text-gray-400"
                }`}
                onClick={() => setActiveTab("details")}
              >
                Details
              </button>
              <button
                className={`py-2 px-1 -mb-px ${
                  activeTab === "seller"
                    ? "border-b-2 border-purple-500 text-purple-100"
                    : "text-gray-400"
                }`}
                onClick={() => setActiveTab("seller")}
              >
                Seller Info
              </button>
              <button
                className={`py-2 px-1 -mb-px ${
                  activeTab === "history"
                    ? "border-b-2 border-purple-500 text-purple-100"
                    : "text-gray-400"
                }`}
                onClick={() => setActiveTab("history")}
              >
                Bid History
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "details" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {Object.entries(auctionItem.details).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-400 capitalize">{key}</span>
                    <span className="text-purple-100">{value}</span>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "seller" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-900/50 rounded-full flex items-center justify-center">
                      {auctionItem.seller.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-purple-100">{auctionItem.seller.name}</div>
                      <div className="text-sm text-gray-400">Member since {auctionItem.seller.joined}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-purple-100">{auctionItem.seller.rating} ⭐</div>
                    <div className="text-sm text-gray-400">{auctionItem.seller.sales} sales</div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "history" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-2"
              >
                {bidHistory.map((bid, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 rounded-lg bg-gray-900/50 hover:bg-gray-900/70 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-900/50 rounded-full flex items-center justify-center text-sm">
                        {bid.bidder[0]}
                      </div>
                      <div>
                        <div className="font-medium text-purple-100">{bid.bidder}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(bid.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right font-semibold text-purple-100">
                      ${bid.bid.toLocaleString()}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Similar Items */}
      <div>
        <h2 className="text-2xl font-bold text-purple-100 mb-6">Similar Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, idx) => (
            <Card
              key={idx}
              className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-900/20 to-gray-900/20 border-purple-900/20"
            >
              <div className="relative h-48 bg-gradient-to-br from-purple-500/10 to-gray-500/10">
                <Image
                  src={`/similar${idx + 1}.jpg`}
                  alt={`Similar Item ${idx + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg text-purple-100 mb-2">
                  Similar Victorian Piece #{idx + 1}
                </h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-400">Current Bid</span>
                  <span className="font-bold text-purple-100">
                    ${(2000 + idx * 500).toLocaleString()}
                  </span>
                </div>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  asChild
                >
                  <a href={`/placebid?id=${idx + 1}`}>View Item</a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}