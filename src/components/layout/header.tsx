import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import Link from "next/link";
import { ThemeToggle } from "../theme-toggle";
import { LanguageToggle } from "../languge-toggle";
import { NavbarTitle } from "@/types";

export default function Header({ title }: { title: NavbarTitle}) {
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
          />
        </div>
      </nav>
    </div>
  );
}