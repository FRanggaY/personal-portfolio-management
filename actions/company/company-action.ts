'use server';

import { createCompany, updateCompany } from "@/data/repository/company-repository";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "../auth/auth-action";

export const addCompany = async (formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await createCompany(accessToken.value, formData);
    if (!data?.detail) {
      revalidatePath("/company")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No user found" };
  }
}

export const editCompany = async (id: string, formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await updateCompany(accessToken.value, id, formData);
    if (!data?.detail) {
      revalidatePath("/company")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No user found" };
  }
}
