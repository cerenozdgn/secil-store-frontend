
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import type { JWT } from "next-auth/jwt";
import type { Session, User, Account, Profile } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";

interface DecodedToken {
  exp: number;
}

interface ExtendedUser extends User {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const res = await fetch(
      "https://maestro-api-dev.secil.biz/Auth/RefreshTokenLogin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: token.refreshToken }),
      }
    );
    const data = await res.json();
    if (!res.ok || !data.data?.accessToken) {
      throw new Error("Refresh token failed");
    }
    return {
      ...token,
      accessToken: data.data.accessToken,
      accessTokenExpires: Date.now() + 5 * 60 * 1000,
      refreshToken: data.data.refreshToken ?? token.refreshToken,
    };
  } catch {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(
          "https://maestro-api-dev.secil.biz/Auth/Login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          }
        );
        const data = await res.json();
        if (!res.ok || !data.data?.accessToken) return null;

        const decoded = jwtDecode<DecodedToken>(data.data.accessToken);
        if (!decoded.exp) throw new Error("Token has no exp field");

        const user: ExtendedUser = {
          id: "user-id",
          name: "Frontend Developer",
          email: credentials!.username!,
          accessToken: data.data.accessToken,
          refreshToken: data.data.refreshToken,
          accessTokenExpires: decoded.exp * 1000,
        };
        return user;
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({
      token,
      user,
      account,
      profile,
      isNewUser,
    }: {
      token: JWT;
      user?: User | AdapterUser;
      account?: Account | null;
      profile?: Profile;
      isNewUser?: boolean;
    }): Promise<JWT> {
      // On sign-in, save access & refresh tokens in JWT
      if (user && "accessToken" in user) {
        const u = user as ExtendedUser;
        return {
          ...token,
          accessToken: u.accessToken,
          refreshToken: u.refreshToken,
          accessTokenExpires: u.accessTokenExpires,
        };
      }
      // If token is still valid, just return it
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }
      // Otherwise, refresh it
      return await refreshAccessToken(token);
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },

  pages: {
    signIn: "/",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
