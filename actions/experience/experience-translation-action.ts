'use server';

import { createExperienceTranslation, updateExperienceTranslation } from "@/data/repository/experience/experience-translation-repository";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "../auth/auth-action";

export const addExperienceTranslation = async (formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await createExperienceTranslation(accessToken.value, formData);
    if (!data?.detail) {
      revalidatePath("/experience-translation")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No experience-translation found" };
  }
}

export const editExperienceTranslation = async (experienceId: string, languageId: string, formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await updateExperienceTranslation(accessToken.value, experienceId, languageId, formData);
    if (!data?.detail) {
      revalidatePath("/experience-translation")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No experience-translation found" };
  }
}
