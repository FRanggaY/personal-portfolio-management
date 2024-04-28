import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { AuthProfileProvider } from '@/context/AuthProfileContext';

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const titleNav = useTranslations('Navbar');
  return (
    <AuthProfileProvider>
      <Header 
        title={{
          profile: titleNav('profile.title'),
          settings: titleNav('settings.title'),
          logout: titleNav('logout.title'),
        }}
      />
      <div className="flex h-screen">
        <Sidebar />
        <main className="w-full pt-16">{children}</main>
      </div>
    </AuthProfileProvider>
  );
}