import type { FormTemplate, Submission, WorkflowRule, AppRole } from './types';

export const forms: FormTemplate[] = [
  { id: 'f1', title: 'Employee Onboarding', description: 'New hire documentation and policy acknowledgements.', status: 'published', fieldCount: 12, submissions: 48, lastModified: '2024-12-10', category: 'HR', createdBy: 'Priya Sharma' },
  { id: 'f2', title: 'Leave Request', description: 'Apply for sick, casual, or earned leave with manager routing.', status: 'published', fieldCount: 6, submissions: 234, lastModified: '2024-11-28', category: 'HR', createdBy: 'Rahul Gupta' },
  { id: 'f3', title: 'IT Asset Request', description: 'Request laptop, peripherals, or software licence access.', status: 'published', fieldCount: 8, submissions: 67, lastModified: '2024-12-05', category: 'IT', createdBy: 'Amit Verma' },
  { id: 'f4', title: 'Vendor Registration', description: 'Third-party vendor KYC and compliance details.', status: 'draft', fieldCount: 15, submissions: 0, lastModified: '2024-12-12', category: 'Finance', createdBy: 'Sonia Mehra' },
  { id: 'f5', title: 'Performance Review', description: 'Quarterly self-assessment and manager feedback form.', status: 'published', fieldCount: 10, submissions: 89, lastModified: '2024-10-30', category: 'HR', createdBy: 'Priya Sharma' },
  { id: 'f6', title: 'Travel Reimbursement', description: 'Submit expenses for domestic and international business travel.', status: 'archived', fieldCount: 9, submissions: 156, lastModified: '2024-08-15', category: 'Finance', createdBy: 'Rahul Gupta' },
  { id: 'f7', title: 'Client Feedback Survey', description: 'Post-delivery satisfaction survey for enterprise clients.', status: 'published', fieldCount: 7, submissions: 312, lastModified: '2024-12-01', category: 'CX', createdBy: 'Deepak Nair' },
  { id: 'f8', title: 'Security Incident Report', description: 'Report security breaches or suspicious internal activity.', status: 'draft', fieldCount: 11, submissions: 0, lastModified: '2024-12-14', category: 'Security', createdBy: 'Amit Verma' },
];

export const submissions: Submission[] = [
  { id: 'SUB-1001', formId: 'f1', formTitle: 'Employee Onboarding', submitter: 'Rohan Desai', email: 'rohan.d@corp.io', date: '2024-12-14', status: 'approved' },
  { id: 'SUB-1002', formId: 'f2', formTitle: 'Leave Request', submitter: 'Ananya Singh', email: 'ananya.s@corp.io', date: '2024-12-13', status: 'pending' },
  { id: 'SUB-1003', formId: 'f5', formTitle: 'Performance Review', submitter: 'Vikram Patel', email: 'vikram.p@corp.io', date: '2024-12-13', status: 'under_review' },
  { id: 'SUB-1004', formId: 'f7', formTitle: 'Client Feedback Survey', submitter: 'Michelle Brown', email: 'michelle.b@client.com', date: '2024-12-12', status: 'approved' },
  { id: 'SUB-1005', formId: 'f3', formTitle: 'IT Asset Request', submitter: 'Karan Mehta', email: 'karan.m@corp.io', date: '2024-12-12', status: 'pending' },
  { id: 'SUB-1006', formId: 'f2', formTitle: 'Leave Request', submitter: 'Neha Joshi', email: 'neha.j@corp.io', date: '2024-12-11', status: 'approved' },
  { id: 'SUB-1007', formId: 'f5', formTitle: 'Performance Review', submitter: 'Arjun Kapoor', email: 'arjun.k@corp.io', date: '2024-12-11', status: 'rejected' },
  { id: 'SUB-1008', formId: 'f7', formTitle: 'Client Feedback Survey', submitter: 'Sarah Thompson', email: 'sarah.t@client.com', date: '2024-12-10', status: 'approved' },
  { id: 'SUB-1009', formId: 'f1', formTitle: 'Employee Onboarding', submitter: 'Priya Kumar', email: 'priya.k@corp.io', date: '2024-12-10', status: 'under_review' },
  { id: 'SUB-1010', formId: 'f3', formTitle: 'IT Asset Request', submitter: 'Suresh Reddy', email: 'suresh.r@corp.io', date: '2024-12-09', status: 'approved' },
  { id: 'SUB-1011', formId: 'f2', formTitle: 'Leave Request', submitter: 'Divya Nair', email: 'divya.n@corp.io', date: '2024-12-09', status: 'pending' },
  { id: 'SUB-1012', formId: 'f7', formTitle: 'Client Feedback Survey', submitter: 'James Wilson', email: 'james.w@client.com', date: '2024-12-08', status: 'approved' },
  { id: 'SUB-1013', formId: 'f5', formTitle: 'Performance Review', submitter: 'Raj Malhotra', email: 'raj.m@corp.io', date: '2024-12-07', status: 'approved' },
  { id: 'SUB-1014', formId: 'f2', formTitle: 'Leave Request', submitter: 'Pooja Agarwal', email: 'pooja.a@corp.io', date: '2024-12-06', status: 'under_review' },
  { id: 'SUB-1015', formId: 'f3', formTitle: 'IT Asset Request', submitter: 'Nitin Sharma', email: 'nitin.s@corp.io', date: '2024-12-05', status: 'rejected' },
];

export const workflowRules: WorkflowRule[] = [
  { id: 'w1', name: 'Leave Auto-Approve', formTitle: 'Leave Request', trigger: 'Form Submitted', condition: 'Type = Casual AND days <= 2', action: 'Auto-approve + Email submitter', status: 'active', runs: 145, lastRun: '2024-12-13' },
  { id: 'w2', name: 'Onboarding Checklist', formTitle: 'Employee Onboarding', trigger: 'Form Approved', condition: 'Department = Engineering', action: 'Create IT tasks + Notify Slack', status: 'active', runs: 48, lastRun: '2024-12-14' },
  { id: 'w3', name: 'IT Asset Escalation', formTitle: 'IT Asset Request', trigger: 'Pending > 2 days', condition: 'Priority = High', action: 'Escalate to IT Manager', status: 'active', runs: 12, lastRun: '2024-12-10' },
  { id: 'w4', name: 'Vendor KYC Review', formTitle: 'Vendor Registration', trigger: 'Form Submitted', condition: 'Contract value > 5L', action: 'Route to Legal + Finance', status: 'paused', runs: 0, lastRun: 'N/A' },
  { id: 'w5', name: 'NPS Alert', formTitle: 'Client Feedback Survey', trigger: 'Score submitted', condition: 'NPS score <= 5', action: 'Alert CX Manager + follow-up task', status: 'active', runs: 23, lastRun: '2024-12-12' },
];

export const roles: AppRole[] = [
  { id: 'r1', name: 'Admin',    permissions: ['create', 'edit', 'delete', 'publish', 'manage_users', 'view_all'], users: 3  },
  { id: 'r2', name: 'Editor',   permissions: ['create', 'edit', 'publish', 'view_all'],                          users: 8  },
  { id: 'r3', name: 'Reviewer', permissions: ['view_all', 'approve', 'reject', 'comment'],                       users: 12 },
  { id: 'r4', name: 'Viewer',   permissions: ['view_assigned'],                                                   users: 47 },
];
