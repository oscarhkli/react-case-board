import { Link, useRouteError } from "react-router-dom";

export default function NotFound() {
  const error = useRouteError();
  console.error(error);

  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <p>
        {(error as Error)?.message || "Unknown error"}
      </p>
      <Link to="/">Go back to Home</Link>
    </div>
  );
}
