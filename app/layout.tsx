// app/layout.tsx
import "./globals.css";
import NavBar from "./components/NavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        <NavBar />
        <main className="flex-grow">{children}</main>
        <footer className="bg-gray-200 text-center p-4">
          &copy; {new Date().getFullYear()} ApniSec. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
