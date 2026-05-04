import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/context/i18n";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sweden Travel Planner",
  description: "Plan your journey with Swedish public transport",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-50 min-h-screen`}>
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
