export type FieldType = 'text' | 'number' | 'email' | 'date' | 'dropdown' | 'checkbox' | 'radio' | 'textarea';

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder: string;
  required: boolean;
  options: string[];
}

export interface FormTemplate {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  fieldCount: number;
  submissions: number;
  lastModified: string;
  category: string;
  createdBy: string;
}

export interface Submission {
  id: string;
  formId: string;
  formTitle: string;
  submitter: string;
  email: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
}

export interface WorkflowRule {
  id: string;
  name: string;
  formTitle: string;
  trigger: string;
  condition: string;
  action: string;
  status: 'active' | 'paused';
  runs: number;
  lastRun: string;
}

export interface AppRole {
  id: string;
  name: string;
  permissions: string[];
  users: number;
}
