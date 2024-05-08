export const getEducations = async (token: string, customParam: any) => {
  try {
    // Construct the query string from customParam
    const queryString = new URLSearchParams(customParam).toString();

    // Append the query string to the API URL
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/education?${queryString}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      next: {
        revalidate: 5,
      }
    });

    if (!response.ok) {
      return {
        data: []
      };
    }

    const datas = await response.json();
    return datas;
  } catch (error) {
    return {
      data: []
    };
  }
};

export const getEducation = async (token: string, id: string) => {
  try {
    // Append the query string to the API URL
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/education/${id}`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      next: {
        revalidate: 1,
      }
    });

    if (!response.ok) {
      return {
        data: {}
      };
    }

    const datas = await response.json();
    return datas;
  } catch (error) {
    return {
      data: {}
    };
  }
};

export const createEducation = async (token: string, formData: FormData) => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/education`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
      body: formData
    });

    if (response.status === 201 || response.status === 400 || response.status === 403 || response.status === 404 || response.status === 422) {
      const data = await response.json();
      return data;
    }
    else {
      return {
        detail: "Something went wrong when creating education"
      };
    }

  } catch (error) {
    console.error(error)
    return {
      detail: "Error creating education"
    };
  }
};

export const updateEducation = async (token: string, id: string, formData: FormData) => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/education/${id}`;

    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
      body: formData
    });

    if (response.status === 200 || response.status === 400 || response.status === 403 || response.status === 404 || response.status === 422) {
      const data = await response.json();
      return data;
    }
    else {
      return {
        detail: "Something went wrong when updating education"
      };
    }

  } catch (error) {
    console.error(error)
    return {
      detail: "Error updating education"
    };
  }
};

export const deleteEducation = async (token: string, id: string) => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/education/${id}`;

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
    });

    if (response.status === 200) {
      return 'SUCCESS';
    }
    else if (response.status === 400 || response.status === 403) {
      const data = await response.json();
      return data.detail;
    }
    else {
      return {
        detail: "Something went wrong when deleting education"
      };
    }

  } catch (error) {
    console.error(error)
    return {
      detail: "Error deleting education"
    };
  }
};

export const getEducationResource = async (token: string) => {
  try {
    // Append the query string to the API URL
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/education-resource`;

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      next: {
        revalidate: 5,
      }
    });

    if (!response.ok) {
      return {
        data: []
      };
    }

    const datas = await response.json();
    return datas;
  } catch (error) {
    return {
      data: []
    };
  }
};