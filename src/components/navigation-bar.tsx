"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Moon } from "lucide-react"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useParams } from "next/navigation"

const components = [
    {
        id: "1",
        title: "Dashboard",
        url: "dashboard",
    },
    {
        id: "2",
        title: "User",
        url: "user",
    },
]

export function NavigationBar() {
    const params = useParams<{ locale: string }>()
    return (
        <NavigationMenu className="p-5">
            <NavigationMenuList>
                <NavigationMenuItem>
                    PPM
                </NavigationMenuItem>
                {
                    components.map((row) => {
                        return <NavigationMenuItem key={row.id}>
                            <Link href={`/${params.locale}/dashboard`} legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Dashboard
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    })
                }
            </NavigationMenuList>
        </NavigationMenu>
    )
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"