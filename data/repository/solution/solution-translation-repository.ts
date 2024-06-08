export const getSolutionTranslation = async (token: string, solutionId: string, languageId: string) => {
  try {
    // Append the query string to the API URL
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/solution-translation/${solutionId}/${languageId}`;

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

export const createSolutionTranslation = async (token: string, formData: FormData) => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/solution-translation`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
      body: formData
    });

    if (response.status === 201 || response.status === 400 || response.status === 403 || response.status === 404) {
      const data = await response.json();
      return data;
    } else if (response.status === 422) {
      const data = await response.json();
      if (data.detail[0].msg) {
        return {
          detail: data.detail[0].msg
        }
      } else {
        return {
          detail: 'Failed to when creating data, check your input'
        }
      }
    }
    else {
      return {
        detail: "Something went wrong when creating solution-translation"
      };
    }

  } catch (error) {
    console.error(error)
    return {
      detail: "Error creating solution-translation"
    };
  }
};

export const updateSolutionTranslation = async (token: string, solutionId: string, languageId: string, formData: FormData) => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/solution-translation/${solutionId}/${languageId}`;

    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Authorization': 'Bearer ' + token,
      },
      body: formData
    });

    if (response.status === 200 || response.status === 400 || response.status === 403 || response.status === 404) {
      const data = await response.json();
      return data;
    } else if (response.status === 422) {
      const data = await response.json();
      if (data.detail[0].msg) {
        return {
          detail: data.detail[0].msg
        }
      } else {
        return {
          detail: 'Failed to when updating data, check your input'
        }
      }
    }
    else {
      return {
        detail: "Something went wrong when updating solution-translation"
      };
    }

  } catch (error) {
    console.error(error)
    return {
      detail: "Error updating solution-translation"
    };
  }
};

export const deleteSolutionTranslation = async (token: string, solutionId: string, languageId: string,) => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/solution-translation//${solutionId}/${languageId}`;

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
    else if (response.status === 400 || response.status === 403 || response.status === 404) {
      const data = await response.json();
      return data.detail;
    }
    else {
      return {
        detail: "Something went wrong when deleting solution-translation"
      };
    }

  } catch (error) {
    console.error(error)
    return {
      detail: "Error deleting solution-translation"
    };
  }
};
