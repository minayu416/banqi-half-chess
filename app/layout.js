import Script from "next/script";
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* GA4 Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-77V2R2WZSZ"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-77V2R2WZSZ', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
