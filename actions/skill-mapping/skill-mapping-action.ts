'use server';

import { createSkillMapping, updateSkillMapping } from "@/data/repository/skill-mapping-repository";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "../auth/auth-action";

export const addSkillMapping = async (formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await createSkillMapping(accessToken.value, formData);
    if (!data?.detail) {
      revalidatePath("/skill-mapping")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No skill-mapping found" };
  }
}

export const editSkillMapping = async (id: string, formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await updateSkillMapping(accessToken.value, id, formData);
    if (!data?.detail) {
      revalidatePath("/skill-mapping")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No skill-mapping found" };
  }
}
