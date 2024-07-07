import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "暗棋 Banqi Chess",
  description: "A 暗棋 Game developed by Mina",
  icons: {
    icon: "/static/favicon.png",
  },
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
