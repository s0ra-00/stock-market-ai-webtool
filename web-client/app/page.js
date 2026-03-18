"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Globe } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const STOCK_DIRECTORY = [
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', domain: 'hdfcbank.com' },
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', domain: 'ril.com' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', domain: 'icicibank.com' },
  { symbol: 'INFY.NS', name: 'Infosys', domain: 'infosys.com' },
  { symbol: 'ITC.NS', name: 'ITC Limited', domain: 'itcportal.com' },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', domain: 'tcs.com' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro', domain: 'larsentoubro.com' },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank', domain: 'axisbank.com' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', domain: 'kotak.com' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', domain: 'airtel.in' },
  { symbol: 'SBIN.NS', name: 'State Bank of India', domain: 'sbi.co.in' },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance', domain: 'bajajfinserv.in' },
  { symbol: 'BAJAJFINSV.NS', name: 'Bajaj Finserv', domain: 'bajajfinserv.in' },
  { symbol: 'INDUSINDBK.NS', name: 'IndusInd Bank', domain: 'indusind.com' },
  { symbol: 'SBILIFE.NS', name: 'SBI Life Insurance', domain: 'sbilife.co.in' },
  { symbol: 'HDFCLIFE.NS', name: 'HDFC Life', domain: 'hdfclife.com' },
  { symbol: 'JIOFIN.NS', name: 'Jio Financial Services', domain: 'jfs.in' },
  { symbol: 'HCLTECH.NS', name: 'HCL Technologies', domain: 'hcltech.com' },
  { symbol: 'WIPRO.NS', name: 'Wipro Limited', domain: 'wipro.com' },
  { symbol: 'TECHM.NS', name: 'Tech Mahindra', domain: 'techmahindra.com' },
  { symbol: 'LTIM.NS', name: 'LTIMindtree', domain: 'ltimindtree.com' },
  { symbol: 'TATAMOTORS.NS', name: 'Tata Motors', domain: 'tatamotors.com' },
  { symbol: 'M&M.NS', name: 'Mahindra & Mahindra', domain: 'mahindra.com' },
  { symbol: 'MARUTI.NS', name: 'Maruti Suzuki', domain: 'marutisuzuki.com' },
  { symbol: 'BAJAJ-AUTO.NS', name: 'Bajaj Auto', domain: 'bajajauto.com' },
  { symbol: 'EICHERMOT.NS', name: 'Eicher Motors', domain: 'eichermotors.com' },
  { symbol: 'HEROMOTOCO.NS', name: 'Hero MotoCorp', domain: 'heromotocorp.com' },
  { symbol: 'TVSMOTOR.NS', name: 'TVS Motor Company', domain: 'tvsmotor.com' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever', domain: 'hul.co.in' },
  { symbol: 'ASIANPAINT.NS', name: 'Asian Paints', domain: 'asianpaints.com' },
  { symbol: 'NESTLEIND.NS', name: 'Nestle India', domain: 'nestle.in' },
  { symbol: 'TITAN.NS', name: 'Titan Company', domain: 'titancompany.in' },
  { symbol: 'BRITANNIA.NS', name: 'Britannia Industries', domain: 'britannia.co.in' },
  { symbol: 'TATACONSUM.NS', name: 'Tata Consumer Products', domain: 'tataconsumer.com' },
  { symbol: 'VBL.NS', name: 'Varun Beverages', domain: 'varunpepsi.com' },
  { symbol: 'NTPC.NS', name: 'NTPC Limited', domain: 'ntpc.co.in' },
  { symbol: 'ONGC.NS', name: 'Oil & Natural Gas Corp', domain: 'ongcindia.com' },
  { symbol: 'POWERGRID.NS', name: 'Power Grid Corp', domain: 'powergrid.in' },
  { symbol: 'COALINDIA.NS', name: 'Coal India', domain: 'coalindia.in' },
  { symbol: 'TATAPOWER.NS', name: 'Tata Power', domain: 'tatapower.com' },
  { symbol: 'ADANIENT.NS', name: 'Adani Enterprises', domain: 'adanienterprises.com' },
  { symbol: 'TATASTEEL.NS', name: 'Tata Steel', domain: 'tatasteel.com' },
  { symbol: 'HINDALCO.NS', name: 'Hindalco Industries', domain: 'hindalco.com' },
  { symbol: 'JSWSTEEL.NS', name: 'JSW Steel', domain: 'jsw.in' },
  { symbol: 'VEDL.NS', name: 'Vedanta Limited', domain: 'vedantalimited.com' },
  { symbol: 'JINDALSTEL.NS', name: 'Jindal Steel & Power', domain: 'jindalsteelpower.com' },
  { symbol: 'SUNPHARMA.NS', name: 'Sun Pharmaceutical', domain: 'sunpharma.com' },
  { symbol: 'DRREDDY.NS', name: 'Dr. Reddy\'s Labs', domain: 'drreddys.com' },
  { symbol: 'CIPLA.NS', name: 'Cipla Limited', domain: 'cipla.com' },
  { symbol: 'DIVISLAB.NS', name: 'Divi\'s Laboratories', domain: 'divislabs.com' },
  { symbol: 'APOLLOHOSP.NS', name: 'Apollo Hospitals', domain: 'apollohospitals.com' },
  { symbol: 'ULTRACEMCO.NS', name: 'UltraTech Cement', domain: 'ultratechcement.com' },
  { symbol: 'GRASIM.NS', name: 'Grasim Industries', domain: 'grasim.com' },
  { symbol: 'ADANIPORTS.NS', name: 'Adani Ports', domain: 'adaniports.com' },
  { symbol: 'DLF.NS', name: 'DLF Limited', domain: 'dlf.in' },
  { symbol: 'SIEMENS.NS', name: 'Siemens India', domain: 'siemens.co.in' },
  { symbol: 'HAL.NS', name: 'Hindustan Aeronautics', domain: 'hal-india.co.in' },
  { symbol: 'ZOMATO.NS', name: 'Zomato Ltd', domain: 'zomato.com' },
  { symbol: 'PAYTM.NS', name: 'Paytm (One97)', domain: 'paytm.com' },
  { symbol: 'IRCTC.NS', name: 'IRCTC', domain: 'irctc.co.in' }
];

const TOP_STOCKS = STOCK_DIRECTORY.slice(0, 12).map(s => s.symbol);

const MARKET_INDICES = [
  { symbol: '^NSEI', name: 'NIFTY 50' },
  { symbol: '^BSESN', name: 'SENSEX' },
  { symbol: '^NSEBANK', name: 'BANKNIFTY' },
  { symbol: '^CNXIT', name: 'NIFTY IT' }
];

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stocks, setStocks] = useState([]);
  const [indices, setIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const stockPromises = TOP_STOCKS.map(ticker => 
          fetch(`/api/fetch-stock?ticker=${ticker}`).then(res => res.json())
        );
        const indexPromises = MARKET_INDICES.map(idx => 
          fetch(`/api/fetch-stock?ticker=${idx.symbol}`).then(res => res.json())
        );

        const [stockResults, indexResults] = await Promise.all([
          Promise.all(stockPromises), 
          Promise.all(indexPromises)
        ]);

        setStocks(stockResults.filter(r => r.status === "Success").map(r => r.data));
        
        const validIndices = indexResults
          .filter(r => r.status === "Success")
          .map(r => {
            const match = MARKET_INDICES.find(m => m.symbol === r.data.stockId);
            return { ...r.data, displayName: match?.name || r.data.stockId };
          });
        setIndices(validIndices);

      } catch (error) {
        console.error("Failed to fetch market data");
      }
      setLoading(false);
    };
    fetchMarketData();
  }, []);

  const searchResults = STOCK_DIRECTORY.filter(stock => 
    searchQuery && (
      stock.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ).slice(0, 6);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== '') {
      let formatTicker = searchQuery.toUpperCase();
      if (!formatTicker.includes('.') && !formatTicker.startsWith('^')) {
        formatTicker += '.NS';
      }
      router.push(`/stock/${formatTicker}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-8">
      
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-6 relative z-50">
        <h1 className="text-3xl font-bold text-emerald-500 w-48 tracking-tight">StonksAI</h1> 
        
        <div className="relative flex-1 max-w-xl mx-8">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search stocks by name or ticker (e.g. Zomato, Reliance)" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-gray-500 shadow-inner"
            />
          </div>

          {searchResults.length > 0 && (
            <div className="absolute w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-50">
              {searchResults.map(result => (
                <Link href={`/stock/${result.symbol}`} key={result.symbol}>
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-700 transition-colors cursor-pointer border-b border-gray-700/50 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden p-0.5 shrink-0">
                      <img 
                         src={`https://www.google.com/s2/favicons?domain=${result.domain}&sz=64`} 
                         alt="logo" 
                         className="w-full h-full object-contain"
                         onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-semibold text-sm text-gray-100 truncate">{result.name}</div>
                      <div className="text-xs text-gray-400 font-mono">{result.symbol}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-x-4 w-auto text-right flex items-center justify-end">
          {status === 'authenticated' ? (
            <>
              <span className="text-sm text-gray-400 mr-2 hidden sm:inline-block">
                {session.user.email}
              </span>
              <button onClick={() => signOut()} className="hover:text-red-400 transition-colors font-medium text-sm">
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="hover:text-emerald-400 transition-colors font-medium">
              Login
            </Link>
          )}
          
          <Link href="/watchlist" className="bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition-colors ml-4 shadow-lg shadow-emerald-900/20">
            Watchlist
          </Link>
        </div>
      </nav>

      {/* Market Indices Ticker Tape */}
      <div className="flex items-center gap-8 overflow-x-auto whitespace-nowrap border-b border-gray-800 pb-4 mb-8 scrollbar-hide text-sm">
        {loading ? (
           <div className="text-gray-500 animate-pulse flex gap-8">
             <span>NIFTY 50 ---</span>
             <span>SENSEX ---</span>
             <span>BANKNIFTY ---</span>
           </div>
        ) : (
          indices.map(idx => {
            const isPositive = idx.currentPrice > ((idx.dayHigh + idx.dayLow) / 2);
            const colorClass = isPositive ? "text-emerald-400" : "text-red-400";
            
            return (
              <Link href={`/stock/${idx.stockId}`} key={idx.stockId} className="flex items-center gap-2 hover:bg-gray-800 px-3 py-1.5 rounded-md transition-colors cursor-pointer">
                <span className="font-semibold text-gray-300">{idx.displayName}</span>
                <span className="text-gray-100">{idx.currentPrice.toLocaleString('en-IN', {maximumFractionDigits: 2})}</span>
                <span className={`${colorClass} font-medium`}>
                   {isPositive ? "▲" : "▼"}
                </span>
              </Link>
            )
          })
        )}
        <div className="ml-auto text-gray-500 hover:text-gray-300 cursor-pointer transition-colors">
          <Globe size={18} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 text-gray-100">Top Movers on StonksAI</h2>
        
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-3 p-4 text-xs font-semibold text-gray-400 border-b border-gray-700 uppercase tracking-wider bg-gray-800/50">
               <div>Company</div>
               <div className="text-right">Live Price</div>
               <div className="text-right">Day Range</div>
            </div>

            <div className="max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
               {stocks.map(stock => {
                  const localStockInfo = STOCK_DIRECTORY.find(s => s.symbol === stock.stockId);
                  const domain = localStockInfo ? localStockInfo.domain : 'example.com';
                  
                  return (
                    <Link href={`/stock/${stock.stockId}`} key={stock.stockId}>
                       <div className="grid grid-cols-3 p-4 border-b border-gray-700/50 hover:bg-gray-750 transition-colors items-center cursor-pointer group">
                          <div className="flex items-center gap-4 overflow-hidden">
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
                             <div className="min-w-0">
                               <div className="font-bold text-gray-100 group-hover:text-emerald-400 transition-colors truncate">
                                 {stock.companyName}
                               </div>
                               <div className="text-xs text-gray-500 font-mono mt-0.5 truncate">
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
                             <span className="text-gray-500 mx-1.5">-</span> 
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