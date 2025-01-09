import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { prompt, trial, remainingTokens } = body;

    // Validate request body
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check trial token limit
    if (trial && remainingTokens <= 0) {
      return NextResponse.json(
        { error: 'No trial tokens remaining' },
        { status: 403 }
      );
    }

    try {
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
      });

      return NextResponse.json({
        success: true,
        images: response.data,
        remainingTokens: trial ? remainingTokens - 1 : null
      });
    } catch (error: any) {
      // Handle OpenAI API errors
      if (error?.error?.message?.includes('billing')) {
        return NextResponse.json(
          { error: 'API usage limit reached. Please check your billing settings.' },
          { status: 402 }
        );
      }

      throw error;
    }
  } catch (error) {
    console.error('Error generating images:', error);
    return NextResponse.json(
      { error: 'Failed to generate images' },
      { status: 500 }
    );
  }
}
