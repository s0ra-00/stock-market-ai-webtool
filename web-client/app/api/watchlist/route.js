import { NextResponse } from 'next/server';
import connectToDatabase from '@/src/lib/mongodb';
import Customer from '@/src/models/Customer';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    await connectToDatabase();
    const user = await Customer.findOne({ email });
    
    return NextResponse.json({ watchlist: user?.watchlist || [] }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { email, ticker } = await request.json();
    
    if (!email || !ticker) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    await connectToDatabase();
    const user = await Customer.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    let currentWatchlist = [...(user.watchlist || [])];
    
    if (currentWatchlist.includes(ticker)) {
      currentWatchlist = currentWatchlist.filter(t => t !== ticker); 
    } else {
      currentWatchlist.push(ticker); 
    }

    user.watchlist = currentWatchlist;
    await user.save();

    return NextResponse.json({ status: "Success", watchlist: currentWatchlist }, { status: 200 });
  } catch (error) {
    console.error("Watchlist Update Error:", error);
    return NextResponse.json({ error: "Failed to update watchlist" }, { status: 500 });
  }
}