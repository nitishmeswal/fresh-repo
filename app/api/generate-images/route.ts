import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  return new Response(JSON.stringify({ message: "Service temporarily unavailable" }), {
    status: 503,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
