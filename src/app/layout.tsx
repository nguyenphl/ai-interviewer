import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const jakartaSans = Plus_Jakarta_Sans({ variable: "--font-heading", subsets: ["latin"] });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Interviewer",
  description: "Practice technical interviews with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakartaSans.variable} ${jetbrainsMono.variable} h-full`}>
      <body className="flex h-full bg-neutral-950 text-white antialiased" suppressHydrationWarning>
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
