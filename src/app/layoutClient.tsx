"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "../components/Footer";
import ModalProvider from "@/components/ModalProvider";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Hide Navbar and Footer on /admin and all subroutes
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <ModalProvider>
      {!isAdminRoute && <Navbar />}
      <main className={!isAdminRoute ? "pt-16" : undefined}>{children}</main>
      {!isAdminRoute && <Footer />}
    </ModalProvider>
  );
} 