"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Eye, Heart, DollarSign, ChevronUp, ChevronDown, Share2, Bell, Info } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedPrice } from "@/components/ui/animated-price";
import { useSearchParams } from 'next/navigation';
import { database } from "@/firebase";
import { ref, onValue, set, get } from "firebase/database";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Import Supabase client
import { RealtimeChannel } from '@supabase/supabase-js';

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

// Near the top of your file, add this type
interface ItemDetails {
  id: string | null;
  name: string | null;
  currentBid: number;
  image: string | null;
  endTime: string | null;
  watchers: number;
  bids: number;
  category: string | null;
  highestBidder: string | null;
}

// Add this interface at the top with your other interfaces
interface BidHistoryItem {
  bidder: string;
  bid: number;
  timestamp: string;
}

// Add this type for real-time updates
interface RealtimeUpdate {
  current_bid: number;
  highest_bidder: string;
  total_bids: number;
}

// Generate a random length lorem ipsum description
function generateDescription(itemName: string | null) {
  // Use the item name as a seed for consistent randomization
  const seed = itemName || 'default';
  const index = seed.length % 4; // Consistent selection based on name
  
  const loremIpsum = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Ut enim ad minim veniam, quis nostrud exercitation.",
    "Duis aute irure dolor in reprehenderit in voluptate.",
    "Excepteur sint occaecat cupidatat non proident."
  ];

  return `${itemName}: ${loremIpsum[index]}`;
}

// Generate random details based on category
function generateItemDetails(category: string | null) {
  const details: { [key: string]: { [key: string]: string } } = {
    Art: {
      medium: ["Oil on Canvas", "Acrylic", "Watercolor", "Mixed Media", "Digital Print"][Math.floor(Math.random() * 5)],
      period: ["Contemporary", "Modern", "Post-Modern", "Classical", "Renaissance"][Math.floor(Math.random() * 5)],
      artist: ["John Smith", "Maria Garcia", "David Chen", "Sarah Johnson", "Alex Kim"][Math.floor(Math.random() * 5)],
      dimensions: `${Math.floor(Math.random() * 100 + 20)}cm x ${Math.floor(Math.random() * 100 + 20)}cm`,
      condition: ["Mint", "Excellent", "Very Good", "Good", "Fair"][Math.floor(Math.random() * 5)]
    },
    Collectibles: {
      era: ["1950s", "1960s", "1970s", "1980s", "1990s"][Math.floor(Math.random() * 5)],
      rarity: ["Ultra Rare", "Rare", "Uncommon", "Limited Edition", "Special Release"][Math.floor(Math.random() * 5)],
      condition: ["Mint in Box", "Sealed", "Like New", "Used", "Vintage Condition"][Math.floor(Math.random() * 5)],
      authenticity: ["Certified Authentic", "With COA", "Verified Original", "Documentation Included"][Math.floor(Math.random() * 4)],
      provenance: ["Private Collection", "Original Owner", "Estate Sale", "Dealer Collection"][Math.floor(Math.random() * 4)]
    },
    Electronics: {
      condition: ["New", "Open Box", "Refurbished", "Used - Like New", "Used - Good"][Math.floor(Math.random() * 5)],
      warranty: ["1 Year", "6 Months", "90 Days", "30 Days", "As-Is"][Math.floor(Math.random() * 5)],
      specifications: ["High-End Model", "Limited Edition", "Professional Grade", "Consumer Model"][Math.floor(Math.random() * 4)],
      included: ["Original Box", "All Accessories", "Basic Package", "Core Unit Only"][Math.floor(Math.random() * 4)]
    },
    Fashion: {
      size: ["S", "M", "L", "XL", "One Size"][Math.floor(Math.random() * 5)],
      condition: ["New with Tags", "Like New", "Gently Used", "Vintage", "Pre-owned"][Math.floor(Math.random() * 5)],
      material: ["Leather", "Cotton", "Silk", "Wool", "Synthetic"][Math.floor(Math.random() * 5)],
      style: ["Classic", "Modern", "Vintage", "Designer", "Limited Edition"][Math.floor(Math.random() * 5)]
    },
    Jewelry: {
      material: ["18K Gold", "14K Gold", "Sterling Silver", "Platinum", "White Gold"][Math.floor(Math.random() * 5)],
      gemstone: ["Diamond", "Ruby", "Sapphire", "Emerald", "Pearl"][Math.floor(Math.random() * 5)],
      certification: ["GIA Certified", "IGI Certified", "AGS Certified", "Uncertified"][Math.floor(Math.random() * 4)],
      condition: ["Brand New", "Like New", "Excellent", "Very Good", "Good"][Math.floor(Math.random() * 5)]
    },
    Antiques: {
      period: ["Victorian", "Art Deco", "Mid-Century", "Georgian", "Colonial"][Math.floor(Math.random() * 5)],
      condition: ["Museum Quality", "Excellent", "Very Good", "Good", "Fair"][Math.floor(Math.random() * 5)],
      provenance: ["Estate Collection", "Private Collection", "Auction House", "Family Heirloom"][Math.floor(Math.random() * 4)],
      restoration: ["Original", "Professionally Restored", "Partial Restoration", "Unrestored"][Math.floor(Math.random() * 4)]
    },
    Luxury: {
      brand: ["Rolex", "Louis Vuitton", "Hermès", "Cartier", "Chanel"][Math.floor(Math.random() * 5)],
      condition: ["New", "Like New", "Excellent", "Very Good", "Good"][Math.floor(Math.random() * 5)],
      authenticity: ["Full Papers", "Box and Papers", "Authentication Card", "Store Receipt"][Math.floor(Math.random() * 4)],
      warranty: ["International Warranty", "Store Warranty", "Limited Warranty", "No Warranty"][Math.floor(Math.random() * 4)]
    }
  };

  // Default category if none matches
  const defaultCategory = {
    condition: ["Excellent", "Very Good", "Good", "Fair"][Math.floor(Math.random() * 4)],
    dimensions: `${Math.floor(Math.random() * 100 + 20)}cm x ${Math.floor(Math.random() * 100 + 20)}cm`,
    material: ["Wood", "Metal", "Plastic", "Mixed"][Math.floor(Math.random() * 4)],
    origin: ["USA", "Europe", "Asia", "Unknown"][Math.floor(Math.random() * 4)]
  };

  return details[category || ""] || defaultCategory;
}

// Generate random seller info
function generateSellerInfo() {
  const names = ["VintageFinds", "LuxuryTrader", "CollectiblesHub", "ArtisanDealer", "PremiumSeller"];
  const ratings = [4.9, 4.8, 4.7, 4.95, 5.0];
  const salesCounts = [156, 234, 89, 445, 178];
  const years = ["2020", "2021", "2022", "2023"];

  return {
    name: names[Math.floor(Math.random() * names.length)],
    rating: ratings[Math.floor(Math.random() * ratings.length)],
    sales: salesCounts[Math.floor(Math.random() * salesCounts.length)],
    joined: years[Math.floor(Math.random() * years.length)],
  };
}

// Generate details once based on category and keep them consistent
function generateConsistentDetails(category: string | null, itemId: string | null) {
  // Use itemId as a seed for consistent randomization
  const seed = Number(itemId) || 0;
  
  const details: { [key: string]: { [key: string]: string[] } } = {
    Art: {
      medium: ["Oil on Canvas", "Acrylic", "Watercolor", "Mixed Media", "Digital Print"],
      period: ["Contemporary", "Modern", "Post-Modern", "Classical", "Renaissance"],
      artist: ["John Smith", "Maria Garcia", "David Chen", "Sarah Johnson", "Alex Kim"],
      dimensions: [`${80 + seed}cm x ${100 + seed}cm`],
      condition: ["Mint", "Excellent", "Very Good", "Good", "Fair"]
    },
    Collectibles: {
      era: ["1950s", "1960s", "1970s", "1980s", "1990s"],
      rarity: ["Ultra Rare", "Rare", "Uncommon", "Limited Edition", "Special Release"],
      condition: ["Mint in Box", "Sealed", "Like New", "Used", "Vintage Condition"],
      authenticity: ["Certified Authentic", "With COA", "Verified Original", "Documentation Included"],
      provenance: ["Private Collection", "Original Owner", "Estate Sale", "Dealer Collection"]
    },
    Electronics: {
      condition: ["New", "Open Box", "Refurbished", "Used - Like New", "Used - Good"],
      warranty: ["1 Year", "6 Months", "90 Days", "30 Days", "As-Is"],
      specifications: ["High-End Model", "Limited Edition", "Professional Grade", "Consumer Model"],
      included: ["Original Box", "All Accessories", "Basic Package", "Core Unit Only"]
    },
    Fashion: {
      size: ["S", "M", "L", "XL", "One Size"],
      condition: ["New with Tags", "Like New", "Gently Used", "Vintage", "Pre-owned"],
      material: ["Leather", "Cotton", "Silk", "Wool", "Synthetic"],
      style: ["Classic", "Modern", "Vintage", "Designer", "Limited Edition"]
    },
    Jewelry: {
      material: ["18K Gold", "14K Gold", "Sterling Silver", "Platinum", "White Gold"],
      gemstone: ["Diamond", "Ruby", "Sapphire", "Emerald", "Pearl"],
      certification: ["GIA Certified", "IGI Certified", "AGS Certified", "Uncertified"],
      condition: ["Brand New", "Like New", "Excellent", "Very Good", "Good"]
    },
    Antiques: {
      period: ["Victorian", "Art Deco", "Mid-Century", "Georgian", "Colonial"],
      condition: ["Museum Quality", "Excellent", "Very Good", "Good", "Fair"],
      provenance: ["Estate Collection", "Private Collection", "Auction House", "Family Heirloom"],
      restoration: ["Original", "Professionally Restored", "Partial Restoration", "Unrestored"]
    },
    Luxury: {
      brand: ["Rolex", "Louis Vuitton", "Hermès", "Cartier", "Chanel"],
      condition: ["New", "Like New", "Excellent", "Very Good", "Good"],
      authenticity: ["Full Papers", "Box and Papers", "Authentication Card", "Store Receipt"],
      warranty: ["International Warranty", "Store Warranty", "Limited Warranty", "No Warranty"]
    }
  };

  const defaultCategory = {
    condition: ["Excellent", "Very Good", "Good", "Fair"],
    dimensions: [`${80 + seed}cm x ${100 + seed}cm`],
    material: ["Wood", "Metal", "Plastic", "Mixed"],
    origin: ["USA", "Europe", "Asia", "Unknown"]
  };

  const categoryDetails = details[category || ""] || defaultCategory;
  
  // Create a consistent selection for each property
  const result: { [key: string]: string } = {};
  for (const [key, values] of Object.entries(categoryDetails)) {
    const index = seed % values.length;
    result[key] = values[index];
  }

  return result;
}

export default function AuctionItemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  
  // Get item details from URL parameters
  const itemDetails = {
    id: searchParams.get('id'),
    name: searchParams.get('name'),
    currentBid: Number(searchParams.get('currentBid')),
    image: searchParams.get('image'),
    endTime: searchParams.get('endTime'),
    watchers: Number(searchParams.get('watchers')),
    bids: Number(searchParams.get('bids')),
    category: searchParams.get('category'),
    highestBidder: searchParams.get('highestBidder'),
    description: generateDescription(searchParams.get('name')),
    details: generateConsistentDetails(searchParams.get('category'), searchParams.get('id')),
    seller: generateSellerInfo()
  };

  const [selectedImage, setSelectedImage] = useState(itemDetails.image);
  const [currentBid, setCurrentBid] = useState(itemDetails.currentBid);
  const [bidHistory, setBidHistory] = useState<BidHistoryItem[]>([]);
  const [isWatching, setIsWatching] = useState(false);
  const [customBidAmount, setCustomBidAmount] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [zoomedImage, setZoomedImage] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingBidAmount, setPendingBidAmount] = useState(0);
  const [supabaseChannel, setSupabaseChannel] = useState<RealtimeChannel | null>(null);

  // Set up real-time connection with better error handling
  useEffect(() => {
    if (!itemDetails.id) {
      console.log("No item ID provided");
      return;
    }

    console.log("Attempting to connect to Firebase...");
    console.log("Database instance:", database); // Check if database is initialized

    try {
      const itemRef = ref(database, `auctions/${itemDetails.id}`);
      console.log("Created reference:", itemRef);
      
      // Initialize auction data if it doesn't exist
      get(itemRef)
        .then((snapshot) => {
          console.log("Got snapshot:", snapshot.val());
          if (!snapshot.exists()) {
            console.log("No existing data, initializing...");
            const initialData = {
              currentBid: itemDetails.currentBid,
              highestBidder: itemDetails.highestBidder || "Anonymous",
              bidHistory: [{
                bidder: itemDetails.highestBidder || "Anonymous",
                bid: itemDetails.currentBid,
                timestamp: new Date().toISOString()
              }]
            };
            
            return set(itemRef, initialData);
          }
        })
        .then(() => {
          console.log("Data initialized successfully");
        })
        .catch((error) => {
          console.error("Firebase initialization error:", error);
        });

      // Listen for changes
      const unsubscribe = onValue(itemRef, (snapshot) => {
        console.log("Received update:", snapshot.val());
        const data = snapshot.val();
        if (data) {
          setCurrentBid(data.currentBid);
          setBidHistory(data.bidHistory || []);
        }
      }, (error) => {
        console.error("Firebase subscription error:", error);
      });

      return () => {
        console.log("Cleaning up Firebase connection");
        unsubscribe();
      };
    } catch (error) {
      console.error("Firebase setup error:", error);
    }
  }, [itemDetails.id, itemDetails.highestBidder]);

  // Check authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Update the useEffect that handles real-time updates
  useEffect(() => {
    if (!itemDetails.id) return;

    console.log('Setting up real-time subscription for auction:', itemDetails.id);

    // Create a channel for this auction
    const channel = supabase.channel(`public:auctions:id=eq.${itemDetails.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'auctions',
          filter: `id=eq.${itemDetails.id}`
        },
        (payload) => {
          console.log('Received auction update:', payload);
          if (payload.new) {
            // Update the current bid and trigger animation
            setCurrentBid(payload.new.current_bid);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids',
          filter: `auction_id=eq.${itemDetails.id}`
        },
        (payload) => {
          console.log('Received new bid:', payload);
          if (payload.new) {
            // Update bid history
            const newBid: BidHistoryItem = {
              bidder: payload.new.bidder_name,
              bid: payload.new.amount,
              timestamp: payload.new.created_at
            };
            setBidHistory(prev => [newBid, ...prev]);
          }
        }
      );

    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log('Subscription status:', status);
      if (status === 'SUBSCRIBED') {
        console.log('Successfully subscribed to real-time changes');
      }
    });

    // Cleanup function
    return () => {
      console.log('Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [itemDetails.id]);

  // Add this useEffect to fetch the current bid when component mounts or user logs in
  useEffect(() => {
    const fetchCurrentAuctionData = async () => {
      if (!itemDetails.id) return;

      try {
        const { data, error } = await supabase
          .from('auctions')
          .select('current_bid, highest_bidder')
          .eq('id', itemDetails.id)
          .single();

        if (error) {
          console.error('Error fetching current bid:', error);
          return;
        }

        if (data) {
          console.log('Fetched current bid:', data.current_bid);
          setCurrentBid(data.current_bid);
          // Update the itemDetails with the latest bid
          itemDetails.currentBid = data.current_bid;
        }
      } catch (error) {
        console.error('Error in fetchCurrentAuctionData:', error);
      }
    };

    fetchCurrentAuctionData();
  }, [itemDetails.id, user]); // Re-run when user changes or itemDetails.id changes

  const handleBidAttempt = (amount: number) => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }
    handleBidConfirmation(amount);
  };

  const handleCustomBid = () => {
    if (!user) {
      router.push('/login');
      return;
    }

    const amount = parseInt(customBidAmount);
    if (!isNaN(amount) && amount > currentBid) {
      handleBidConfirmation(amount);
    } else {
      alert("Please enter a valid amount higher than the current bid");
    }
  };

  const handleBidConfirmation = (amount: number) => {
    setPendingBidAmount(amount);
    setShowConfirmation(true);
  };

  const confirmBid = async () => {
    try {
      const auctionId = itemDetails.id ? parseInt(itemDetails.id) : null;
      
      if (!auctionId) {
        throw new Error(`Invalid auction ID: ${itemDetails.id}`);
      }

      // Fetch the latest bid before proceeding
      const { data: latestData, error: fetchError } = await supabase
        .from('auctions')
        .select('current_bid')
        .eq('id', auctionId)
        .single();

      if (fetchError) throw fetchError;

      const latestBid = latestData?.current_bid || 0;

      if (pendingBidAmount <= latestBid) {
        throw new Error(`Bid must be higher than current bid of $${latestBid}`);
      }

      const bidderName = user ? (user.displayName || user.email || 'Anonymous') : 'Anonymous';
      const userId = user ? user.uid : 'anonymous-user';

      // First update the auction
      const { error: auctionError } = await supabase
        .from('auctions')
        .update({
          current_bid: pendingBidAmount,
          highest_bidder: bidderName
        })
        .eq('id', auctionId);

      if (auctionError) throw auctionError;

      // Then insert the bid
      const { error: bidError } = await supabase
        .from('bids')
        .insert([{
          auction_id: auctionId,
          user_id: userId,
          amount: pendingBidAmount,
          bidder_name: bidderName
        }]);

      if (bidError) throw bidError;

      setShowConfirmation(false);
      setCustomBidAmount("");
      alert("Bid placed successfully!");

    } catch (error: any) {
      console.error('Bid confirmation error:', error);
      alert(error.message || 'Failed to place bid. Please try again.');
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
                src={selectedImage || '/placeholder.jpg'}
                alt={itemDetails.name || 'Auction Item'}
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
                {itemDetails.category}
              </Badge>
              <Badge variant="destructive" className="flex items-center">
                <Timer className="w-4 h-4 mr-1" />
                {itemDetails.endTime}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-purple-100 mb-4">
              {itemDetails.name}
            </h1>
            <p className="text-gray-400 leading-relaxed">
              {itemDetails.description}
            </p>
          </div>

          {/* Current Bid Section with enhanced animations */}
          <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-gray-900/20 border-purple-900/20">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current Bid</span>
                <AnimatedPrice
                  value={currentBid}
                  className="text-2xl font-bold text-purple-100"
                />
              </div>
              
              {!user ? (
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => router.push('/login')}
                >
                  Login to Place Bid
                </Button>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {[100, 250, 500].map((amount) => (
                      <motion.button
                        key={amount}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200"
                        onClick={() => handleBidAttempt(currentBid + amount)}
                      >
                        +${amount}
                      </motion.button>
                    ))}
                  </div>

                  <div className="flex space-x-2">
                    <input
                      type="number"
                      value={customBidAmount}
                      onChange={(e) => setCustomBidAmount(e.target.value)}
                      placeholder="Enter Bid Amount"
                      min={currentBid + 1}
                      className="flex-1 px-3 py-2 bg-gray-800 border border-purple-900 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200"
                      onClick={handleCustomBid}
                    >
                      Bid
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Bid Confirmation Modal */}
          <AnimatePresence>
            {showConfirmation && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                  onClick={() => setShowConfirmation(false)}
                />
                
                {/* Modal - positioned much higher */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4"
                  style={{ 
                    transform: 'translate(-50%, calc(-50% - 40vh))',  // Much higher (from -25vh to -40vh)
                    marginLeft: '-15vw'  // Keeping the same horizontal position
                  }}
                >
                  <Card className="p-6 bg-gray-900/95 border-purple-500/20 backdrop-blur-lg shadow-xl">
                    <h3 className="text-xl font-bold text-purple-100 mb-4">Confirm Your Bid</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Current Bid</span>
                        <span className="text-purple-100">${currentBid.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400">Your Bid</span>
                        <span className="text-green-400 font-bold">${pendingBidAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-purple-900/50">
                        <span className="text-gray-400">Increase Amount</span>
                        <span className="text-green-400 font-bold">
                          +${(pendingBidAmount - currentBid).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex space-x-3 pt-4">
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex-1 bg-gray-800 text-gray-300 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                          onClick={() => setShowConfirmation(false)}
                        >
                          Cancel
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex-1 bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors duration-200"
                          onClick={confirmBid}
                        >
                          Confirm Bid
                        </motion.button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </>
            )}
          </AnimatePresence>

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
                {Object.entries(itemDetails.details).map(([key, value]) => (
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
                      {itemDetails.seller.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-purple-100">{itemDetails.seller.name}</div>
                      <div className="text-sm text-gray-400">Member since {itemDetails.seller.joined}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-purple-100">{itemDetails.seller.rating} ⭐</div>
                    <div className="text-sm text-gray-400">{itemDetails.seller.sales} sales</div>
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