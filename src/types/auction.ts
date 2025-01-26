export interface Bid {
  id: string;
  item_id: number;
  user_id: string;
  amount: number;
  created_at: string;
  bidder_name: string;
}

export interface AuctionItem {
  id: number;
  name: string;
  currentBid: number;
  endTime: string;
  image: string;
  category: string;
  bids: number;
  watchers: number;
  highestBidder: string;
  isLiked?: boolean;
  description?: string;
  details?: Record<string, string>;
  seller?: {
    name: string;
    rating: number;
    sales: number;
    joined: string;
  };
} 