import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Wrapper from "@/components/wapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Role-Based Access Control in Next.js",
  description: "A Next.js application demonstrating role-based access control and permissions management using server-side rendering and modern React features.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Wrapper>
          {children}
        </Wrapper>
      </body>
    </html>
  );
}
