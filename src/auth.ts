import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

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
        if (credentials?.email === "admin@crm.com" && credentials?.password === "admin") {
          return { id: "1", name: "Admin Manager", email: "admin@crm.com", role: "ADMIN" };
        }
        if (credentials?.email === "sales@crm.com" && credentials?.password === "sales") {
          return { id: "2", name: "Sales Representative", email: "sales@crm.com", role: "SALES" };
        }
        if (credentials?.email === "support@crm.com" && credentials?.password === "support") {
          return { id: "3", name: "Support Agent", email: "support@crm.com", role: "SUPPORT" };
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
