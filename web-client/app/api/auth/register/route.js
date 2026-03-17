import { NextResponse } from 'next/server';
import connectToDatabase from '@/src/lib/mongodb';
import Customer from '@/src/models/Customer';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { email, password, phoneNumber, panNumber } = await request.json();

    if (!email || !password || !phoneNumber || !panNumber) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await Customer.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Customer.create({
      email,
      passwordHash: hashedPassword,
      phoneNumber,
      panNumber: panNumber.toUpperCase(),
      kycStatus: 'VERIFIED'
    });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Failed to create account. Check PAN/Email uniqueness." }, { status: 500 });
  }
}