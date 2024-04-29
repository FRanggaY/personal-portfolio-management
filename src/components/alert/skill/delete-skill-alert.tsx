"use client"

import { getAccessToken } from "@/actions/auth/auth-action"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { deleteSkill } from "@/data/repository/skill-repository"

export function DeleteSkillAlert({ id }: Readonly<{ id: string }>) {

  const handleDelete = async () => {
    const accessToken = await getAccessToken();
    if (accessToken) {
      const message = await deleteSkill(accessToken.value, id)
      if (message == 'SUCCESS') {
        toast({
          title: "Success:",
          description: 'delete skill successfully',
        })
        location.reload();
      } else {
        toast({
          title: "Error:",
          variant: 'destructive',
          description: message,
        })
      }
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure to delete this skill?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            skill and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
