'use server';

import { createProjectSkill, updateProjectSkill } from "@/data/repository/project/project-skill-repository";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "../auth/auth-action";

export const addProjectSkill = async (formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await createProjectSkill(accessToken.value, formData);
    if (!data?.detail) {
      revalidatePath("/project-skill")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No project-skill found" };
  }
}

export const editProjectSkill = async (projectId: string, skillId: string, formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await updateProjectSkill(accessToken.value, projectId, skillId, formData);
    if (!data?.detail) {
      revalidatePath("/project-skill")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No project-skill found" };
  }
}
