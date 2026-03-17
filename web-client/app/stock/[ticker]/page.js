"use client";
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Bell, BookmarkPlus, BrainCircuit, Check, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

const getDomain = (ticker) => {
  const map = { 'RELIANCE.NS': 'ril.com', 'TCS.NS': 'tcs.com', 'HDFCBANK.NS': 'hdfcbank.com', 'TATAMOTORS.NS': 'tatamotors.com' };
  return map[ticker] || 'example.com'; 
};

export default function StockPage({ params }) {
  const unwrappedParams = use(params);
  const ticker = decodeURIComponent(unwrappedParams.ticker);

  const { data: session } = useSession(); 

  const [stockData, setStockData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [goalPrice, setGoalPrice] = useState("");
  
  const [isWatching, setIsWatching] = useState(false);
  const [isAlertSet, setIsAlertSet] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [currentRes, historyRes] = await Promise.all([
          fetch(`/api/fetch-stock?ticker=${ticker}`).then(res => res.json()),
          fetch(`/api/stock-history?ticker=${ticker}`).then(res => res.json())
        ]);

        if (currentRes.status === "Success") setStockData(currentRes.data);
        if (historyRes.data) setChartData(historyRes.data);

        if (session?.user?.email) {
          const watchRes = await fetch(`/api/watchlist?email=${session.user.email}`).then(res => res.json());
          if (watchRes.watchlist?.includes(ticker)) {
            setIsWatching(true);
          }
        }
      } catch (error) {
        console.error("Failed to load stock data");
      }
      setLoading(false);
    };
    
    if (session !== undefined) loadData(); 
  }, [ticker, session]);

  const handleWatchlist = async () => {
    if (!session) {
      alert("Please login to add stocks to your watchlist!");
      return;
    }

    setIsWatching(!isWatching);

    try {
      await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email, ticker })
      });
    } catch (error) {
      console.error("Failed to update watchlist DB");
    }
  };

  const handleSetAlert = () => {
    if(!goalPrice) return;
    setIsAlertSet(true); 
  };

  if (loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading market data...</div>;
  if (!stockData) return <div className="min-h-screen bg-gray-900 text-white p-8">Error loading stock.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors mb-6 font-medium">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-gray-700 p-1">
              <img 
                 src={`https://www.google.com/s2/favicons?domain=${getDomain(ticker)}&sz=128`} 
                 alt="logo" 
                 className="w-full h-full object-contain"
                 onError={(e) => { e.target.onerror = null; e.target.src = `https://ui-avatars.com/api/?name=${stockData.companyName}&background=059669&color=fff`; }}
              />
            </div>
            <div>
              <div className="text-gray-400 text-sm font-mono tracking-wider">{stockData.exchange} • {stockData.stockId}</div>
              <h1 className="text-4xl font-bold text-gray-100">{stockData.companyName}</h1>
              <div className="text-3xl font-light mt-2 flex items-baseline gap-3">
                ₹{stockData.currentPrice.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                <span className="text-sm text-emerald-400 font-medium bg-emerald-900/30 px-2 py-1 rounded">
                  Live
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={handleWatchlist} 
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all duration-300 ${
                isWatching 
                  ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400' 
                  : 'border-gray-600 hover:bg-gray-800 text-white'
              }`}
            >
              {isWatching ? <Check size={18} /> : <BookmarkPlus size={18} />} 
              {isWatching ? 'Watching' : 'Watchlist'}
            </button>

            <div className={`flex items-center gap-2 bg-gray-800 border transition-all duration-300 ${
              isAlertSet ? 'border-emerald-500/50 ring-1 ring-emerald-500/50' : 'border-gray-700'
            } rounded-lg p-1 pr-2`}>
              <input 
                type="number" 
                placeholder="Target Price" 
                value={goalPrice}
                onChange={(e) => {
                  setGoalPrice(e.target.value);
                  setIsAlertSet(false); 
                }}
                className="bg-transparent outline-none px-3 w-32 text-sm text-white"
              />
              <button 
                onClick={handleSetAlert} 
                className={`${
                  isAlertSet ? 'bg-emerald-500 text-gray-900' : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                } p-2 rounded-md transition-colors`}
              >
                {isAlertSet ? <Check size={16} strokeWidth={3} /> : <Bell size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* The Graph */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 mb-8 shadow-2xl h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" stroke="#4b5563" tick={{fill: '#9ca3af', fontSize: 12}} minTickGap={30} />
              <YAxis domain={['auto', 'auto']} stroke="#4b5563" tick={{fill: '#9ca3af', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px' }}
                itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Sentiment Integration Preview */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex items-start gap-4">
          <div className="bg-blue-900/50 p-3 rounded-lg text-blue-400">
            <BrainCircuit size={28} />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">AI Sentiment Engine</h3>
            <p className="text-gray-400 mb-3 text-sm">Our Python ML model is currently analyzing news sentiment and technical indicators for this asset.</p>
            <div className="flex gap-4">
              <span className="bg-gray-700 px-3 py-1 rounded-md text-sm">Current Trend: <span className="font-bold text-yellow-400">{stockData.aiAnalysis?.predictedTrend || "HOLD"}</span></span>
              <span className="bg-gray-700 px-3 py-1 rounded-md text-sm">Sentiment Score: <span className="font-bold text-white">{stockData.aiAnalysis?.sentimentScore || 0}/100</span></span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}