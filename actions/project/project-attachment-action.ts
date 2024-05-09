'use server';

import { createProjectAttachment, updateProjectAttachment } from "@/data/repository/project/project-attachment-repository";
import { revalidatePath } from "next/cache";
import { getAccessToken } from "../auth/auth-action";

export const addProjectAttachment = async (formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await createProjectAttachment(accessToken.value, formData);
    if (!data?.detail) {
      revalidatePath("/project-attachment")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No project-attachment found" };
  }
}

export const editProjectAttachment = async (projectIdAttachment: string, formData: FormData) => {
  const accessToken = await getAccessToken();
  if (accessToken) {
    const data = await updateProjectAttachment(accessToken.value, projectIdAttachment, formData);
    if (!data?.detail) {
      revalidatePath("/project-attachment")
      return 'SUCCESS';
    }

    return data.detail
  } else {
    return { detail: "No project-attachment found" };
  }
}
