import type { Metadata } from "next";
import {
  Geist, Geist_Mono, Nunito, Geom, Courgette
} from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const geom = Geom({
  variable: "--font-geom",
  subsets: ["latin"],
});

const courgette = Courgette({
  variable: "--font-courgette",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RepoLens",
  description: "RepoLens - lens the repo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} ${geom.variable} ${courgette.variable} antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
