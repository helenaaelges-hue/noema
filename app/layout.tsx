import type { Metadata } from "next";
import { Geist, } from "next/font/google";
import "./globals.css";
import {auth} from "@/auth";
import AppHeader from "@/src/components/layout/AppHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Noema",
    template: "%s | Noema",
  },
  description: "Track events, moods, habits, and triggers to discover meaningful personal patterns.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session =
    await auth();

  return (
    <html lang="en">
      <body className={geistSans.className}>
        <AppHeader
          userName={
            session?.user?.name
          }
        />

        {children}
      </body>
    </html>
  );
}
