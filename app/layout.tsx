import type { Metadata } from "next";
import { Poppins, IBM_Plex_Sans_Thai, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  weight: ["400", "500", "600", "700"],
  subsets: ["thai"],
  variable: "--font-ibm",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Patient Form System",
  description: "Real-time patient registration and staff monitoring system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        poppins.variable,
        ibmPlexSansThai.variable,
        "font-sans",
        geist.variable,
      )}
    >
      <body>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
