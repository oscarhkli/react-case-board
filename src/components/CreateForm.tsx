import { useActionState } from "react";
import { createCase, ErrorDetails, State } from "../lib/actions";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./button";

export default function Form() {
  const navigate = useNavigate();
  const initialState: State = { message: null, errors: {} };

  const handleCreateCase = async (prevState: State, formData: FormData) => {
    const result: State = await createCase(prevState, formData);
    if (!result.errors && !result.errorResponse) {
      navigate("/");
    } else if (result.errorResponse) {
      console.error(result.errorResponse);
    }
    return result;
  };

  const [state, formAction] = useActionState(handleCreateCase, initialState);

  return (
    <form className="mt-3" action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Case Number */}
        <div className="mb-4">
          <label
            htmlFor="caseNumber"
            className="mb-2 block text-sm font-medium"
          >
            Case Number
          </label>
          <div className="relative">
            <input
              id="caseNumber"
              name="caseNumber"
              className="block w-full rounded-md border border-gray-200 py-2 pl-5 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="caseNumber-error"
            />
          </div>
          <div id="caseNumber-error" aria-live="polite" aria-atomic="true">
            {state.errors?.caseNumber &&
              state.errors.caseNumber.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Title
          </label>
          <div className="relative">
            <input
              id="title"
              name="title"
              className="block w-full rounded-md border border-gray-200 py-2 pl-5 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="title-error"
            />
          </div>
          <div id="title-error" aria-live="polite" aria-atomic="true">
            {state.errors?.title &&
              state.errors.title.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Description
          </label>
          <div className="relative">
            <input
              id="description"
              name="description"
              className="block w-full rounded-md border border-gray-200 py-2 pl-5 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="description-error"
            />
          </div>
          <div id="description-error" aria-live="polite" aria-atomic="true">
            {state.errors?.title &&
              state.errors.title.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Status */}
        <div className="mb-4">
          <label htmlFor="status" className="mb-2 block text-sm font-medium">
            Status
          </label>
          <div className="relative">
            <select
              id="status"
              name="status"
              className="block w-full rounded-md border border-gray-200 py-2 pl-5 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="status-error"
              defaultValue=""
            >
              <option value="" disabled>Select a status</option>
              <option value="New">New</option>
              <option value="Acknowledged">Acknowledged</option>
              <option value="In-progress">In-progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <Link to="/">
          <Button>Cancel</Button>
        </Link>
        <Button type="submit">Create Case</Button>
      </div>

      <div id="status-error" aria-live="polite" aria-atomic="true">
          {state.errorResponse && state.errorResponse.error?.errors.map((error: ErrorDetails) => (
            <p className="mt-2 text-sm text-red-500" key={`${error.reason}-${error.message}`}>
              {`${error.reason}: ${error.message}`}
            </p> 
          ))}
      </div>

    </form>
  );
}
