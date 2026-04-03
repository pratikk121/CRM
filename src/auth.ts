import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET || "fallback_secret_for_crm_beta_app_1234567890",
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;
        
        let user = await prisma.user.findUnique({ 
          where: { email: credentials.email as string } 
        });
        
        // Auto-seed the master admin account on first login attempt to prevent cloud DB lockout
        if (!user && credentials.email === "admin@crm.com" && credentials.password === "admin") {
           const hashedPassword = await bcrypt.hash("admin", 10);
           user = await prisma.user.create({
             data: {
               email: "admin@crm.com",
               password: hashedPassword,
               name: "System Admin",
               role: "ADMIN"
             }
           });
        }
        
        if (!user) return null;
        
        const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password);
        
        if (passwordsMatch) {
          return { id: user.id, name: user.name, email: user.email, role: user.role };
        }
        
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/login") return true
      return !!auth
    },
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  }
})
