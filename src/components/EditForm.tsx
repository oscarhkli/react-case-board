import { useActionState } from "react";
import { updateCase, State } from "../lib/actions";
import { Link, useNavigate } from "react-router-dom";
import { Case } from "../lib/definition";

interface EditFormProps {
  singleCase: Case;
}

export default function Form({
  singleCase,
}: 
  EditFormProps
){
  const navigate = useNavigate();
  const updateCaseWithId = updateCase.bind(null, singleCase.id)
  const initialState: State = { message: null, errors: {} };

  const handleUpdateCase = async (prevState: State, formData: FormData) => {
    const result = await updateCaseWithId(prevState, formData);
    if (!result.errors) {
      navigate("/");
    }
    return result;
  };

  const [state, formAction] = useActionState(handleUpdateCase, initialState);

  return (
    <form action={formAction}>
      <div>
        {/* Case Number */}
        <div>
          <div>
            <label htmlFor="caseNumber">Case Number</label>
            <input
              id="caseNumber"
              name="caseNumber"
              defaultValue={singleCase.caseNumber}
            />
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
            <input
              id="title"
              name="title"
              defaultValue={singleCase.title}
            />
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
            <input
              id="description"
              name="description"
              defaultValue={singleCase.description ?? ""}
            />
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
            <input
              id="status"
              name="status"
              defaultValue={singleCase.status}
            />
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
          <button>Cancel</button>
        </Link>
        <button type="submit">Edit Case</button>
      </div>
    </form>
  );
}
