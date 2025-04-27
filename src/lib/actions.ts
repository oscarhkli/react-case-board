import { z } from "zod";
import { Case } from "./definition";

const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:61001";

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

const FormSchema = z.object({
  id: z.number(),
  caseNumber: z
    .string()
    .min(1, { message: "Case number is required" })
    .max(10, { message: "Must be 10 or fewer characters long" }),
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .max(80, { message: "Must be 80 or fewer characters long" }),
  description: z
    .string()
    .max(200, {
      message: "Must be 200 or fewer characters long",
    })
    .optional()
    .nullable(),
  status: z.enum(["New", "Acknowledged", "In-progress", "Resolved", "Closed"], {
    invalid_type_error: "Please select an appropriate status",
  }),
  createdDatetime: z.date(),
  lastModifiedDatetime: z.date(),
});

const CreateCase = FormSchema.omit({
  id: true,
  createdDatetime: true,
  lastModifiedDatetime: true,
});
const UpdateCase = FormSchema.omit({
  id: true,
  createdDatetime: true,
  lastModifiedDatetime: true,
});

export async function createCase(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = CreateCase.safeParse({
    caseNumber: formData.get("caseNumber"),
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create case.",
    };
  }

  const { caseNumber, title, description, status } = validatedFields.data;
  const newCase = {
    caseNumber,
    title,
    description,
    status,
  };

  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newCase),
  };

  try {
    const response = await fetch(`${backendUrl}/api/v1/cases`, requestOptions);
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      console.error("Failed to create case", errorData);
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
  const validatedFields = UpdateCase.safeParse({
    caseNumber: formData.get("caseNumber"),
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing fields. Failed to create case.",
    };
  }

  const { caseNumber, title, description, status } = validatedFields.data;
  const updatedCase = {
    id,
    caseNumber,
    title,
    description,
    status,
  };

  const requestOptions = {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedCase),
  };

  try {
    const response = await fetch(
      `${backendUrl}/api/v1/cases/${id}`,
      requestOptions
    );
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      console.error("Failed to update case", errorData);
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
};

export async function findCaseById(id: number): Promise<FindState> {
  const requestOptions = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  try {
    const response = await fetch(
      `${backendUrl}/api/v1/cases/${id}`,
      requestOptions
    );
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      console.error(`Failed to find case by id ${id}`, errorData);
      return {
        error: errorData,
      };
    }
    const resp = await response.json();
    return {
      case: resp.data,
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
    const response = await fetch(`${backendUrl}/api/v1/cases`, requestOptions);
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      console.error("Failed to get all cases", errorData);
      return {
        error: errorData,
      };
    }
    const resp = await response.json();
    return {
      cases: resp.data,
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
    const response = await fetch(
      `${backendUrl}/api/v1/cases/${id}`,
      requestOptions
    );
    if (!response.ok) {
      const errorData: ErrorResponse = await response.json();
      console.error(`Failed to delete case by id ${id}`, errorData);
      throw new Error(`Failed to delete case by id ${id}`);
    }
  } catch (err) {
    const msg = `Failed to delete case by id ${id}`;
    console.error(msg, err);
    throw err;
  }
}
