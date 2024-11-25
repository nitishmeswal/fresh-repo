import NextAuth, { SessionStrategy } from "next-auth"
// import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import dbConnect from "@/app/lib/db"
import User from "@/app/model/User"
import bcrypt from "bcrypt"
// import { NextApiRequest, NextApiResponse } from "next"
// import { EmailProvider } from "next-auth/providers/email"
export const handler = NextAuth({
  // Configure one or more authentication providers
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID as string,
    //   clientSecret: process.env.GITHUB_SECRET as string ,
    // }),
    GoogleProvider({
        clientId: process.env.GOOGLE_ID as string,
        clientSecret: process.env.GOOGLE_SECRET as string,
        authorization:{
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
              username: { label: "Username", type: "text" },
              password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
              if (!credentials?.username || !credentials?.password) {
                throw new Error('Please enter username and password');
              }
              
              await dbConnect();
              
              const user = await User.findOne({ username: credentials.username });
              if (!user) {
                throw new Error('No user found');
              }
      
              const isPasswordMatch = await bcrypt.compare(credentials.password, user.password);
              if (!isPasswordMatch) {
                throw new Error('Invalid password');
              }
      
              return {
                id: user._id.toString(),
                name: user.username,
              };
            }
          }),
        ],
        pages: {
          signIn: '/login',
          signOut: '/',
        },
        callbacks: {
          async redirect({ url, baseUrl }) {
            // Ensure baseUrl is the Replit URL
            baseUrl = process.env.NEXTAUTH_URL || baseUrl;
            return url.startsWith(baseUrl) ? url : baseUrl;
          },
        },
        session: {
          strategy: "jwt" as SessionStrategy,
          maxAge: 30 * 24 * 60 * 60, // 30 days
        },
    
    // ...add more providers here
  
})

export { handler as GET, handler as  POST}