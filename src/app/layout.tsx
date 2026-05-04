import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { I18nProvider } from "@/context/i18n";
import { Header } from "@/components/Header";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travel Planner",
  description: "Plan your journey with Swedish public transport",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} min-h-screen flex flex-col bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800`}>
        <I18nProvider>
          <Header />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
