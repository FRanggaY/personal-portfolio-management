'use server';

import { createSkillTranslation, updateSkillTranslation } from "@/data/repository/skill/skill-translation-repository";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "../auth/auth-action";

export const addSkillTranslation = async (formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await createSkillTranslation(accessToken.value, formData);
    if (!data?.detail) {
      revalidatePath("/skill-translation")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No skill-translation found" };
  }
}

export const editSkillTranslation = async (skillId: string, languageId: string, formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await updateSkillTranslation(accessToken.value, skillId, languageId, formData);
    if (!data?.detail) {
      revalidatePath("/skill-translation")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No skill-translation found" };
  }
}
