import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Eye, Heart, DollarSign } from "lucide-react";
import Image from "next/image";

// Mock data for a single auction item
const auctionItem = {
  id: 1,
  name: "Antique Victorian Desk",
  description:
    "A beautifully crafted antique Victorian desk made in the 1800s. Perfect for collectors or as a centerpiece in your study.",
  currentBid: 2500,
  endTime: "12h 30m",
  image: "/desk.jpg",
  category: "Furniture",
  bids: 8,
  watchers: 45,
  highestBidder: "j***n",
  bidHistory: [
    { bidder: "j***n", bid: 2500 },
    { bidder: "m***e", bid: 2300 },
    { bidder: "s***k", bid: 2200 },
  ],
};

export default function AuctionItemPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Item Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Image Section */}
        <div className="w-full h-96 relative bg-gray-900 rounded-lg overflow-hidden">
          <Image
            src={auctionItem.image}
            alt={auctionItem.name}
            layout="fill"
            objectFit="cover"
          />
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
              Current Bid: ${auctionItem.currentBid.toLocaleString()}
            </div>

            <div className="text-sm text-gray-400">
              Highest Bidder: <span className="text-purple-100">{auctionItem.highestBidder}</span>
            </div>
          </div>

          <Button
            size="lg"
            className="mt-6 bg-purple-600 hover:bg-purple-700 w-full"
            asChild
          >
            <a href="/placebid">Place a Bid</a>
          </Button>
        </div>
      </div>

      {/* Bid History */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-purple-100 mb-6">Bid History</h2>
        <Card className="bg-gray-900 border-purple-900/20 p-4">
          {auctionItem.bidHistory.map((bid, index) => (
            <div
              key={index}
              className="flex justify-between items-center border-b border-gray-700 py-2"
            >
              <span className="text-gray-400">{bid.bidder}</span>
              <span className="font-semibold text-purple-400">
                ${bid.bid.toLocaleString()}
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