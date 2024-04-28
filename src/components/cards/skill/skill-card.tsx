import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import {
  ArrowUpRight,
} from "lucide-react";


export function SkillCard({
  title,
  description,
  updatedAt,
  websiteUrl,
  logoUrl,
}: Readonly<{
  title: string,
  description: string,
  updatedAt: string,
  websiteUrl: string,
  logoUrl: string,
}>) {
  return (
    <Card className="border-zinc-600 hover:border-blue-500">
      <CardHeader>
        {
          logoUrl ??  <Avatar>
          <AvatarImage src={logoUrl} alt={title} />
          <AvatarFallback>{title.substring(0, 2)}</AvatarFallback>
        </Avatar>
        }
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-between flex-wrap">
        <div className="text-xs">
          <p className="text-zinc-400">{updatedAt}</p>
        </div>
        <a href={websiteUrl} target="_blank">
          <Button>
            Show
            <ArrowUpRight className="ml-3" />
          </Button>
        </a>
      </CardFooter>
    </Card>
  )
}
