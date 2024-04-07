import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { space_grotesk } from "./ui/fonts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sol Minter",
  description: "Deploy fungible tokens on solana",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta
        name="description"
        content="Mint spl tokens on solana network."
      />
      <meta
        name="keywords"
        content="spl tokens, deploy token, solana, fungible, minting, metadata, sol-minter, mint tokens, launch crypto, launch token, create new token"
      />
      <meta name="google-site-verification" content="cOJTS8RdT1ZVM5rasm16Y9CQL2UZCsSFMMyGTDPkGy4" />
      <link
        rel="icon"
        type="image/png"
        href="https://solana.com/favicon-32x32.png"
      />
      <body className={`${space_grotesk.className} bg-black`}>{children}</body>
    </html>
  );
}
