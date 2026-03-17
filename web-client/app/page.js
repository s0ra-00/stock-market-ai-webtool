"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const STOCK_DIRECTORY = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries Limited', domain: 'ril.com' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', domain: 'tcs.com' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank Limited', domain: 'hdfcbank.com' },
  { symbol: 'TATAMOTORS.NS', name: 'Tata Motors', domain: 'tatamotors.com' },
  { symbol: 'INFY.NS', name: 'Infosys Limited', domain: 'infosys.com' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', domain: 'icicibank.com' },
  { symbol: 'SBIN.NS', name: 'State Bank of India', domain: 'sbi.co.in' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', domain: 'airtel.in' },
  { symbol: 'ITC.NS', name: 'ITC Limited', domain: 'itcportal.com' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro', domain: 'larsentoubro.com' },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance', domain: 'bajajfinserv.in' },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank', domain: 'axisbank.com' },
  { symbol: 'ZOMATO.NS', name: 'Zomato Ltd', domain: 'zomato.com' },
  { symbol: 'PAYTM.NS', name: 'Paytm (One97)', domain: 'paytm.com' },
  { symbol: 'WIPRO.NS', name: 'Wipro Limited', domain: 'wipro.com' }
];

const TOP_STOCKS = STOCK_DIRECTORY.slice(0, 12).map(s => s.symbol);

export default function Home() {
  const { data: session, status } = useSession();
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchTopStocks = async () => {
      try {
        const promises = TOP_STOCKS.map(ticker => 
          fetch(`/api/fetch-stock?ticker=${ticker}`).then(res => res.json())
        );
        const results = await Promise.all(promises);
        const validStocks = results.filter(r => r.status === "Success").map(r => r.data);
        setStocks(validStocks);
      } catch (error) {
        console.error("Failed to fetch top stocks");
      }
      setLoading(false);
    };
    fetchTopStocks();
  }, []);

  const searchResults = STOCK_DIRECTORY.filter(stock => 
    searchQuery && (
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ).slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-8">
      
      {/* Navbar with Central Search */}
      <nav className="flex justify-between items-center mb-10 border-b border-gray-800 pb-4 relative z-50">
        <h1 className="text-3xl font-bold text-emerald-500 w-48">StonksAI</h1> 
        
        {/*The Universal Search Bar */}
        <div className="relative flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search stocks by name or ticker (e.g., Zomato, TCS)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/*Search Dropdown Suggestions */}
          {searchResults.length > 0 && (
            <div className="absolute w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
              {searchResults.map(result => (
                <Link href={`/stock/${result.symbol}`} key={result.symbol}>
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors cursor-pointer border-b border-gray-700/50 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden p-0.5">
                      <img 
                         src={`https://www.google.com/s2/favicons?domain=${result.domain}&sz=64`} 
                         alt="logo" 
                         className="w-full h-full object-contain"
                         onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-100">{result.name}</div>
                      <div className="text-xs text-gray-400 font-mono">{result.symbol}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* --->LOGIN/LOGOUT<--- */}
        <div className="space-x-4 w-auto text-right flex items-center justify-end">
          {status === 'authenticated' ? (
            <>
              <span className="text-sm text-gray-400 mr-2 hidden sm:inline-block">
                {session.user.email}
              </span>
              <button 
                onClick={() => signOut()} 
                className="hover:text-red-400 transition-colors font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-emerald-400 transition-colors font-medium">
              Login
            </Link>
          )}
          
          <Link href="/watchlist" className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition-colors ml-4">
            Watchlist
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-gray-100">Top Indian Stocks Today</h2>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <p className="text-gray-400 animate-pulse text-lg">Fetching live market data...</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-3 p-4 text-xs font-semibold text-gray-400 border-b border-gray-700 uppercase tracking-wider bg-gray-800/50">
               <div>Company</div>
               <div className="text-right">Market Price</div>
               <div className="text-right">Day Range (L - H)</div>
            </div>

            <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
               {stocks.map(stock => {
                  const localStockInfo = STOCK_DIRECTORY.find(s => s.symbol === stock.stockId);
                  const domain = localStockInfo ? localStockInfo.domain : 'example.com';
                  
                  return (
                    <Link href={`/stock/${stock.stockId}`} key={stock.stockId}>
                       <div className="grid grid-cols-3 p-4 border-b border-gray-700/50 hover:bg-gray-750 transition-colors items-center cursor-pointer group">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-white flex-shrink-0 overflow-hidden border border-gray-600 flex items-center justify-center p-1">
                               <img 
                                 src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`} 
                                 alt={`${stock.companyName} logo`}
                                 className="w-full h-full object-contain"
                                 onError={(e) => { 
                                   e.target.onerror = null; 
                                   e.target.src = `https://ui-avatars.com/api/?name=${stock.companyName}&background=059669&color=fff&size=64&bold=true`;
                                 }}
                               />
                             </div>
                             <div>
                               <div className="font-bold text-gray-100 group-hover:text-emerald-400 transition-colors truncate w-48">
                                 {stock.companyName}
                               </div>
                               <div className="text-xs text-gray-500 font-mono mt-1">
                                 {stock.stockId.replace('.NS', '')}
                               </div>
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
                  );
               })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}