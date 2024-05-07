'use server';

import { createSolution, updateSolution } from "@/data/repository/solution/solution-repository";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "../auth/auth-action";

export const addSolution = async (formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await createSolution(accessToken.value, formData);
    if (!data?.detail) {
      revalidatePath("/solution")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No solution found" };
  }
}

export const editSolution = async (id: string, formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await updateSolution(accessToken.value, id, formData);
    if (!data?.detail) {
      revalidatePath("/solution")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No solution found" };
  }
}
