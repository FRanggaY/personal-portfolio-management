'use server';

import { createProject, updateProject } from "@/data/repository/project-repository";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "../auth/auth-action";

export const addProject = async (formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await createProject(accessToken.value, formData);
    if (!data?.detail) {
      revalidatePath("/project")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No project found" };
  }
}

export const editProject = async (id: string, formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await updateProject(accessToken.value, id, formData);
    if (!data?.detail) {
      revalidatePath("/project")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No project found" };
  }
}
