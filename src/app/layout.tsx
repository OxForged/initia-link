import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "InitiaLink",
  description: "Your on-chain identity. One link for everything.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..800;1,9..40,300..800&family=Bricolage+Grotesque:opsz,wght@12..96,600..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="grain min-h-screen bg-[var(--background)] text-[var(--foreground)]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <Providers>
          <Navbar />
          <main className="mx-auto max-w-4xl px-6 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
