import React, { useEffect, useState } from "react";
import "./App.css";
import { Link } from "react-router-dom";
import { Case } from "./lib/definition";
import { deleteCase, findAllCases } from "./lib/actions";
import { Button } from "./components/button";

interface DeleteButtonProps {
  id: number;
  onDelete: (id: number) => void;
  onDeleteError: (msg: string) => void;
  children: React.ReactNode;
}

function DeleteButton({
  id,
  onDelete,
  onDeleteError,
  children,
}: DeleteButtonProps) {
  const handleDeleteClick = async (id: number) => {
    try {
      await deleteCase(id);
      onDelete(id);
    } catch (err) {
      const msg = `Error occurred while deleting case ${id}`;
      console.error(msg, err);
      onDeleteError(msg);
    }
  };

  return <Button onClick={() => handleDeleteClick(id)}>{children}</Button>;
}

function App() {
  const [cases, setCases] = useState<Case[]>([]);
  const [opMsg, setOpMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function findAll() {
      try {
        const foundCases = await findAllCases();
        setCases(foundCases);
      } catch (err) {
        console.error("Error in finding all cases", err);
        setCases([]);
      } finally {
        setLoading(false);
      }
    }
    findAll();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const handleDeleteCase = (id: number) => {
    const updatedCases = cases.filter((c) => c.id !== id);
    setCases(updatedCases);
    setOpMsg(`Successfully deleted case with ID: ${id}`);
  };

  const handleDeleteError = (msg: string) => {
    setOpMsg(msg);
  };

  return (
    <div className="App">
      <Link to={"/create"}>
        <Button>New Case</Button>
      </Link> 
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Case Number</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Last Modified</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => {
            return (
              <tr key={`case-row-${c.id}`}>
                <td>{c.id}</td>
                <td>{c.caseNumber}</td>
                <td>{c.title}</td>
                <td>{c.description}</td>
                <td>{c.status}</td>
                <td>{c.createdDateTime}</td>
                <td>{c.lastModifiedDateTime}</td>
                <td>
                  <Link to={`/${c.id}/edit`}>
                    <Button>Edit</Button>
                  </Link>
                </td>
                <td>
                  <DeleteButton
                    id={c.id}
                    onDelete={handleDeleteCase}
                    onDeleteError={handleDeleteError}
                  >
                    Delete
                  </DeleteButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>{opMsg}</div>
    </div>
  );
}

export default App;
