// src/app/watchlist/page.js
"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { ArrowLeft, BookmarkMinus } from 'lucide-react';

export default function Watchlist() {
  const { data: session, status } = useSession();
  const [watchlistedStocks, setWatchlistedStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyWatchlist = async () => {
      if (!session?.user?.email) return;

      try {
        const res = await fetch(`/api/watchlist?email=${session.user.email}`);
        const data = await res.json();
        
        const myTickers = data.watchlist || [];

        if (myTickers.length > 0) {
          const promises = myTickers.map(ticker => 
            fetch(`/api/fetch-stock?ticker=${ticker}`).then(res => res.json())
          );
          const results = await Promise.all(promises);
          const validStocks = results.filter(r => r.status === "Success").map(r => r.data);
          setWatchlistedStocks(validStocks);
        }
      } catch (error) {
        console.error("Failed to fetch watchlist");
      }
      setLoading(false);
    };

    if (status === 'authenticated') {
      fetchMyWatchlist();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [session, status]);

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">You must be logged in to view your Watchlist.</h2>
        <Link href="/login" className="bg-emerald-600 px-6 py-2 rounded-lg hover:bg-emerald-500">Log In</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-8">
      <div className="max-w-5xl mx-auto">
        
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors mb-6 font-medium">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-100 mb-2">My Watchlist</h1>
        <p className="text-gray-400 mb-8">Track your favorite assets in real-time.</p>

        {loading ? (
          <p className="text-gray-400 animate-pulse text-lg py-10">Loading your saved stocks...</p>
        ) : watchlistedStocks.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-12 text-center shadow-xl flex flex-col items-center">
            <BookmarkMinus size={48} className="text-gray-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300">Your watchlist is empty</h3>
            <p className="text-gray-500 mt-2 mb-6">Search for stocks on the dashboard to add them here.</p>
            <Link href="/" className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/50 px-6 py-2 rounded-lg hover:bg-emerald-600/30 transition-colors">
              Explore Stocks
            </Link>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-3 p-4 text-xs font-semibold text-gray-400 border-b border-gray-700 uppercase tracking-wider bg-gray-800/50">
               <div>Company</div>
               <div className="text-right">Live Price</div>
               <div className="text-right">Day Range</div>
            </div>

            <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
               {watchlistedStocks.map(stock => (
                  <Link href={`/stock/${stock.stockId}`} key={stock.stockId}>
                     <div className="grid grid-cols-3 p-4 border-b border-gray-700/50 hover:bg-gray-750 transition-colors items-center cursor-pointer group">
                        <div>
                           <div className="font-bold text-gray-100 group-hover:text-emerald-400 transition-colors truncate w-48">
                             {stock.companyName}
                           </div>
                           <div className="text-xs text-gray-500 font-mono mt-1">
                             {stock.stockId.replace('.NS', '')}
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="font-medium text-gray-100 text-lg">
                             ₹{stock.currentPrice.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                           </div>
                        </div>
                        <div className="text-right text-sm">
                           <span className="text-red-400 font-medium">₹{stock.dayLow.toLocaleString('en-IN')}</span> 
                           <span className="text-gray-500 mx-2">-</span> 
                           <span className="text-emerald-400 font-medium">₹{stock.dayHigh.toLocaleString('en-IN')}</span>
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}