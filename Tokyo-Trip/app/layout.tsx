
import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Tokyo Itinerary & Accommodation Planner",
  description: "Plan your Tokyo stay with smart district picks, hotels & restaurants."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Tokyo Itinerary & Accommodation Planner</h1>
            <p className="text-gray-600 mt-1">Find your perfect split stay with live hotels & eats.</p>
          </header>
          {children}
          <footer className="mt-16 text-sm text-gray-500">
            Built with Next.js • Data from Amadeus & Google Places
          </footer>
        </div>
      </body>
    </html>
  );
}
