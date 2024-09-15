import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import UserContextProvider from "@/context/userContextProvider";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PixVid.ai",
  description: "An app to play around pictures and videos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        >
        <UserContextProvider>
          <main>
            {children}
          </main>
        </UserContextProvider>
        <Toaster />
      </body>
    </html>
  );
}
