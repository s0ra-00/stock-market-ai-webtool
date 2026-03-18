import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';
import connectToDatabase from '@/src/lib/mongodb';
import Stock from '@/src/models/Stock';

const yahooFinance = new YahooFinance();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');
    const includeAi = searchParams.get('includeAi') === 'true';

    if (!ticker) return NextResponse.json({ error: "Provide a ticker" }, { status: 400 });

    await connectToDatabase();
    let stockData;
    let aiData = null;

    if (includeAi) {
      try {
        const aiResponse = await fetch(`http://127.0.0.1:5000/analyze?ticker=${ticker}`);
        if (aiResponse.ok) {
          const aiJson = await aiResponse.json();
          aiData = {
            predictedTrend: aiJson.predictedTrend,
            sentimentScore: aiJson.sentimentScore,
            analyzedHeadlines: aiJson.analyzedHeadlines 
          };
        }
      } catch (aiError) {
        console.warn("⚠️ Python AI Engine is offline. Using fallback AI values.");
        aiData = { 
          predictedTrend: "HOLD", 
          sentimentScore: 50,
          analyzedHeadlines: ["No live news data available."] 
        };
      }
    }

    try {
      const quote = await yahooFinance.quote(ticker);
      if (!quote) throw new Error("Yahoo null");

      stockData = {
        stockId: quote.symbol,
        companyName: quote.longName || quote.shortName || ticker,
        exchange: quote.exchange === 'BSE' ? 'BSE' : 'NSE', 
        currentPrice: quote.regularMarketPrice,
        dayHigh: quote.regularMarketDayHigh || quote.regularMarketPrice,
        dayLow: quote.regularMarketDayLow || quote.regularMarketPrice,
        lastUpdated: new Date()
      };
      
    } catch (yahooError) {
      console.warn(`⚠️ Yahoo API blocked. Activating Fallback Data.`);
      const basePrice = Math.floor(Math.random() * 2000) + 100;
      stockData = {
        stockId: ticker,
        companyName: ticker.replace('.NS', ''),
        exchange: 'NSE',
        currentPrice: basePrice,
        dayHigh: basePrice + Math.floor(Math.random() * 50),
        dayLow: basePrice - Math.floor(Math.random() * 50),
        lastUpdated: new Date()
      };
    }

    if (aiData) {
        stockData.aiAnalysis = aiData;
    }

    const savedStock = await Stock.findOneAndUpdate(
      { stockId: ticker },
      { $set: stockData },
      { upsert: true, new: true }
    );

    return NextResponse.json({ status: "Success", data: savedStock }, { status: 200 });

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Fatal backend error" }, { status: 500 });
  }
}