// app/layout.tsx
import "./globals.css";
import NavBar from "./components/NavBar";

export const metadata = {
  title: "ApniSec",
  description: "Report and track security issues with ApniSec.",
  alternates: { canonical: "https://<your-domain>" },
  icons: { icon: "/favicon.ico" },
  openGraph: {
    type: "website",
    url: "https://<your-domain>",
    title: "ApniSec",
    description: "Report and track security issues with ApniSec.",
    images: [{ url: "https://<your-domain>/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "ApniSec",
    description: "Report and track security issues with ApniSec.",
    images: ["https://<your-domain>/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ApniSec",
              url: "https://<your-domain>",
            }),
          }}
        />
        <NavBar />
        <main className="flex-grow">{children}</main>
        <footer className="bg-gray-200 text-center p-4">
          &copy; {new Date().getFullYear()} ApniSec. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
