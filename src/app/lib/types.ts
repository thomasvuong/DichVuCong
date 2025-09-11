export type Service = {
  id: string;
  title: string;
  description: string;
  link: string;
};

export type FeaturedService = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
};

export type RequiredDocument = {
  id: string;
  name: string;
  templateUrl?: string;
};

export type ProcedureDetail = {
  id:string;
  title: string;
  description: string;
  agency: string;
  procedure: string;
  submissionMethod: string;
  processingTime: string;
  fee: string;
  requiredDocuments: RequiredDocument[];
};

export type UserInfo = {
  fullName: string;
  idNumber: string;
  dateOfBirth: string;
  address: string;
};
