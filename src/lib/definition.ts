export type Case = {
  id: number;
  caseNumber: string;
  title: string;
  description: string | null;
  status: string;
  createdDateTime: Date;
  lastModifiedDateTime: Date;
};

export type CasesResponse = {
  data: Case[];
};

