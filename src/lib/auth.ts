import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { connectMongoose } from "./db";
import UserModel from "./models/User";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // Removed MongoDBAdapter to prevent duplicate key race conditions with Mongoose

  session: { strategy: "jwt" },

  callbacks: {
    ...authConfig.callbacks,

    async signIn({ user, account }) {
      if (account?.provider !== "google") return false;

      try {
        await connectMongoose();

        const existing = await UserModel.findOne({ email: user.email });
        if (!existing) {
          await UserModel.create({
            googleId: account.providerAccountId,
            email: user.email!,
            name: user.name ?? "",
            avatar: user.image ?? undefined,
          });
        }
        return true;
      } catch (error) {
        console.error("Sign-in Mongoose Error:", error);
        return false;
      }
    },

    async jwt({ token, user, account }) {
      // Run on initial sign in
      if (account && user?.email) {
        await connectMongoose();
        const dbUser = await UserModel.findOne({ email: user.email });
        if (dbUser) {
          token.sub = dbUser._id.toString();
          token.googleId = account.providerAccountId;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
