'use server';

import { createSkill, updateSkill } from "@/data/repository/skill-repository";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "../auth/auth-action";

export const addSkill = async (formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await createSkill(accessToken.value, formData);
    if (!data?.detail) {
      revalidatePath("/skill")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No skill found" };
  }
}

export const editSkill = async (id: string, formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await updateSkill(accessToken.value, id, formData);
    if (!data?.detail) {
      revalidatePath("/skill")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No skill found" };
  }
}
