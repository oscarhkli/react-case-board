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

