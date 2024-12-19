import { NextAuthOptions,SessionStrategy } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import dbConnect from "@/app/lib/db"
import User from "@/app/model/User"
import bcrypt from "bcryptjs"

const requiredEnvVars = [
  'GOOGLE_CLIENT_ID', 
  'GOOGLE_CLIENT_SECRET', 
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'GITHUB_CLIENT_ID',
  'GITHUB_CLIENT_SECRET'
];

requiredEnvVars.forEach(env => {
  if (!process.env[env]) {
    throw new Error(`Missing required environment variable: ${env}`)
  }
});
 

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter your email" },
        password: { label: "Password", type: "password", placeholder: "Enter your password" }
      },
      async authorize(credentials) : Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }
        try {
          await dbConnect()

          const user = await User.findOne({ 
            email: (credentials.email as string).toLowerCase() 
          }).select('+password')

          if (!user) {
            console.log('No user found with this email')
            throw new Error('No user found with this email')
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password as string, 
            user.password
          )

          if (!isPasswordValid) {
            console.log('Incorrect password')
            throw new Error('Invalid password')
          }

            console.log('User authenticated:', user)
          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.name}`.trim()
          }
        } catch (error) {
          console.error('Authentication error:', error)
          throw error
        }
      }
    })
  ],
  
  pages: {
    signIn: '/sign-in',
    signOut: '/',
    error: '/auth/error', 
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl
    },
    async session({ session, token }) {
        if(token){
            // @ts-ignore
            session.user.id = token.id
            if (session.user && token.email) {
                session.user.email = token.email
                session.user.name = token.name
                session.user.image = token.picture; 

            }
        }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image;

      }
      return token
    },
      async signIn({ user, account, profile }) {
        try {
          await dbConnect();
    
          // @ts-ignore
          const image = profile?.picture || user?.image || null;
    
          // Check if the user already exists in the database
          let existingUser = await User.findOne({ email: user.email });
    
          if (existingUser) {
            // Update existing user details, including the provider image if it's new
            if (!existingUser.provider || !existingUser.providerId) {
              existingUser.provider = account?.provider;
              existingUser.providerId = account?.providerAccountId || account?.id;
            }
    
            // Update image only if it's not already set or has changed
            if (!existingUser.image && image) {
              existingUser.image = image;
            }
    
            await existingUser.save();
          } else {
            // Create a new user with the provider information
            await User.create({
              id: user.id || account?.id,
              name: user.name,
              email: user.email,
              isVerified: true,
              image: image, // Save the image to the database
              provider: account?.provider,
              providerId: account?.providerAccountId || account?.id,
              createdAt: new Date(),
              updatedAt: new Date(),
              status: "active",
            });
          }
    
          // Allow sign-in
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      },
  },
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
} 