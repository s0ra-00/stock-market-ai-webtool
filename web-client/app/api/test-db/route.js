import { NextResponse } from 'next/server';
import connectToDatabase from '@/src/lib/mongodb';
import Stock from '@/src/models/Stock';

export async function GET() {
  try {
    await connectToDatabase();

    const dummyStock = await Stock.findOneAndUpdate(
      { stockId: 'AAPL' },
      { 
        stockId: 'AAPL', 
        companyName: 'Apple Inc. (Test)', 
        exchange: 'NSE',
        currentPrice: 150.00,
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ 
      status: "Success!", 
      message: "Database connected and dummy stock created.",
      data: dummyStock 
    }, { status: 200 });

  } catch (error) {
    console.error("Database Test Error:", error);
    return NextResponse.json({ 
      status: "Failed", 
      error: error.message 
    }, { status: 500 });
  }
}