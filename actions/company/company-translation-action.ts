'use server';

import { createCompanyTranslation, updateCompanyTranslation } from "@/data/repository/company/company-translation-repository";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "../auth/auth-action";

export const addCompanyTranslation = async (formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await createCompanyTranslation(accessToken.value, formData);
    if (!data?.detail) {
      revalidatePath("/company-translation")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No company-translation found" };
  }
}

export const editCompanyTranslation = async (companyId: string, languageId: string, formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await updateCompanyTranslation(accessToken.value, companyId, languageId, formData);
    if (!data?.detail) {
      revalidatePath("/company-translation")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No company-translation found" };
  }
}
