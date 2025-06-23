import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { jwtDecode } from "jwt-decode";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

interface DecodedToken {
  exp?: number;
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
  } catch (error) {
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const response = await fetch(
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

        const data = await response.json();
        if (!response.ok || !data.data?.accessToken) return null;

        const decoded = jwtDecode<DecodedToken>(data.data.accessToken);
        if (!decoded.exp) throw new Error("Token has no exp field");

        const user: ExtendedUser = {
          id: "user-id",
          name: "Frontend Developer",
          email: credentials?.username,
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
      trigger,
      isNewUser,
    }: {
      token: JWT;
      user?: User | undefined;
      account?: any;
      profile?: any;
      trigger?: "signIn" | "signUp" | "update";
      isNewUser?: boolean;
    }): Promise<JWT> {
      if (user && "accessToken" in user) {
        const extendedUser = user as ExtendedUser;

        return {
          ...token,
          accessToken: extendedUser.accessToken,
          refreshToken: extendedUser.refreshToken,
          accessTokenExpires: extendedUser.accessTokenExpires,
        };
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      return await refreshAccessToken(token);
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: { signIn: "/" },
  secret: process.env.NEXTAUTH_SECRET || "secil-store-secret",
});

export { handler as GET, handler as POST };
