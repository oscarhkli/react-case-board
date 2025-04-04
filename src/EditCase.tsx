import React, { useEffect, useState } from "react";
import Form from "./components/EditForm";
import { Navigate, useParams } from "react-router-dom";
import { findCaseById } from "./lib/actions";
import { Case } from "./lib/definition";

function toNumber(caseId: string | null | undefined): number {
  if (caseId === null || caseId === undefined) {
    return -1;
  }
  const parsedValue = parseInt(caseId);
  if (isNaN(parsedValue) || parsedValue.toString() !== caseId.trim()) {
    return -1;
  }
  return parsedValue;
}

export function notFound() {
  return <Navigate to="/not-found" replace />;
}

export default function EditCase() {
  const { caseId } = useParams();
  const id = toNumber(caseId);

  const [singleCase, setSingleCase] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findCase() {
      try {
        const foundCase = await findCaseById(id);
        if (!foundCase) {
          setSingleCase(null);
        } else {
          setSingleCase(foundCase);
        }
      } catch (err) {
        console.error("Error in finding case", err);
        setSingleCase(null);
      } finally {
        setLoading(false);
      }
    }

    if (id >= 0) {
      console.log("find")
      findCase();
    } else {
      setLoading(false);
    }
  }, [id])

  if (loading) {
    return <p>Loading...</p>
  }

  if (id < 0 || !singleCase) {
    return notFound();
  }

  return (
    <div>
      <h1>{`Edit Case: ${caseId}`}</h1>
      <Form singleCase={singleCase} />
    </div>
  );
}
