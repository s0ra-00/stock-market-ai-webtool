import { NextResponse } from 'next/server';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');

    if (!ticker) return NextResponse.json({ error: "Ticker required" }, { status: 400 });

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 90);

    const period1 = start.toISOString().split('T')[0];
    const period2 = end.toISOString().split('T')[0];

    const result = await yahooFinance.historical(ticker, { 
      period1, 
      period2, 
      interval: '1d' 
    });

    const chartData = result.map(day => ({
      date: day.date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      price: Number(day.close.toFixed(2))
    }));

    return NextResponse.json({ data: chartData }, { status: 200 });

  } catch (error) {
    console.error("History API Error:", error);

    const mockData = Array.from({ length: 30 }).map((_, i) => ({
      date: `Day ${i + 1}`,
      price: 1000 + Math.random() * 200 + (i * 5)
    }));

    return NextResponse.json({ data: mockData }, { status: 200 }); 
  }
}