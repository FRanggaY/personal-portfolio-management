"use client";
import { removeAccessToken } from "@/actions/auth/auth-action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast"
import { NavbarTitle } from "@/types";
import { AuthProfile } from "@/types/auth";
import { useParams, useRouter } from "next/navigation";

export function UserNav({ title, profile }: { title: NavbarTitle, profile: AuthProfile }) {
  const params = useParams<{ locale: string; }>();
  const router = useRouter();

  const signOut = async () => {
    await removeAccessToken();
    router.push(`/${params.locale}/auth/login`);
    toast({
      title: "Success:",
      description: 'logout successfully',
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={profile.profile.image_url ?? ""}
              alt={profile.profile.name ?? ""}
            />
            <AvatarFallback>{profile.profile.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile.profile.name ?? ""}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile.profile.username ?? ""}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            {title.profile}
          </DropdownMenuItem>
          <DropdownMenuItem>
            {title.settings}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          {title.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
