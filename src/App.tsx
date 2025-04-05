import React, { useEffect, useState } from "react";
// import "./App.css";
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
    <div className="p-5">
      <h1 className="text-3xl font-bold">Case Board</h1>
      <div className="mt-3">
        <Link to={"/create"}>
          <Button>New Case</Button>
        </Link> 
      </div>
      <table className="rounded-md bg-gray-50 mt-3 min-w-full text-gray-900 md:table">
        <thead className="rounded-lg text-left text-sm font-normal">
          <tr>
            <th scope="col" className="px-4 py-5 font-medium sm:pl-6">ID</th>
            <th scope="col" className="px-3 py-5 font-medium">Case Number</th>
            <th scope="col" className="px-3 py-5 font-medium">Title</th>
            <th scope="col" className="px-3 py-5 font-medium">Description</th>
            <th scope="col" className="px-3 py-5 font-medium">Status</th>
            <th scope="col" className="px-3 py-5 font-medium">Created Date</th>
            <th scope="col" className="px-3 py-5 font-medium">Last Modified</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => {
            return (
              <tr
                key={`case-row-${c.id}`}
                className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
              >
                <td className="whitespace-nowrap py-3 pl-6 pr-3">{c.id}</td>
                <td className="whitespace-nowrap px-3 py-3">{c.caseNumber}</td>
                <td className="whitespace-nowrap px-3 py-3">{c.title}</td>
                <td className="whitespace-nowrap px-3 py-3">{c.description}</td>
                <td className="whitespace-nowrap px-3 py-3">{c.status}</td>
                <td className="whitespace-nowrap px-3 py-3">
                  {new Date(c.createdDateTime).toUTCString()}</td>
                <td className="whitespace-nowrap px-3 py-3">
                  {new Date(c.lastModifiedDateTime).toUTCString()}</td>
                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                  <div className="flex justify-end gap-3">
                    <Link to={`/${c.id}/edit`}>
                      <Button>Edit</Button>
                    </Link>
                    <DeleteButton
                      id={c.id}
                      onDelete={handleDeleteCase}
                      onDeleteError={handleDeleteError}
                    >
                      Delete
                    </DeleteButton>
                  </div>
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
