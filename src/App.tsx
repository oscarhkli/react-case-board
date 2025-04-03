import React, { useEffect, useState } from 'react';
import './App.css';

export type Case = {
  id: number;
  caseNumber: string;
  title: string;
  description: string | null;
  status: string;
  createdDateTime: string;
  lastModifiedDateTime: string;
};

export type CasesResponse = {
  data: Case[];
};

interface DeleteButtonProps {
  id: number;
  onDelete: (id: number) => void;
  onDeleteError: (msg: string) => void;
  children: React.ReactNode;
}

function DeleteButton(
  { id, onDelete, onDeleteError, children }: DeleteButtonProps
) {
  const handleDeleteClick = (id: number) => {
    fetch(`/cases/${id}`, {method: "DELETE"})
      .then(() => {
        onDelete(id);
      })
      .catch((err) => {
        const msg = `Error occurred while deleting case ${id}`;
        console.error(msg, err);
        onDeleteError(msg);
      });
  }

  return (
    <button onClick={() => handleDeleteClick(id)}>
      {children}
    </button>
  );
}

interface State {
  cases: Case[];
  opMsg: string | null;
}

function App() {
  const [state, setState] = useState<State>({
    cases: [],
    opMsg: null,
  });

  useEffect(() => {
    fetch(`/cases`)
      .then((resp) => resp.json())
      .then((casesResponse => {
        let updatedStates: Case[] = [];
        if (casesResponse && Array.isArray(casesResponse.data)) {
          updatedStates = casesResponse.data;
        } else {
          console.error("Expected data.data to be an array", casesResponse);
          updatedStates = [];
        }
        setState((state) => ({
          ...state,
          cases: updatedStates,
        }));
      }))
      .catch((err) => console.error(err.message));
  }, []);

  const handleNewClick = () => {

  }

  const handleDeleteCase = (id: number) => {
    const updatedCases = state.cases.filter(c => c.id !== id);
    setState((state) => ({
      ...state,
      cases: updatedCases,
      opMsg: `Successfully deleted case with ID: ${id}`,
    }));
  }

  const handleDeleteError = (msg: string) => {
    setState((state) => ({
      ...state,
      opMsg: msg
    }));
  }

  return (
    <div className="App">
      <button onClick={handleNewClick}>New Case</button>
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
          {state.cases.map((c) => {
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
                  <DeleteButton id={c.id} onDelete={handleDeleteCase} onDeleteError={handleDeleteError}>Delete</DeleteButton>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div>{state.opMsg}</div>
    </div>
  );
}

export default App;
