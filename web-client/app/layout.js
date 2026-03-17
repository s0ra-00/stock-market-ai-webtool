import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "./Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StonksAI",
  description: "AI-Powered Stock Trading Dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* wrapping authprovider */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}