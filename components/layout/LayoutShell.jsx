"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";
import SmoothScroll from "@/components/ui/SmoothScroll";
import CustomCursor from "@/components/ui/CustomCursor";

/**
 * LayoutShell — Conditionally renders Navbar/Footer
 *
 * Auth pages (/login, /register, etc.) and Dashboard pages get
 * their own layouts — no global Navbar or Footer.
 */
export default function LayoutShell({ children }) {
  const pathname = usePathname();

  const isAuth = ["/login", "/register", "/forgot-password", "/reset-password"].some(
    (p) => pathname.startsWith(p)
  );
  const isDashboard = pathname.startsWith("/dashboard");
  const hideChrome = isAuth || isDashboard;

  return (
    <SmoothScroll>
      <CustomCursor />
      {!hideChrome && <Navbar />}
      {hideChrome ? children : <PageTransition>{children}</PageTransition>}
      {!hideChrome && <Footer />}
    </SmoothScroll>
  );
}
