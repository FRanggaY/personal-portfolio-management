'use server';

import { authLogin, authProfile, authUpdateProfile, authUpdateProfilePassword } from "@/data/repository/auth-repository";
import { AuthLogin, AuthProfilePassword } from "@/types/auth";
import { revalidatePath } from "next/cache";
import { cookies } from 'next/headers'

export const login = async (rawData: AuthLogin) => {
  const data = await authLogin("", rawData);
  if (!data?.detail) {
    cookies().set('access_token', data.data.access_token, { httpOnly: false, secure: false })
    revalidatePath("/role")
    return 'SUCCESS';
  }

  return data.detail
}

export const getAccessToken = async () => {
  try {
    const accessToken = await cookies().get('access_token');
    return accessToken ?? null;
  } catch (error) {
    console.error('Error while retrieving access token:', error);
    return null;
  }
};

export const removeAccessToken = () => {
  try {
    return cookies().delete('access_token');
  } catch (error) {
    console.error('Error while deleting access token:', error);
    return null;
  }
};

export const getProfile = async () => {
  const accessToken = await getAccessToken();

  if (accessToken) {
    const data = await authProfile(accessToken.value);
    if (data?.detail) {
      return data;
    } else {
      return data.data;
    }
  } else {
    return { detail: "No user found" };
  }
}

export const updateProfile = async (formData: FormData) => {
  const accessToken = await getAccessToken();

  if (accessToken) {
    const data = await authUpdateProfile(accessToken.value, formData);
    if(!data?.detail){
      revalidatePath("/settings")
      return 'SUCCESS';
    }
  
    return data.detail
  } else {
    return { detail: "No user found" };
  }
}

export const updateProfilePassword = async (rawData: AuthProfilePassword) => {
  const accessToken = await getAccessToken();

  if (accessToken) {
    const data = await authUpdateProfilePassword(accessToken.value, rawData);
    if(!data?.detail){
      revalidatePath("/settings")
      return 'SUCCESS';
    }
  
    return data.detail
  } else {
    return { detail: "No user found" };
  }
}
