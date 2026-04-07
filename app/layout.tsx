import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lokesh & BhavyaSri | Wedding Invitation — April 26, 2026",
  description:
    "You are cordially invited to the wedding celebration of Lokesh & BhavyaSri. Join us on April 26, 2026 as we begin our forever.",
  keywords: ["wedding", "Lokesh", "BhavyaSri", "invitation", "April 2026"],
  openGraph: {
    title: "Lokesh & BhavyaSri — Wedding Invitation",
    description: "Join us as we begin our forever. April 26, 2026.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#8B1A1A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
