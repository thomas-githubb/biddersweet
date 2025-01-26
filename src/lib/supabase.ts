import { createClient } from '@supabase/supabase-js'
import { auth } from "@/firebase";

// Add these interfaces for type safety
interface Auction {
  id: string;
  title: string;
  description: string;
  starting_bid: number;
  current_bid: number;
  end_time: string;
  created_at: string;
  image_url: string;
  category: string;
  user_id: string;
  status: 'active' | 'completed' | 'cancelled';
}

interface Bid {
  id?: string;
  auction_id: string;
  user_id: string;
  amount: number;
  created_at?: string;
  bidder_name?: string;
}

// Add console logs to verify environment variables are loaded
const supabaseUrl = 'https://bvrzqzjdhhhscbngnyvu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2cnpxempkaGhoc2NibmdueXZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4NDgwNTUsImV4cCI6MjA1MzQyNDA1NX0.YH9YDQmqT4DlNBcreUOWvYI4bpTeRuWkvs_6O84uV3E'

console.log('Initializing Supabase with:', {
  url: supabaseUrl,
  keyExists: !!supabaseAnonKey
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Add options to handle CORS and retries
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }
});

// Test the connection immediately
console.log('Testing Supabase connection...');
void (async () => {
  try {
    const { data, error } = await supabase.from('bids').select('*').limit(1);
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('Supabase connection test successful:', data);
    }
  } catch (err: unknown) {
    console.error('Supabase connection test threw an error:', err);
  }
})();

// Add this function to get bids for the logged in user
export async function getUserBids() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data: bids, error } = await supabase
    .from('bids')
    .select(`
      *,
      auctions (
        id,
        title,
        description,
        current_bid,
        end_time,
        image_url,
        category
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return bids as Bid[];
}

// Update the createBid function to work with Firebase auth
export async function createBid(auctionId: string, amount: number) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Create the new bid
    const { data: newBid, error: bidError } = await supabase
      .from('bids')
      .insert([
        {
          auction_id: auctionId,
          user_id: user.id,
          amount: amount,
          bidder_name: user.email || 'Anonymous Bidder'
        }
      ])
      .select()
      .single();

    if (bidError) {
      console.error('Error creating bid:', bidError);
      throw bidError;
    }

    console.log("Bid created successfully:", newBid);
    return newBid;
  } catch (error) {
    console.error('Error in createBid:', error);
    throw error;
  }
}

// Add a function to get auction details
export async function getAuction(id: string) {
  const { data, error } = await supabase
    .from('auctions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw error;
  }

  return data as Auction;
}

// Add this function to test the connection
export async function testSupabaseConnection() {
  try {
    // Test auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('Current user:', user);
    if (authError) console.error('Auth error:', authError);

    // Test bids table
    const { data: bids, error: bidsError } = await supabase
      .from('bids')
      .select('*')
      .limit(1);
    console.log('Test bid query:', bids);
    if (bidsError) console.error('Bids error:', bidsError);

    // Test auctions table
    const { data: auctions, error: auctionsError } = await supabase
      .from('auctions')
      .select('*')
      .limit(1);
    console.log('Test auction query:', auctions);
    if (auctionsError) console.error('Auctions error:', auctionsError);

    return { user, bids, auctions };
  } catch (error) {
    console.error('Test connection error:', error);
    throw error;
  }
}

// Add this function to get all bids for an auction
export async function getAllBids(auctionId: string) {
  const { data: bids, error } = await supabase
    .from('bids')
    .select(`
      *,
      auctions (
        id,
        title,
        description,
        current_bid,
        end_time,
        image_url,
        category
      )
    `)
    .eq('auction_id', auctionId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return bids as Bid[];
}

// Add this function to get all auctions
export async function getAllAuctions() {
  const { data, error } = await supabase
    .from('auctions')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as Auction[];
}

// Add this function to seed the database with mock data
export async function seedDatabase() {
  try {
    // First, let's add all the auctions
    const mockAuctions = [
      {
        title: "Vintage Rolex Submariner",
        description: "A classic timepiece in excellent condition",
        starting_bid: 15000,
        current_bid: 15000,
        end_time: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 24 hours from now
        image_url: "/watch.jpg",
        category: "Luxury",
        status: "active"
      },
      {
        title: "First Edition Harry Potter",
        description: "Rare first edition in mint condition",
        starting_bid: 8500,
        current_bid: 8500,
        end_time: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(),
        image_url: "/book.jpg",
        category: "Collectibles",
        status: "active"
      },
      // Add all your mock auctions here...
    ];

    console.log('Starting database seeding...');

    // Insert all auctions
    const { data: auctions, error: auctionError } = await supabase
      .from('auctions')
      .upsert(mockAuctions, { 
        onConflict: 'title',  // Avoid duplicates based on title
        ignoreDuplicates: true
      })
      .select();

    if (auctionError) {
      throw auctionError;
    }

    console.log('Auctions seeded:', auctions);

    // Now let's add some mock bids for each auction
    for (const auction of auctions) {
      const mockBids = [
        {
          auction_id: auction.id,
          amount: auction.current_bid,
          created_at: new Date().toISOString()
        },
        {
          auction_id: auction.id,
          amount: auction.current_bid - 100,
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 minutes ago
        }
      ];

      const { data: bids, error: bidsError } = await supabase
        .from('bids')
        .upsert(mockBids)
        .select();

      if (bidsError) {
        console.error('Error seeding bids for auction:', auction.title, bidsError);
        continue;
      }

      console.log('Bids seeded for auction:', auction.title, bids);
    }

    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Add a function to get real-time bid updates
export function subscribeToAuctionBids(auctionId: string, callback: (bid: Bid) => void) {
  return supabase
    .channel(`auction-${auctionId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'bids',
        filter: `auction_id=eq.${auctionId}`
      },
      (payload) => {
        callback(payload.new as Bid);
      }
    )
    .subscribe();
}

// Add this new function to handle bid insertion
export async function insertBid(userId: string, itemId: string, bidAmount: number, itemName: string) {
  const { data, error } = await supabase
    .from('bids')
    .insert([
      {
        user_id: userId,
        item_id: itemId,
        bid_amount: bidAmount,
        item_name: itemName
      }
    ])
    .select()

  if (error) {
    throw error
  }

  return data
}

// Fetch all active auctions
export async function getActiveAuctions() {
  const { data, error } = await supabase
    .from('auctions')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching auctions:', error);
    throw error;
  }

  return data;
}

// Fetch auctions by category
export async function getAuctionsByCategory(category: string) {
  const { data, error } = await supabase
    .from('auctions')
    .select('*')
    .eq('status', 'active')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching auctions by category:', error);
    throw error;
  }

  return data;
}

// Create a new auction
export async function createAuction(auctionData: Omit<Auction, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('auctions')
    .insert([auctionData])
    .select()
    .single();

  if (error) {
    console.error('Error creating auction:', error);
    throw error;
  }

  return data;
}

// Update auction current bid
export async function updateAuctionBid(auctionId: number, newBid: number) {
  const { data, error } = await supabase
    .from('auctions')
    .update({ 
      current_bid: newBid,
      total_bids: supabase.rpc('increment_bids')
    })
    .eq('id', auctionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating auction bid:', error);
    throw error;
  }

  return data;
}

// Add this simplified function to create an auction
export async function createNewAuction(auctionData: {
  title: string;
  description: string;
  starting_bid: number;
  duration: string;
  category: string;
  condition: string;
  dimensions: string;
  material: string;
  image_url: string;
}) {
  try {
    // Get Firebase user
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      throw new Error('User not authenticated');
    }

    // Create the auction payload
    const auctionPayload = {
      title: auctionData.title,
      description: auctionData.description,
      starting_bid: auctionData.starting_bid,
      current_bid: auctionData.starting_bid,
      end_time: new Date(Date.now() + parseInt(auctionData.duration) * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      image_url: auctionData.image_url, // Use the provided image URL
      category: auctionData.category || 'Art',
      user_id: firebaseUser.uid,
      highest_bidder: 'Anonymous',
      status: 'active',
      watchers: 0,
      total_bids: 0,
      condition: auctionData.condition,
      seller_name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Anonymous',
      seller_rating: 5.0,
      seller_sales: 0
    };

    // Insert the auction
    const { data, error } = await supabase
      .from('auctions')
      .insert([auctionPayload])
      .select('*')
      .single();

    if (error) {
      console.error('Detailed Supabase error:', error);
      throw new Error(`Database error: ${error.message}`);
    }

    return data;
  } catch (error: any) {
    console.error('Error creating auction:', error);
    throw error;
  }
}

// Add this function to upload images to Supabase storage
export async function uploadImage(file: File): Promise<string> {
  try {
    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `auction-images/${fileName}`;

    console.log('Starting image upload:', { fileName, filePath, fileSize: file.size });

    // Upload the file directly without bucket check
    const { data, error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Upload error:', uploadError.message);
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    if (!urlData.publicUrl) {
      throw new Error('Failed to get public URL for uploaded image');
    }

    console.log('Upload successful, public URL:', urlData.publicUrl);
    return urlData.publicUrl;

  } catch (error: any) {
    console.error('Upload error:', error.message);
    throw new Error(error.message || 'Failed to upload image');
  }
} 