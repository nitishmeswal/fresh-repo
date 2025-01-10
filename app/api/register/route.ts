import { NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { Database } from '@/types/supabase';

const registrationSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  confirmPassword: z.string()
}).refine((data) => {
  return data.password === data.confirmPassword;
}, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Registration body:', body);
    const validatedData = registrationSchema.parse(body);

    const supabase = createServerComponentClient<Database>({ cookies });

    const { data: existingUser, error: searchError } = await supabase
      .from('users')
      .select('email')
      .eq('email', validatedData.email)
      .single();

    if (searchError && searchError.code !== 'PGRST116') {
      return NextResponse.json(
        { error: 'Error checking existing user' },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    const { data: newUser, error: signUpError } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
      options: {
        data: {
          name: validatedData.name,
        }
      }
    });

    if (signUpError) {
      return NextResponse.json(
        { error: signUpError.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: newUser.user?.id,
        email: newUser.user?.email,
        name: validatedData.name
      }
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add rate limiting to prevent brute force attacks
export async function GET() {
  return NextResponse.json(
    { error: 'Method Not Allowed' },
    { status: 405 }
  );
}