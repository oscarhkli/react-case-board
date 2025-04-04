import { useActionState } from "react";
import { createCase, State } from "../lib/actions";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./button";

export default function Form() {
  const navigate = useNavigate();
  const initialState: State = { message: null, errors: {} };

  const handleCreateCase = async (prevState: State, formData: FormData) => {
    const result = await createCase(prevState, formData);
    if (!result.errors) {
      navigate("/");
    }
    return result;
  };

  const [state, formAction] = useActionState(handleCreateCase, initialState);

  return (
    <form action={formAction}>
      <div>
        {/* Case Number */}
        <div>
          <div>
            <label htmlFor="caseNumber">Case Number</label>
            <input id="caseNumber" name="caseNumber" />
          </div>
          <div id="caseNumber-error" aria-live="polite" aria-atomic="true">
            {state.errors?.caseNumber &&
              state.errors.caseNumber.map((error: string) => (
                <p className="error" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <div>
            <label htmlFor="title">Title</label>
            <input id="title" name="title" />
          </div>
          <div id="title-error" aria-live="polite" aria-atomic="true">
            {state.errors?.title &&
              state.errors.title.map((error: string) => (
                <p className="error" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <div>
            <label htmlFor="description">Description</label>
            <input id="description" name="description" />
          </div>
          <div id="title-error" aria-live="polite" aria-atomic="true">
            {state.errors?.title &&
              state.errors.title.map((error: string) => (
                <p className="error" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <div>
            <label htmlFor="status">Status</label>
            <input id="status" name="status" />
          </div>
          <div id="status-error" aria-live="polite" aria-atomic="true">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="error" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>
      </div>

      <div>
        <Link to="/">
          <Button>Cancel</Button>
        </Link>
        <Button type="submit">Create Case</Button>
      </div>
    </form>
  );
}
