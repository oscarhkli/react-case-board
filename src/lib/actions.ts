import { Case } from "./definition";

export type State = {
  errors?: {
    caseNumber?: string[];
    title?: string[];
    description?: string[];
    status?: string[];
  };
  errorResponse?: ErrorResponse | null;
  message?: string | null;
};

export type ErrorDetails = {
  reason: string;
  message: string;
};

interface ErrorResponse {
  error: {
    code: string;
    message: string;
    errors: ErrorDetails[];
  };
}

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
      const errorData: ErrorResponse = await response.json();
      console.error("Failed to create case", errorData)
      return {
        message: "Failed to create case",
        errorResponse: errorData,
      };
    }

    return {};
  } catch (err) {
    console.error("Failed to create case", err);
    return {
      message: "Failed to create case",
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
      const errorData: ErrorResponse = await response.json();
      console.error("Failed to update case", errorData)
      return {
        message: "Failed to update case",
        errorResponse: errorData,
      };
    }

    return {};
  } catch (err) {
    const msg = `Failed to update case ${id}`;
    console.error(msg, err);
    return {
      message: msg,
    };
  }
}

export type FindState = {
  case?: Case;
  cases?: Case[];
  error?: ErrorResponse;
  message?: string;
}

export async function findCaseById(id: number): Promise<FindState> {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const response = await fetch(`/api/v1/cases/${id}`, requestOptions);
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      console.error(`Failed to find case by id ${id}`, errorData);
      return {
        error: errorData
      };
    }
    const resp = await response.json();
    return {
      case: resp.data
    };
  } catch (err) {
    const msg = `Failed to get case by id ${id}`;
    console.error(msg, err);
    throw err;
  }
}

export async function findAllCases(): Promise<FindState> {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const response = await fetch(`/api/v1/cases`, requestOptions);
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      console.error("Failed to get all cases", errorData);
      return {
        error: errorData
      };
    }
    const resp = await response.json();
    return {
      cases: resp.data
    };
  } catch (err) {
    const msg = `Failed to get all cases`;
    console.error(msg, err);
    throw err;
  }
}

export async function deleteCase(id: number): Promise<void> {
  const requestOptions = {
    method: "DELETE",
  };

  try {
    const response = await fetch(`/api/v1/cases/${id}`, requestOptions);
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      console.error(`Failed to delete case by id ${id}`, errorData);
      throw new Error(`Failed to delete case by id ${id}`)
    }
  } catch (err) {
    const msg = `Failed to delete case by id ${id}`;
    console.error(msg, err);
    throw err;
  }
}
