'use server';

import { createSchoolTranslation, updateSchoolTranslation } from "@/data/repository/school/school-translation-repository";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "../auth/auth-action";

export const addSchoolTranslation = async (formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await createSchoolTranslation(accessToken.value, formData);
    if (!data?.detail) {
      revalidatePath("/school-translation")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No school-translation found" };
  }
}

export const editSchoolTranslation = async (schoolId: string, languageId: string, formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await updateSchoolTranslation(accessToken.value, schoolId, languageId, formData);
    if (!data?.detail) {
      revalidatePath("/school-translation")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No school-translation found" };
  }
}
