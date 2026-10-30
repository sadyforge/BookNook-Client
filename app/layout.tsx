import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "BookNook | Your Digital Library",
  description: "Discover books, borrow your favorites, and grow with BookNook.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#06131d] text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}