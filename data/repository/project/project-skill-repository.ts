export const getProjectSkills = async (token: string, customParam: any) => {
  try {
    // Construct the query string from customParam
    const queryString = new URLSearchParams(customParam).toString();

    // Append the query string to the API URL
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/project-skill?${queryString}`;

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

export const createProjectSkill = async (token: string, formData: FormData) => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/project-skill`;

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
    }else if (response.status === 422) {
      const data = await response.json();
      if(data.detail[0].msg){
        return {
          detail: data.detail[0].msg
        }
      }else{
        return {
          detail: 'Failed to when creating project-skill, check your input'
        }
      }
    }
    else {
      return {
        detail: "Something went wrong when creating project-skill"
      };
    }

  } catch (error) {
    console.error(error)
    return {
      detail: "Error creating project-skill"
    };
  }
};

export const updateProjectSkill = async (token: string, projectId: string, skillId: string, formData: FormData) => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/project-skill/${projectId}/${skillId}`;

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
    }else if (response.status === 422) {
      const data = await response.json();
      if(data.detail[0].msg){
        return {
          detail: data.detail[0].msg
        }
      }else{
        return {
          detail: 'Failed to when updating data, check your input'
        }
      }
    }
    else {
      return {
        detail: "Something went wrong when updating project-skill"
      };
    }

  } catch (error) {
    console.error(error)
    return {
      detail: "Error updating project-skill"
    };
  }
};

export const deleteProjectSkill = async (token: string, projectId: string, skillId: string,) => {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/project-skill/${projectId}/${skillId}`;

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
    else if (response.status === 404) {
      return 'NOT_FOUND';
    }
    else if (response.status === 400 || response.status === 403 || response.status === 404) {
      const data = await response.json();
      return data.detail;
    }
    else {
      return {
        detail: "Something went wrong when deleting project-skill"
      };
    }

  } catch (error) {
    console.error(error)
    return {
      detail: "Error deleting project-skill"
    };
  }
};
