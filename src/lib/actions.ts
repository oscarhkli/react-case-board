export type State = {
  errors?: {
    caseNumber?: string[];
    title?: string[];
    description?: string[];
    status?: string[];
  };
  message?: string | null;
};

export async function createCase(
  prevState: State,
  formData: FormData
): Promise<State> {
  const newCase = {
    caseNumber: formData.get("caseNumber"),
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
  };

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCase),
  };

  try {
    const response = await fetch("/api/v1/cases", requestOptions);
    if (!response.ok) {
      const errorData = await response.json();
      return {
        errors: errorData.errors || { message: ["Error occured in creating case"] }
      };
    }

    return {};
  } catch (err) {
    console.error("Failed to create case", err);
    return {
      message: "Failed to create case"
    }; 
  }
}

export async function updateCase(
  id: number,
  prevState: State,
  formData: FormData
): Promise<State> {
  const updatedCase = {
    id: id,
    caseNumber: formData.get("caseNumber"),
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
  };

  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedCase),
  };

  try {
    const response = await fetch(`/api/v1/cases/${id}`, requestOptions);
    if (!response.ok) {
      const errorData = await response.json();
      return {
        errors: errorData.errors || { message: ["Error occured in creating case"] }
      }; 
    }

    return {};
  } catch (err) {
    const msg = `Failed to update case ${id}`;
    console.error(msg, err);
    return {
      message: msg
    }; 
  }
}

export async function findCaseById(id: number) {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const response = await fetch(`/api/v1/cases/${id}`, requestOptions);
    if (!response.ok) {
      const errorData = await response.json();
      return errorData;
    }
    const resp = await response.json();
    return resp.data;
  } catch (err) {
    const msg = `Failed to get case by id ${id}`;
    console.error(msg, err);
    throw new Error(msg)
  }
}