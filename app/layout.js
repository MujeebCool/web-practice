import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/layout/LayoutShell";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

export const metadata = {
  title: {
    default: "Ilm Academy | Structured Islamic Learning Online",
    template: "%s | Ilm Academy",
  },
  description:
    "Structured programmes in Islamic sciences, Arabic, and personal growth — for serious students worldwide.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <body className={`${inter.variable} ${cormorant.variable} font-body`}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
