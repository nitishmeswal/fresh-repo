// import { NextResponse } from 'next/server';
// import bcrypt from 'bcrypt';
// import dbConnect from '@/app/lib/db';
// import User from '@/app/model/User';

// export async function POST(req: Request) {
//   try {
//     const { firstname, lastname, email,  password } = await req.json();
    
//     if (!firstname || !lastname || !password || !email) {
//       return NextResponse.json(
//         { error: 'Username, email and password are required' },
//         { status: 400 }
//       );
//     }

//     await dbConnect();

//     const existingEmail = await User.findOne({ email });
//     if(existingEmail) return NextResponse.json(
//       { error: 'Email already exist' },
//       { status: 400 }
//     );
    

//     const hashedPassword = await bcrypt.hash(password, 12);

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const user = await User.create({
//       firstname,
//       lastname,
//       email,
//       password: hashedPassword,
//     });

//     return NextResponse.json(
//       { message: 'User created successfully' },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Registration error:', error);
//     return NextResponse.json(
//       { error: 'Error creating user' },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/app/lib/db';
import User from '@/app/model/User';
import { z } from 'zod'; 

const registrationSchema = z.object({
  firstname: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastname: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must include uppercase, lowercase, number, and special character"
    })
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = registrationSchema.parse(body);

    await dbConnect();

    const existingEmail = await User.findOne({ email: validatedData.email });
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    const user = await User.create({
      firstname: validatedData.firstname,
      lastname: validatedData.lastname,
      email: validatedData.email,
      password: hashedPassword,
      isVerified: false,
      registeredAt: new Date()
    });

    const { password, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: error.errors 
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Error creating user' },
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