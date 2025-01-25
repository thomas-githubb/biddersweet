"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Eye, Heart, DollarSign } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Mock data for a single auction item
const auctionItem = {
  id: 1,
  name: "Antique Victorian Desk",
  description:
    "A beautifully crafted antique Victorian desk made in the 1800s. Perfect for collectors or as a centerpiece in your study.",
  currentBid: 2500,
  endTime: "12h 30m",
  images: ["/desk.jpg", "/desk2.jpg", "/desk3.jpg"],
  category: "Furniture",
  bids: 8,
  watchers: 45,
  highestBidder: "j***n",
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

  const handlePlaceBid = (increment) => {
    const newBid = currentBid + increment;
    const newBidEntry = {
      bidder: "You",
      bid: newBid,
      timestamp: new Date().toISOString(),
    };

    setCurrentBid(newBid);
    setBidHistory([newBidEntry, ...bidHistory]);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Item Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Image Section */}
        <div className="flex flex-col">
          <div className="w-full h-96 relative bg-gray-900 rounded-lg overflow-hidden mb-4">
            <Image
              src={selectedImage}
              alt={auctionItem.name}
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="flex space-x-4 overflow-x-auto">
            {auctionItem.images.map((image, index) => (
              <div
                key={index}
                className={`w-24 h-24 rounded-md overflow-hidden cursor-pointer border-2 transition ${
                  selectedImage === image ? "border-purple-500" : "border-transparent"
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  width={96}
                  height={96}
                  objectFit="cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-purple-100 mb-4">
              {auctionItem.name}
            </h1>
            <p className="text-gray-400 mb-6">{auctionItem.description}</p>

            <Badge variant="secondary" className="bg-purple-900/50 mb-4">
              {auctionItem.category}
            </Badge>

            <div className="flex items-center space-x-6 mb-6">
              <Badge variant="destructive" className="flex items-center">
                <Timer className="w-4 h-4 mr-1" />
                {auctionItem.endTime}
              </Badge>
              <div className="text-sm text-gray-400">
                <span className="flex items-center gap-2">
                  <Eye className="w-4 h-4" /> {auctionItem.watchers} Watchers
                </span>
              </div>
            </div>

            <div className="text-lg font-semibold text-purple-400 mb-4">
              Current Bid: ${currentBid.toLocaleString()}
            </div>

            <div className="text-sm text-gray-400">
              Highest Bidder: <span className="text-purple-100">{bidHistory[0]?.bidder}</span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 w-full mb-2"
              onClick={() => handlePlaceBid(1)}
            >
              Place Bid (+$1)
            </Button>
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 w-full"
              onClick={() => handlePlaceBid(5)}
            >
              Place Bid (+$5)
            </Button>
          </div>
        </div>
      </div>

      {/* Bid History */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-purple-100 mb-6">Bid History</h2>
        <Card className="bg-gray-900 border-purple-900/20 p-4">
          {bidHistory.map((bid, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b border-gray-700 py-2"
            >
              <span className="text-gray-400">{bid.bidder}</span>
              <span className="font-semibold text-purple-400">
                ${bid.bid.toLocaleString()}
              </span>
              <span className="text-gray-500 text-xs">
                {new Date(bid.timestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </Card>
      </div>

      {/* Similar Items */}
      <div>
        <h2 className="text-2xl font-bold text-purple-100 mb-6">Similar Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Replace with dynamic data */}
          {[...Array(3)].map((_, idx) => (
            <Card
              key={idx}
              className="p-4 hover:shadow-lg transition bg-gray-900 border-purple-900/20"
            >
              <div className="w-full h-32 bg-gradient-to-br from-purple-500/10 to-gray-500/10 rounded-md mb-4"></div>
              <h3 className="font-semibold text-lg text-purple-100 mb-2">
                Similar Item #{idx + 1}
              </h3>
              <Button
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 w-full"
                asChild
              >
                <a href="/similar-item">View Item</a>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}