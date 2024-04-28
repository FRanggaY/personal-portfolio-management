"use client";

import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { LanguageToggle } from "../languge-toggle";
import { NavbarTitle } from "@/types";
import { useAuthProfile } from "@/context/AuthProfileContext";
import { AuthProfile } from "@/types/auth";
import { useParams, useRouter } from "next/navigation";
import { getAccessToken } from "@/actions/auth/auth-action";
import { useEffect } from "react";


export default function Header({ title }: { title: NavbarTitle }) {
  const authProfileData: AuthProfile = useAuthProfile();
  const params = useParams<{ locale: string; }>();
  const router = useRouter();

  useEffect(() => {
    const handleRedirect = async () => {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        router.push(`/${params.locale}/auth/login`); // Redirect if logged in
      }
    };

    handleRedirect();
  }, []);

  if (!authProfileData.profile) {
    return <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4"></nav>
    </div>
  }

  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link
            href={"/"}
            target="_blank"
          >
            PPM
          </Link>
        </div>
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageToggle />
          <UserNav
            title={{
              profile: title.profile,
              settings: title.settings,
              logout: title.logout,
            }}
            profile={authProfileData}
          />
        </div>
      </nav>
    </div>
  );
}
