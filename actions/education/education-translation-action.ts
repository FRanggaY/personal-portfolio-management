'use server';

import { createEducationTranslation, updateEducationTranslation } from "@/data/repository/education/education-translation-repository";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "../auth/auth-action";

export const addEducationTranslation = async (formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await createEducationTranslation(accessToken.value, formData);
    if (!data?.detail) {
      revalidatePath("/education-translation")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No education-translation found" };
  }
}

export const editEducationTranslation = async (educationId: string, languageId: string, formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await updateEducationTranslation(accessToken.value, educationId, languageId, formData);
    if (!data?.detail) {
      revalidatePath("/education-translation")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No education-translation found" };
  }
}
