import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DisasterLens",
  description: "AI-powered disaster reporting and emergency response dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
