"use client"

import * as React from "react"
import { Globe } from "lucide-react"
import { useParams, usePathname, useRouter } from 'next/navigation'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function LanguageToggle() {
  const pathName = usePathname();
  const router = useRouter();
  const params = useParams<{ locale: string }>()

  // Function to toggle language based on locale
  const toggleLanguage = (locale:string) => {
    const replacedUrl = pathName.replace(params.locale, locale)
    router.replace(replacedUrl)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => toggleLanguage("id")}>
          id
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleLanguage("en")}>
          en
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
