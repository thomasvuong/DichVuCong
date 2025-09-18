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

export type FormFieldConfig = {
  id: string;
  label: string;
  placeholder: string;
  group: string;
};

export type RequiredDocument = {
  id: string;
  name: string;
  templateUrl?: string;
  onlineForm?: FormFieldConfig[];
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
  phoneNumber: string;
};
