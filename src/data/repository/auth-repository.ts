import { AuthLogin, AuthProfilePassword } from "@/types/auth";

export const authLogin = async (token: string, rawData: AuthLogin) => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rawData)
    });

    if (response.status === 200 || response.status === 400 || response.status === 404 || response.status === 422) {
      const data = await response.json();
      return data;
    }
    else {
      return {
        detail: "Something went wrong when login"
      };
    }

  } catch (error) {
    console.error(error)
    return {
      detail: "Error login"
    };
  }
};

export const authProfile = async (token: string | null) => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/profile`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
    });

    if (response.status === 200 || response.status === 403 || response.status === 401) {
      const data = await response.json();
      return data;
    }
    else {
      return {
        detail: "Something went wrong when get profile"
      };
    }

  } catch (error) {
    console.error(error)
    return {
      detail: "Error get profile"
    };
  }
};

export const authUpdateProfile = async (token: string | null, formData: FormData) => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/profile`;

    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
      body: formData
    });

    if (response.status === 200 || response.status === 400 || response.status === 404 || response.status === 422) {
      const data = await response.json();
      return data;
    }
    else {
      return {
        detail: "Something went wrong when update profile"
      };
    }

  } catch (error) {
    console.error(error)
    return {
      detail: "Error update profile"
    };
  }
};

export const authUpdateProfilePassword = async (token: string | null, rawData: AuthProfilePassword) => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/profile/password`;

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(rawData)
    });

    if (response.status === 200 || response.status === 400 || response.status === 404 || response.status === 422) {
      const data = await response.json();
      return data;
    }
    else {
      return {
        detail: "Something went wrong when update profile password"
      };
    }

  } catch (error) {
    console.error(error)
    return {
      detail: "Error update profile password"
    };
  }
};
