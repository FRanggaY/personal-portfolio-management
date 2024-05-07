'use server';

import { createSolutionTranslation, updateSolutionTranslation } from "@/data/repository/solution/solution-translation-repository";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "../auth/auth-action";

export const addSolutionTranslation = async (formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await createSolutionTranslation(accessToken.value, formData);
    if (!data?.detail) {
      revalidatePath("/solution-translation")
      return 'SUCCESS';
    }
    
    return data.detail
  } else {
    return { detail: "No solution-translation found" };
  }
}

export const editSolutionTranslation = async (solutionId: string, languageId: string, formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await updateSolutionTranslation(accessToken.value, solutionId, languageId, formData);
    if (!data?.detail) {
      revalidatePath("/solution-translation")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No solution-translation found" };
  }
}
