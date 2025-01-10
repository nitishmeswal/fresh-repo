import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/app/lib/db';
import User from '@/app/model/User';
import { z } from 'zod'; 

const registrationSchema = z.object({
  name: z.string().min(2, { message: "First name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must include uppercase, lowercase, number, and special character"
    })
});

export async function POST(request: Request) {
  return new Response(JSON.stringify({ message: "Registration temporarily disabled" }), {
    status: 503,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

// Optional: Add rate limiting to prevent brute force attacks
export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed' },
    { status: 405 }
  );
}