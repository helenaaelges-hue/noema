import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcrypt";

import { prisma } from "@/src/lib/prisma";

export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
    secret: process.env.BETTER_AUTH_SECRET,
    
    session: {
        strategy: "jwt",
    },

    pages: {
        signIn: "/login",
    },

    providers: [
        Credentials({
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                },

                password: {
                    label: "Password",
                    type: "password",
                },
            },

            async authorize(credentials) {
                const email =
                    typeof credentials.email ===
                        "string"
                        ? credentials.email
                            .trim()
                            .toLowerCase()
                        : "";

                const password =
                    typeof credentials.password ===
                        "string"
                        ? credentials.password
                        : "";

                if (!email || !password) {
                    return null;
                }

                const user =
                    await prisma.user.findUnique({
                        where: {
                            email,
                        },
                    });

                if (!user) {
                    return null;
                }

                const passwordMatches =
                    await compare(
                        password,
                        user.passwordHash
                    );

                if (!passwordMatches) {
                    return null;
                }

                return {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.email,
                };
            },
        }),
    ],

    callbacks: {
        jwt({ token, user }) {
            if (user?.id) {
                token.sub = user.id;
            }

            return token;
        },

        session({ session, token }) {
            if (
                session.user &&
                token.sub
            ) {
                session.user.id =
                    token.sub;
            }

            return session;
        },
    },
});