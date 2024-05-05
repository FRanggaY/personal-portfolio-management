'use server';

import { createSchool, updateSchool } from "@/data/repository/school-repository";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "../auth/auth-action";

export const addSchool = async (formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await createSchool(accessToken.value, formData);
    if (!data?.detail) {
      revalidatePath("/school")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No school found" };
  }
}

export const editSchool = async (id: string, formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await updateSchool(accessToken.value, id, formData);
    if (!data?.detail) {
      revalidatePath("/school")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No school found" };
  }
}
