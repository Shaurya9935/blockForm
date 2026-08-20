import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { GlobalProviders } from "~/providers/global";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "BlockForm — Build forms, block by block",
    template: "%s | BlockForm",
  },
  description:
    "Create beautiful interactive forms, share them anywhere, and turn responses into actionable data block by block.",
  applicationName: "BlockForm",
  authors: [{ name: "BlockForm Team" }],
  keywords: [
    "BlockForm",
    "Form Builder",
    "Interactive Forms",
    "No-code Forms",
    "Surveys",
    "React Form Builder",
    "TypeScript Form Engine",
  ],
  creator: "BlockForm",
  publisher: "BlockForm",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "BlockForm — Build forms, block by block",
    description:
      "Create beautiful interactive forms, share them anywhere, and turn responses into actionable data block by block.",
    siteName: "BlockForm",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BlockForm — Build forms, block by block",
    description:
      "Create beautiful interactive forms, share them anywhere, and turn responses into actionable data block by block.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d1117",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
