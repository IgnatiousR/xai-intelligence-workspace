import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import CursorGlow from "@/components/layout/CursorGlow";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Xai – Intelligence Workspace",
  description:
    "From raw data to structured intelligence, actionable insight, and AI automation. Real-time analytics powered by multi-model AI pipelines.",
  openGraph: {
    title: "Xai – Intelligence Workspace",
    description:
      "From raw data to structured intelligence, actionable insight, and AI automation.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="bg-bg text-fg font-body min-h-full flex flex-col">
        <CursorGlow />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
