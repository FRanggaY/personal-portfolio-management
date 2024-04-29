import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import Image from "next/image";
import { EditSkillForm } from "@/components/forms/skill/edit-skill-form";
import { Skill } from "@/types/skill";
import { DeleteSkillAlert } from "@/components/alert/skill/delete-skill-alert";


export function SkillCard({
  row
}: Readonly<{
  row: Skill
}>) {
  return (
    <Card className="border-zinc-600 hover:border-blue-500">
      <CardHeader>
        <div className="flex gap-3 flex-wrap">
          {row.logo_url ?
            < Image
              src={row.logo_url}
              alt={row.name.substring(0, 2)}
            />
            : null}
          <div>
            <CardTitle>{row.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xs">
          <p className="text-zinc-400">{row.updated_at}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between flex-wrap">
        <EditSkillForm 
          row={row}
        />
        <DeleteSkillAlert 
          id={row.id}
        />
      </CardFooter>
    </Card>
  )
}
