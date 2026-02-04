import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  // Removemos o PrismaAdapter aqui para evitar conflitos de sessão/cookie no ambiente local
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user || !user.password) return null;

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) return null;

        return { 
          id: user.id, 
          name: user.name, 
          email: user.email 
        };
      }
    })
  ],
  session: { 
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, 
  },
  pages: { 
    signIn: "/login" 
  },
  secret: process.env.NEXTAUTH_SECRET, // Certifique-se que isso existe no seu .env
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };