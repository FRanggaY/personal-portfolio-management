'use server';

import { createEducation, updateEducation } from "@/data/repository/education/education-repository";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "../auth/auth-action";

export const addEducation = async (formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await createEducation(accessToken.value, formData);
    if (!data?.detail) {
      revalidatePath("/education")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No education found" };
  }
}

export const editEducation = async (id: string, formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await updateEducation(accessToken.value, id, formData);
    if (!data?.detail) {
      revalidatePath("/education")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No education found" };
  }
}
