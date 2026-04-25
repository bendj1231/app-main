// Atlas Résumé Builder Types
// Aviation-specific standardized resume format

export type AviationRole = 'commercial' | 'cargo' | 'private' | 'corporate' | 'charter';

export type ResumeTemplate = 'modern' | 'classic' | 'executive' | 'technical';

export interface FlightHours {
  total: number;
  pic: number;
  sic: number;
  crossCountry: number;
  night: number;
  ifr: number;
  multiEngine: number;
  simulator: number;
  dualReceived: number;
}

export interface AircraftType {
  manufacturer: string;
  model: string;
  typeRating: boolean;
  hours: number;
  lastFlown?: Date;
}

export interface License {
  type: string; // e.g., ATPL, CPL, PPL
  number: string;
  issuingAuthority: string;
  issueDate: Date;
  expiryDate?: Date;
  status: 'valid' | 'expired' | 'suspended' | 'frozen';
  medicalClass?: string;
  medicalExpiry?: Date;
}

export interface Rating {
  type: string; // e.g., Instrument, Multi-Engine, Type Rating
  aircraftType?: string;
  issueDate: Date;
  expiryDate?: Date;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  aircraftTypes: string[];
  responsibilities: string[];
  achievements: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: Date;
  endDate: Date;
  gpa?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialNumber?: string;
}

export interface AtlasResumeData {
  id?: string;
  // Personal Information
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    nationality: string;
    dateOfBirth?: Date;
    languages: string[];
    linkedin?: string;
    website?: string;
  };

  // Professional Summary
  summary: string;

  // Flight Experience
  flightHours: FlightHours;

  // Aircraft Types
  aircraftTypes: AircraftType[];

  // Licenses & Ratings
  licenses: License[];
  ratings: Rating[];

  // Work Experience
  workExperience: WorkExperience[];

  // Education
  education: Education[];

  // Certifications
  certifications: Certification[];

  // Skills
  skills: string[];
  coreCompetencies: string[];

  // References
  references?: {
    name: string;
    title: string;
    company: string;
    email: string;
    phone: string;
  }[];

  // Template & Settings
  template: ResumeTemplate;
  targetRole: AviationRole;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastExportedAt?: Date;
  isCertified: boolean;
  certificationDate?: Date;
}

export interface ResumeAnalytics {
  resumeId: string;
  userId: string;
  views: number;
  downloads: number;
  shares: number;
  applications: number;
  lastViewedAt?: Date;
  lastDownloadedAt?: Date;
  airlinesViewed: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AtlasResumeShare {
  id: string;
  resumeId: string;
  userId: string;
  shareToken: string;
  shareUrl: string;
  expiresAt?: Date;
  isPublic: boolean;
  allowedAirlines?: string[];
  password?: string;
  createdAt: Date;
  accessCount: number;
  lastAccessedAt?: Date;
}
