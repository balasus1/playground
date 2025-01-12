import type { Metadata } from "next";
import { Inter } from "next/font/google";
import '../components/assets/styles/global.css';

export const runtime = "edge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Readium 2 Web Toolkit for SHOP application",
  description: "Play with the capabilities of the Readium Web Toolkit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
