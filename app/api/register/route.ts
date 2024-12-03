import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import dbConnect from '@/app/lib/db';
import User from '@/app/model/User';

export async function POST(req: Request) {
  try {
    const { username, email,  password } = await req.json();
    
    if (!username || !password || !email) {
      return NextResponse.json(
        { error: 'Username, email and password are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });
    if(existingEmail) return NextResponse.json(
      { error: 'Email already exist' },
      { status: 400 }
    );
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already used' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Error creating user' },
      { status: 500 }
    );
  }
}