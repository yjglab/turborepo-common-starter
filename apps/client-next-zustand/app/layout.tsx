import StoreHydrate from "@/contexts/store.hydrate";
import "@repo/ui/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Turborepo Starter - Client: (NextJS/Zustand)",
  description: "Generated by Jaekyeong Yuk",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreHydrate />
        {children}
      </body>
    </html>
  );
}
