export enum View {
  DASHBOARD = 'DASHBOARD',
  ABOUT_PROGRAMS = 'ABOUT_PROGRAMS',
  PROGRESS = 'PROGRESS',
  HANDBOOK = 'HANDBOOK',
  LOGS = 'LOGS',
  VERIFIED_LOGS = 'VERIFIED_LOGS',
  TOOLS = 'TOOLS',
  CONTACT = 'CONTACT',
  BROWSER = 'BROWSER',
  PILOT_APPS = 'PILOT_APPS',
  MENTOR_TOOLS = 'MENTOR_TOOLS',
  WELCOME_GUIDE = 'WELCOME_GUIDE',
  SETTINGS = 'SETTINGS',
  SIGN_IN = 'SIGN_IN',
  WEBSITE = 'WEBSITE',
  SUBSCRIPTION = 'SUBSCRIPTION'
}

export interface ProgramLogEntry {
  id: string;
  date: string;
  personName: string;
  description: string;
  duration: string;
  signature: string;
  isPilotRecognition: boolean;
  status: 'Verified' | 'Pending' | 'Rejected';
}
