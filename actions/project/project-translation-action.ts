'use server';

import { createProjectTranslation, updateProjectTranslation } from "@/data/repository/project/project-translation-repository";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "../auth/auth-action";

export const addProjectTranslation = async (formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await createProjectTranslation(accessToken.value, formData);
    if (!data?.detail) {
      revalidatePath("/project-translation")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No project-translation found" };
  }
}

export const editProjectTranslation = async (projectId: string, languageId: string, formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await updateProjectTranslation(accessToken.value, projectId, languageId, formData);
    if (!data?.detail) {
      revalidatePath("/project-translation")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No project-translation found" };
  }
}
