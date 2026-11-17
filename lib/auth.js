import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Credentials are stored in env variables — no DB needed for single admin
        const validUser     = process.env.ADMIN_USERNAME;
        const validPassword = process.env.ADMIN_PASSWORD;

        if (
          credentials?.username === validUser &&
          credentials?.password === validPassword
        ) {
          return { id: "1", name: "Admin", role: "admin" };
        }
        return null; // Login failed
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // 12 hours — auto logout after 12 hours
  },
  pages: {
    signIn: "/login", // Custom login page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        // Set token expiry — 12 hours from login
        token.exp = Math.floor(Date.now() / 1000) + 12 * 60 * 60;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) session.user.role = token.role;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
