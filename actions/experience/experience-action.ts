'use server';

import { createExperience, updateExperience } from "@/data/repository/experience-repository";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "../auth/auth-action";

export const addExperience = async (formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await createExperience(accessToken.value, formData);
    if (!data?.detail) {
      revalidatePath("/experience")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No experience found" };
  }
}

export const editExperience = async (id: string, formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await updateExperience(accessToken.value, id, formData);
    if (!data?.detail) {
      revalidatePath("/experience")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No experience found" };
  }
}
