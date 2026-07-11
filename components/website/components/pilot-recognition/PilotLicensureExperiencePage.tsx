/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import { useAuth0 } from '@auth0/auth0-react';
import { useVaultProfile } from '@/hooks/useVaultProfile';
import { useAccountTier } from '@/hooks/useAccountTier';
import {
  Search,
  HelpCircle,
  ChevronDown,
  Check,
  X,
  Lock,
  Shield,
  Plus,
  BookOpen,
  Zap,
  IdCard,
  Radio,
  Inbox,
  Globe,
} from 'lucide-react';
import { AircraftRatingsSearch } from './AircraftRatingsSearch';
import { EndorsementsSearch } from './EndorsementsSearch';

interface UploadedDoc {
  id: string;
  type: 'license' | 'medical' | 'rating' | 'logbook';
  fileName: string;
  fileSize: number;
  status: 'uploading' | 'processing' | 'verified' | 'pending_review';
  extractedData?: {
    licenseNumber?: string;
    expiryDate?: string;
    issuingAuthority?: string;
    medicalClass?: string;
  };
}

interface PilotLicensureExperiencePageProps {
  onBack: () => void;
  userProfile?: {
    id?: string;
    uid?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
  embedded?: boolean;
  visibleSection?:
    | 'personal'
    | 'license-medical'
    | 'aircraft-ratings'
    | 'endorsements'
    | 'experience-career';
  onNavigateSection?: (
    section:
      | 'personal'
      | 'license-medical'
      | 'aircraft-ratings'
      | 'endorsements'
      | 'experience-career'
  ) => void;
  onGetStarted?: () => void;
}

interface JobExperience {
  id: string;
  sector: 'aviation' | 'non-aviation';
  industry: string;
  company: string;
  position: string;
  fromDate: string;
  toDate: string;
  description: string;
}

interface AircraftRating {
  id: string;
  aircraftClass: string;
  aircraftType: string;
  manufacturer: string;
  model: string;
  tailNumber: string;
  ratingDate: string;
  isCurrent: boolean;
  lastFlown: string;
}

const OCCUPATION_OPTIONS = [
  { value: 'employed', label: 'Employed' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'open_to_changes', label: 'Open to Changes' },
  { value: 'looking_for_new_opportunities', label: 'Looking for New Opportunities' },
];

const LICENSE_TYPES = ['PPL', 'CPL', 'SPL', 'CFI', 'IR', 'ME', 'ATPL', 'ATPL Frozen'];

const MEDICAL_CLASSES = ['Class 1', 'Class 2', 'Class 3'];

const AVIATION_AUTHORITIES = [
  // A
  { country: 'Albania', authority: 'AAC Albania', fullName: 'Albanian Civil Aviation Authority' },
  {
    country: 'Algeria',
    authority: 'DACM',
    fullName: "Direction de l'Aviation Civile et de la Meteorologie",
  },
  { country: 'Angola', authority: 'INAVIC', fullName: 'National Institute of Civil Aviation' },
  {
    country: 'Antigua and Barbuda',
    authority: 'ABAA',
    fullName: 'Antigua and Barbuda Aviation Authority',
  },
  {
    country: 'Argentina',
    authority: 'ANAC Argentina',
    fullName: 'National Civil Aviation Administration',
  },
  { country: 'Armenia', authority: 'CAA Armenia', fullName: 'Civil Aviation Committee of Armenia' },
  { country: 'Australia', authority: 'CASA', fullName: 'Civil Aviation Safety Authority' },
  { country: 'Austria', authority: 'ACA Austria', fullName: 'Austrian Civil Aviation Authority' },
  // B
  { country: 'Bahamas', authority: 'BCAA', fullName: 'Bahamas Civil Aviation Authority' },
  { country: 'Bahrain', authority: 'CAA Bahrain', fullName: 'Civil Aviation Affairs' },
  { country: 'Bangladesh', authority: 'CAAB', fullName: 'Civil Aviation Authority of Bangladesh' },
  { country: 'Barbados', authority: 'CAA Barbados', fullName: 'Civil Aviation Department' },
  { country: 'Belarus', authority: 'CAA Belarus', fullName: 'Department for Aviation' },
  { country: 'Belgium', authority: 'BCAA', fullName: 'Belgian Civil Aviation Authority' },
  { country: 'Belize', authority: 'BCAD', fullName: 'Belize Civil Aviation Department' },
  { country: 'Benin', authority: 'ANAC Benin', fullName: "Agence Nationale de l'Aviation Civile" },
  { country: 'Bermuda', authority: 'DCA Bermuda', fullName: 'Department of Civil Aviation' },
  { country: 'Bhutan', authority: 'DoAT Bhutan', fullName: 'Department of Air Transport' },
  {
    country: 'Bolivia',
    authority: 'DGAC Bolivia',
    fullName: 'Direccion General de Aeronautica Civil',
  },
  {
    country: 'Bosnia and Herzegovina',
    authority: 'BHDCA',
    fullName: 'Directorate of Civil Aviation',
  },
  { country: 'Botswana', authority: 'CAAB', fullName: 'Civil Aviation Authority of Botswana' },
  { country: 'Brazil', authority: 'ANAC', fullName: 'National Civil Aviation Agency' },
  { country: 'Brunei', authority: 'DCA Brunei', fullName: 'Department of Civil Aviation' },
  { country: 'Bulgaria', authority: 'CAA Bulgaria', fullName: 'Civil Aviation Administration' },
  {
    country: 'Burkina Faso',
    authority: 'ANAC BF',
    fullName: "Agence Nationale de l'Aviation Civile",
  },
  {
    country: 'Burundi',
    authority: 'OGAC Burundi',
    fullName: 'Office de Gestion et de Contrôle des Aéronefs',
  },
  // C
  { country: 'Cambodia', authority: 'SSCA', fullName: 'State Secretariat of Civil Aviation' },
  { country: 'Cameroon', authority: 'CCAA', fullName: 'Cameroon Civil Aviation Authority' },
  { country: 'Canada', authority: 'TC Canada', fullName: 'Transport Canada' },
  { country: 'Cape Verde', authority: 'IAC Cape Verde', fullName: 'Instituto de Aviação Civil' },
  {
    country: 'Cayman Islands',
    authority: 'CAACI',
    fullName: 'Civil Aviation Authority of the Cayman Islands',
  },
  {
    country: 'Central African Republic',
    authority: 'DGAC CAR',
    fullName: "Direction Generale de l'Aviation Civile",
  },
  { country: 'Chad', authority: 'ANAC Chad', fullName: "Agence Nationale de l'Aviation Civile" },
  { country: 'Chile', authority: 'DGAC Chile', fullName: 'Direccion General de Aeronautica Civil' },
  { country: 'China', authority: 'CAAC', fullName: 'Civil Aviation Administration of China' },
  {
    country: 'Colombia',
    authority: 'Aerocivil',
    fullName: 'Unidad Administrativa Especial de Aeronautica Civil',
  },
  {
    country: 'Comoros',
    authority: 'ANAC Comoros',
    fullName: "Agence Nationale de l'Aviation Civile",
  },
  { country: 'Congo', authority: 'ANAC Congo', fullName: "Autorite de l'Aviation Civile" },
  { country: 'Congo DRC', authority: 'RVA DRC', fullName: 'Regie des Voies Aériennes' },
  { country: 'Costa Rica', authority: 'DGAC CR', fullName: 'Direccion General de Aviacion Civil' },
  { country: 'Croatia', authority: 'CCAA', fullName: 'Croatian Civil Aviation Agency' },
  { country: 'Cuba', authority: 'IACC', fullName: 'Instituto de Aeronautica Civil de Cuba' },
  { country: 'Cyprus', authority: 'DCA Cyprus', fullName: 'Department of Civil Aviation' },
  { country: 'Czech Republic', authority: 'CAA Czech', fullName: 'Civil Aviation Authority' },
  // D
  { country: 'Denmark', authority: 'Trafikstyrelsen', fullName: 'Danish Transport Authority' },
  {
    country: 'Djibouti',
    authority: 'ANAC Djibouti',
    fullName: "Agence Nationale de l'Aviation Civile",
  },
  { country: 'Dominica', authority: 'CAD Dominica', fullName: 'Civil Aviation Department' },
  {
    country: 'Dominican Republic',
    authority: 'IDAC',
    fullName: 'Instituto Dominicano de Aviacion Civil',
  },
  // E
  {
    country: 'Ecuador',
    authority: 'DGAC Ecuador',
    fullName: 'Direccion General de Aviacion Civil',
  },
  { country: 'Egypt', authority: 'ECAA', fullName: 'Egyptian Civil Aviation Authority' },
  { country: 'El Salvador', authority: 'CAA El Salvador', fullName: 'Civil Aviation Authority' },
  {
    country: 'Equatorial Guinea',
    authority: 'DGAC EG',
    fullName: 'Direccion General de Aviacion Civil',
  },
  { country: 'Eritrea', authority: 'DCA Eritrea', fullName: 'Department of Civil Aviation' },
  { country: 'Estonia', authority: 'CAA Estonia', fullName: 'Civil Aviation Administration' },
  { country: 'Eswatini', authority: 'CAA Eswatini', fullName: 'Civil Aviation Authority' },
  { country: 'Ethiopia', authority: 'ECAA', fullName: 'Ethiopian Civil Aviation Authority' },
  {
    country: 'European Union',
    authority: 'EASA',
    fullName: 'European Union Aviation Safety Agency',
  },
  // F
  { country: 'Fiji', authority: 'CAA Fiji', fullName: 'Civil Aviation Authority of Fiji' },
  {
    country: 'Finland',
    authority: 'Trafi',
    fullName: 'Finnish Transport and Communications Agency',
  },
  {
    country: 'France',
    authority: 'DGAC France',
    fullName: "Direction Generale de l'Aviation Civile",
  },
  // G
  { country: 'Gabon', authority: 'ANAC Gabon', fullName: "Agence Nationale de l'Aviation Civile" },
  { country: 'Gambia', authority: 'GCAA Gambia', fullName: 'Gambia Civil Aviation Authority' },
  { country: 'Georgia', authority: 'GCAA Georgia', fullName: 'Georgian Civil Aviation Agency' },
  { country: 'Germany', authority: 'LBA', fullName: 'Federal Aviation Office' },
  { country: 'Ghana', authority: 'GCAA', fullName: 'Ghana Civil Aviation Authority' },
  { country: 'Greece', authority: 'HCAA', fullName: 'Hellenic Civil Aviation Authority' },
  { country: 'Grenada', authority: 'CAD Grenada', fullName: 'Civil Aviation Division' },
  {
    country: 'Guatemala',
    authority: 'DGAC Guatemala',
    fullName: 'Direccion General de Aeronautica Civil',
  },
  {
    country: 'Guinea',
    authority: 'ANAC Guinea',
    fullName: "Agence Nationale de l'Aviation Civile",
  },
  {
    country: 'Guinea-Bissau',
    authority: 'ANAC GB',
    fullName: 'Autoridade Nacional da Aviacao Civil',
  },
  { country: 'Guyana', authority: 'GCAA Guyana', fullName: 'Guyana Civil Aviation Authority' },
  // H
  { country: 'Haiti', authority: 'OFNAC Haiti', fullName: "Office National de l'Aviation Civile" },
  {
    country: 'Honduras',
    authority: 'DGAC Honduras',
    fullName: 'Direccion General de Aeronautica Civil',
  },
  { country: 'Hong Kong', authority: 'CAD HK', fullName: 'Civil Aviation Department' },
  { country: 'Hungary', authority: 'CAA Hungary', fullName: 'Civil Aviation Authority' },
  // I
  { country: 'Iceland', authority: 'ICETRA', fullName: 'Icelandic Transport Authority' },
  {
    country: 'India',
    authority: 'DGCA India',
    fullName: 'Directorate General of Civil Aviation (India)',
  },
  { country: 'Indonesia', authority: 'DGCA', fullName: 'Directorate General of Civil Aviation' },
  { country: 'Iran', authority: 'CAO Iran', fullName: 'Civil Aviation Organization' },
  { country: 'Iraq', authority: 'ICAO Iraq', fullName: 'Iraqi Civil Aviation Authority' },
  { country: 'Ireland', authority: 'IAA', fullName: 'Irish Aviation Authority' },
  { country: 'Israel', authority: 'CAAI', fullName: 'Civil Aviation Authority of Israel' },
  { country: 'Italy', authority: 'ENAC', fullName: "Ente Nazionale per l'Aviazione Civile" },
  // J
  { country: 'Jamaica', authority: 'JCAA', fullName: 'Jamaica Civil Aviation Authority' },
  { country: 'Japan', authority: 'JCAB', fullName: 'Japan Civil Aviation Bureau' },
  { country: 'Jordan', authority: 'CARC', fullName: 'Civil Aviation Regulatory Commission' },
  // K
  { country: 'Kazakhstan', authority: 'AAK', fullName: 'Aviation Administration of Kazakhstan' },
  { country: 'Kenya', authority: 'KCAA', fullName: 'Kenya Civil Aviation Authority' },
  { country: 'Kiribati', authority: 'CAA Kiribati', fullName: 'Civil Aviation Authority' },
  {
    country: 'Kuwait',
    authority: 'DGCA Kuwait',
    fullName: 'Directorate General of Civil Aviation',
  },
  { country: 'Kyrgyzstan', authority: 'CAA Kyrgyzstan', fullName: 'Civil Aviation Agency' },
  // L
  { country: 'Laos', authority: 'DCA Laos', fullName: 'Department of Civil Aviation' },
  { country: 'Latvia', authority: 'CAA Latvia', fullName: 'Civil Aviation Agency' },
  {
    country: 'Lebanon',
    authority: 'DGCA Lebanon',
    fullName: 'Directorate General of Civil Aviation',
  },
  { country: 'Lesotho', authority: 'DCA Lesotho', fullName: 'Department of Civil Aviation' },
  { country: 'Liberia', authority: 'LCAA', fullName: 'Liberia Civil Aviation Authority' },
  { country: 'Libya', authority: 'LYCAA', fullName: 'Libyan Civil Aviation Authority' },
  { country: 'Lithuania', authority: 'CAA Lithuania', fullName: 'Civil Aviation Administration' },
  {
    country: 'Luxembourg',
    authority: 'DAC Luxembourg',
    fullName: "Direction de l'Aviation Civile",
  },
  // M
  {
    country: 'Madagascar',
    authority: 'ACM Madagascar',
    fullName: "Autorite de l'Aviation Civile de Madagascar",
  },
  { country: 'Malawi', authority: 'DCA Malawi', fullName: 'Department of Civil Aviation' },
  { country: 'Malaysia', authority: 'CAAM', fullName: 'Civil Aviation Authority of Malaysia' },
  { country: 'Maldives', authority: 'CAA Maldives', fullName: 'Civil Aviation Authority' },
  { country: 'Mali', authority: 'ANAC Mali', fullName: "Agence Nationale de l'Aviation Civile" },
  { country: 'Malta', authority: 'TM-CAD', fullName: 'Transport Malta Civil Aviation Directorate' },
  {
    country: 'Marshall Islands',
    authority: 'RMI CAA',
    fullName: 'Republic of the Marshall Islands CAA',
  },
  {
    country: 'Mauritania',
    authority: 'ANAC Mauritania',
    fullName: "Agence Nationale de l'Aviation Civile",
  },
  { country: 'Mauritius', authority: 'CAD', fullName: 'Civil Aviation Department' },
  {
    country: 'Mexico',
    authority: 'DGAC Mexico',
    fullName: 'Directorate General of Civil Aeronautics',
  },
  { country: 'Micronesia', authority: 'FSM CAA', fullName: 'Federated States of Micronesia CAA' },
  { country: 'Moldova', authority: 'CAA Moldova', fullName: 'Civil Aviation Authority' },
  { country: 'Monaco', authority: 'DCA Monaco', fullName: "Direction de l'Aviation Civile" },
  { country: 'Mongolia', authority: 'MCAA', fullName: 'Mongolian Civil Aviation Authority' },
  { country: 'Montenegro', authority: 'CAA Montenegro', fullName: 'Civil Aviation Authority' },
  { country: 'Morocco', authority: 'CAA Morocco', fullName: 'Civil Aviation Authority' },
  {
    country: 'Mozambique',
    authority: 'IACM',
    fullName: 'Instituto de Aviacao Civil de Mocambique',
  },
  { country: 'Myanmar', authority: 'DCA Myanmar', fullName: 'Department of Civil Aviation' },
  // N
  { country: 'Namibia', authority: 'DCA Namibia', fullName: 'Directorate of Civil Aviation' },
  { country: 'Nauru', authority: 'CAA Nauru', fullName: 'Civil Aviation Authority' },
  { country: 'Nepal', authority: 'CAAN', fullName: 'Civil Aviation Authority of Nepal' },
  {
    country: 'Netherlands',
    authority: 'ILT',
    fullName: 'Human Environment and Transport Inspectorate',
  },
  {
    country: 'New Zealand',
    authority: 'CAA NZ',
    fullName: 'Civil Aviation Authority of New Zealand',
  },
  {
    country: 'Nicaragua',
    authority: 'INAC Nicaragua',
    fullName: 'Instituto Nicaragüense de Aeronautica Civil',
  },
  { country: 'Niger', authority: 'ANAC Niger', fullName: "Agence Nationale de l'Aviation Civile" },
  { country: 'Nigeria', authority: 'NCAA', fullName: 'Nigerian Civil Aviation Authority' },
  { country: 'North Macedonia', authority: 'CAA NMK', fullName: 'Civil Aviation Agency' },
  { country: 'Norway', authority: 'CAA Norway', fullName: 'Civil Aviation Authority of Norway' },
  // O
  { country: 'Oman', authority: 'PACA', fullName: 'Public Authority for Civil Aviation' },
  // P
  { country: 'Pakistan', authority: 'CAA Pakistan', fullName: 'Civil Aviation Authority' },
  { country: 'Palau', authority: 'CAA Palau', fullName: 'Civil Aviation Authority' },
  { country: 'Panama', authority: 'AAC Panama', fullName: 'Autoridad Aeronautica Civil' },
  {
    country: 'Papua New Guinea',
    authority: 'CASAPNG',
    fullName: 'Civil Aviation Safety Authority PNG',
  },
  {
    country: 'Paraguay',
    authority: 'DINAC Paraguay',
    fullName: 'Direccion Nacional de Aeronautica Civil',
  },
  { country: 'Peru', authority: 'DGAC Peru', fullName: 'Direccion General de Aeronautica Civil' },
  {
    country: 'Philippines',
    authority: 'CAAP',
    fullName: 'Civil Aviation Authority of the Philippines',
  },
  { country: 'Poland', authority: 'ULC', fullName: 'Civil Aviation Authority of Poland' },
  {
    country: 'Portugal',
    authority: 'ANAC Portugal',
    fullName: 'Autoridade Nacional da Aviacao Civil',
  },
  // Q
  { country: 'Qatar', authority: 'CAA Qatar', fullName: 'Civil Aviation Authority' },
  // R
  { country: 'Romania', authority: 'RCAA', fullName: 'Romanian Civil Aeronautical Authority' },
  { country: 'Russia', authority: 'Rosaviatsia', fullName: 'Federal Air Transport Agency' },
  { country: 'Rwanda', authority: 'RCAA', fullName: 'Rwanda Civil Aviation Authority' },
  // S
  {
    country: 'Saint Kitts and Nevis',
    authority: 'SCAA',
    fullName: 'Saint Kitts and Nevis Civil Aviation',
  },
  {
    country: 'Saint Lucia',
    authority: 'SLASPA',
    fullName: 'Saint Lucia Air and Sea Ports Authority',
  },
  {
    country: 'Saint Vincent',
    authority: 'SVGAA',
    fullName: 'Saint Vincent and the Grenadines CAA',
  },
  { country: 'Samoa', authority: 'SAA Samoa', fullName: 'Samoa Airport Authority' },
  { country: 'Sao Tome and Principe', authority: 'IASTP', fullName: 'Instituto de Aviacao Civil' },
  { country: 'Saudi Arabia', authority: 'GACA', fullName: 'General Authority of Civil Aviation' },
  {
    country: 'Senegal',
    authority: 'ANAC Senegal',
    fullName: "Agence Nationale de l'Aviation Civile",
  },
  { country: 'Serbia', authority: 'CAD Serbia', fullName: 'Civil Aviation Directorate' },
  { country: 'Seychelles', authority: 'SCAA', fullName: 'Seychelles Civil Aviation Authority' },
  {
    country: 'Sierra Leone',
    authority: 'SLCAA',
    fullName: 'Sierra Leone Civil Aviation Authority',
  },
  { country: 'Singapore', authority: 'CAAS', fullName: 'Civil Aviation Authority of Singapore' },
  { country: 'Slovakia', authority: 'CAA Slovakia', fullName: 'Civil Aviation Authority' },
  { country: 'Slovenia', authority: 'CAA Slovenia', fullName: 'Civil Aviation Agency' },
  {
    country: 'Solomon Islands',
    authority: 'CAASI',
    fullName: 'Civil Aviation Authority of Solomon Islands',
  },
  {
    country: 'Somalia',
    authority: 'Somaliland CAA',
    fullName: 'Civil Aviation and Airport Authority',
  },
  {
    country: 'South Africa',
    authority: 'SACAA',
    fullName: 'South African Civil Aviation Authority',
  },
  {
    country: 'South Korea',
    authority: 'MOLIT',
    fullName: 'Ministry of Land, Infrastructure and Transport',
  },
  { country: 'South Sudan', authority: 'SSCA', fullName: 'South Sudan Civil Aviation Authority' },
  { country: 'Spain', authority: 'AESA', fullName: 'State Aviation Safety Agency' },
  { country: 'Sri Lanka', authority: 'CAASL', fullName: 'Civil Aviation Authority of Sri Lanka' },
  { country: 'Sudan', authority: 'SCAA', fullName: 'Sudan Civil Aviation Authority' },
  { country: 'Suriname', authority: 'CAD Suriname', fullName: 'Civil Aviation Department' },
  { country: 'Sweden', authority: 'STA Sweden', fullName: 'Swedish Transport Agency' },
  { country: 'Switzerland', authority: 'FOCA', fullName: 'Federal Office of Civil Aviation' },
  { country: 'Syria', authority: 'SCA Syria', fullName: 'Syrian Civil Aviation Authority' },
  // T
  { country: 'Taiwan', authority: 'CAA Taiwan', fullName: 'Civil Aeronautics Administration' },
  {
    country: 'Tajikistan',
    authority: 'Tajik CAA',
    fullName: 'Tajikistan Civil Aviation Authority',
  },
  { country: 'Tanzania', authority: 'TCAA', fullName: 'Tanzania Civil Aviation Authority' },
  { country: 'Thailand', authority: 'DCA Thailand', fullName: 'Department of Civil Aviation' },
  {
    country: 'Timor-Leste',
    authority: 'CIVTL',
    fullName: 'Civil Aviation Authority of Timor-Leste',
  },
  { country: 'Togo', authority: 'ANAC Togo', fullName: "Agence Nationale de l'Aviation Civile" },
  { country: 'Tonga', authority: 'DCA Tonga', fullName: 'Ministry of Civil Aviation' },
  {
    country: 'Trinidad and Tobago',
    authority: 'TTCAA',
    fullName: 'Trinidad and Tobago Civil Aviation Authority',
  },
  {
    country: 'Tunisia',
    authority: 'OACA',
    fullName: "Office de l'Aviation Civile et des Aeroports",
  },
  {
    country: 'Turkey',
    authority: 'DGCA Turkey',
    fullName: 'Directorate General of Civil Aviation',
  },
  { country: 'Turkmenistan', authority: 'CAA Turkmenistan', fullName: 'Civil Aviation Agency' },
  { country: 'Tuvalu', authority: 'CAA Tuvalu', fullName: 'Civil Aviation Authority' },
  // U
  { country: 'Uganda', authority: 'UCAA', fullName: 'Uganda Civil Aviation Authority' },
  {
    country: 'Ukraine',
    authority: 'SACA Ukraine',
    fullName: 'State Aviation Administration of Ukraine',
  },
  {
    country: 'United Arab Emirates',
    authority: 'GCAA',
    fullName: 'General Civil Aviation Authority',
  },
  { country: 'United Kingdom', authority: 'CAA UK', fullName: 'Civil Aviation Authority (UK)' },
  { country: 'United States', authority: 'FAA', fullName: 'Federal Aviation Administration' },
  {
    country: 'Uruguay',
    authority: 'DINACIA',
    fullName: 'Direccion Nacional de Aviacion Civil e Infraestructura Aeronautica',
  },
  { country: 'Uzbekistan', authority: 'CAA Uzbekistan', fullName: 'Civil Aviation Agency' },
  // V
  { country: 'Vanuatu', authority: 'CAA Vanuatu', fullName: 'Civil Aviation Authority' },
  { country: 'Vatican City', authority: 'Vatican CAA', fullName: 'Vatican Aviation Authority' },
  {
    country: 'Venezuela',
    authority: 'INAC Venezuela',
    fullName: 'National Institute of Civil Aeronautics',
  },
  { country: 'Vietnam', authority: 'CAA Vietnam', fullName: 'Civil Aviation Authority of Vietnam' },
  // Y
  {
    country: 'Yemen',
    authority: 'CAA Yemen',
    fullName: 'Civil Aviation and Meteorology Authority',
  },
  // Z
  { country: 'Zambia', authority: 'DCA Zambia', fullName: 'Department of Civil Aviation' },
  {
    country: 'Zimbabwe',
    authority: 'CAA Zimbabwe',
    fullName: 'Civil Aviation Authority of Zimbabwe',
  },
  { country: 'Other', authority: 'Other', fullName: 'Not listed above' },
];

const COMMON_AIRCRAFT = [
  'Airbus A320',
  'Airbus A330',
  'Airbus A350',
  'Airbus A380',
  'Boeing 737',
  'Boeing 747',
  'Boeing 757',
  'Boeing 767',
  'Boeing 777',
  'Boeing 787',
  'Embraer E170/E175',
  'Embraer E190/E195',
  'Bombardier CRJ200/700/900',
  'ATR 42/72',
  'Cessna 172',
  'Cessna 208',
  'Cessna Citation',
  'Piper PA-28',
  'Piper PA-34',
  'Diamond DA40',
  'Diamond DA42',
  'Beechcraft King Air',
  'Other',
];

const TYPE_RATING_CENTERS = [
  'Airbus Training Centre Europe (Toulouse)',
  'Airbus Training Center Americas (Miami)',
  'Airbus Training Center Asia Pacific (Singapore)',
  'Boeing Flight Services (Miami)',
  'Boeing Flight Services (Seattle)',
  'Boeing Flight Services (Dubai)',
  'Boeing Flight Services (Shanghai)',
  'CAE Oxford Aviation Academy',
  'CAE Dallas/Fort Worth',
  'CAE Phoenix',
  'CAE Montreal',
  'CAE Madrid',
  'L3Harris Airline Academy (UK)',
  'L3Harris Airline Academy (Florida)',
  'L3Harris Training Center (New Zealand)',
  'FlightSafety International (Vero Beach)',
  'FlightSafety International (Long Beach)',
  'FlightSafety International (Paris)',
  'FlightSafety International (St. Louis)',
  'Pan AM International Flight Academy',
  'ATP Flight School',
  'American Flyers',
  'Sheffield School of Aeronautics',
  'Embry-Riddle Aeronautical University',
  'University of North Dakota',
  'Purdue University Aviation',
  'University of Oklahoma Aviation',
  'Western Michigan University',
  'Aerosim Flight Academy',
  'Other',
];

const AIRCRAFT_CLASSES = [
  'Single Engine Land (SEL)',
  'Multi-Engine Land (MEL)',
  'Single Engine Sea (SES)',
  'Multi-Engine Sea (MES)',
  'Helicopter',
  'Other',
];

const AIRCRAFT_MANUFACTURERS = [
  'Airbus',
  'Boeing',
  'Cessna',
  'Piper',
  'Diamond',
  'Beechcraft',
  'Embraer',
  'Bombardier',
  'ATR',
  'Tecnam',
  'Cirrus',
  'Mooney',
  'Other',
];

const MANUFACTURER_MODELS: Record<string, string[]> = {
  Airbus: [
    'A320',
    'A321',
    'A330-200',
    'A330-300',
    'A350-900',
    'A350-1000',
    'A380',
    'A318',
    'A319',
    'A340-300',
    'A340-600',
  ],
  Boeing: [
    '737-700',
    '737-800',
    '737-900',
    '747-400',
    '747-8',
    '757-200',
    '767-300',
    '777-200',
    '777-300',
    '787-8',
    '787-9',
    '787-10',
  ],
  Cessna: [
    '172 Skyhawk',
    '182 Skylane',
    '206 Stationair',
    '208 Caravan',
    'Citation CJ3',
    'Citation X',
    'Citation Latitude',
  ],
  Piper: [
    'PA-28 Cherokee',
    'PA-28 Arrow',
    'PA-34 Seneca',
    'PA-44 Seminole',
    'PA-46 Malibu',
    'M350',
    'M500',
    'M600',
  ],
  Diamond: ['DA40 NG', 'DA42 Twin Star', 'DA62', 'DA50 RG'],
  Beechcraft: [
    'King Air 200',
    'King Air 350',
    'Baron G58',
    'Bonanza G36',
    'Premier I',
    'Hawker 400XP',
  ],
  Embraer: [
    'E170',
    'E175',
    'E190',
    'E195',
    'Phenom 100',
    'Phenom 300',
    'Praetor 500',
    'Praetor 600',
    'Legacy 450',
    'Legacy 500',
  ],
  Bombardier: [
    'CRJ200',
    'CRJ700',
    'CRJ900',
    'CRJ1000',
    'Global 5000',
    'Global 6000',
    'Global 7500',
    'Challenger 300',
    'Challenger 350',
  ],
  ATR: ['ATR 42-600', 'ATR 72-600', 'ATR 72-500'],
  Tecnam: ['P2008 JC', 'P2010', 'P2006T', 'P92 Echo', 'Astore'],
  Cirrus: ['SR20', 'SR22', 'SR22T', 'SF50 Vision Jet'],
  Mooney: ['M20V Acclaim Ultra', 'M20U Ovation Ultra', 'M20TN Acclaim'],
  Other: ['Other'],
};

const MANUFACTURER_LOGOS: Record<string, string> = {
  Airbus: '/images/manufacturer-logos/commercial-jets/airbus-logo.svg',
  Boeing: '/images/manufacturer-logos/commercial-jets/boeing-logo.svg',
  Cessna: '/images/manufacturer-logos/business-private-jets/cessna-logo.svg',
  Piper: '/images/manufacturer-logos/general-aviation/piper-logo.svg',
  Diamond: '',
  Beechcraft: '/images/manufacturer-logos/business-private-jets/beechcraft-logo.svg',
  Embraer: '/images/manufacturer-logos/regional-aircraft/embraer-logo.svg',
  Bombardier: '/images/manufacturer-logos/regional-aircraft/bombardier-logo.svg',
  ATR: '/images/manufacturer-logos/regional-aircraft/atr-logo.svg',
  Tecnam: '/images/manufacturer-logos/general-aviation/tecnam-logo.svg',
  Cirrus: '/images/manufacturer-logos/general-aviation/cirrus-logo.png',
  Mooney: '/images/manufacturer-logos/general-aviation/mooney-logo.png',
};

const getManufacturerLogo = (name: string) => MANUFACTURER_LOGOS[name] || '';

const LANGUAGES = [
  'English',
  'Arabic',
  'French',
  'Spanish',
  'German',
  'Italian',
  'Portuguese',
  'Russian',
  'Chinese (Mandarin)',
  'Japanese',
  'Hindi',
  'Urdu',
  'Turkish',
  'Other',
];

const NATIONALITIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bahrain',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo',
  'Congo, Democratic Republic of the',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Cyprus',
  'Czech Republic',
  "Côte d'Ivoire",
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'Egypt',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hong Kong',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Iran',
  'Iraq',
  'Ireland',
  'Israel',
  'Italy',
  'Jamaica',
  'Japan',
  'Jordan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Kuwait',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lebanon',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia, Federated States of',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Korea',
  'North Macedonia',
  'Norway',
  'Oman',
  'Pakistan',
  'Palau',
  'Palestine',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Qatar',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'Sao Tome and Principe',
  'Saudi Arabia',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Korea',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Syria',
  'Taiwan',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkey',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Arab Emirates',
  'United Kingdom',
  'United States of America',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Yemen',
  'Zambia',
  'Zimbabwe',
];

const FLIGHT_SCHOOLS_BY_COUNTRY: Record<string, string[]> = {
  Philippines: [
    'WCC Aviation',
    'SkyDive Academy',
    'Orient Flights',
    'First Aviation Academy',
    'APC Aviation',
    'AAA Academy',
    'Aero Equation Aviation',
    'Airworks Aviation',
    'Alpha Aviation',
    'Leading Edge Aviation',
  ],
  'United States of America': [
    'Embry-Riddle Aeronautical University',
    'University of North Dakota',
    'Purdue University Aviation',
    'Ohio State University Aviation',
    'Spartan College of Aeronautics',
    'FlightSafety Academy',
    'ATP Flight School',
    'American Flyers',
    'Phoenix East Aviation',
    'L3Harris Airline Academy',
  ],
  'United Kingdom': [
    'CAE Oxford Aviation Academy',
    'L3Harris Airline Academy UK',
    'FTA Global',
    'Diamond Flight Centre',
    'Skyborne Airline Academy',
    'BRAviation',
    'Stapleford Flight Centre',
  ],
  Australia: [
    'BAe Systems Flight Training',
    'AFT Aviation',
    'Flight Training Adelaide',
    'Basair Aviation College',
    'Soar Aviation',
    'Aero Club Western Australia',
    'Kingfisher Aviation',
    'CAE Oxford Aviation Academy Australia',
  ],
  'New Zealand': [
    'New Zealand Flying School',
    'Mainland Air',
    'Southern Wings',
    'International Aviation Academy',
    'Canterbury Aero Club',
    'Mount Cook Airline Training',
    "Air Hawke's Bay",
  ],
  'South Africa': [
    '43 Air School',
    'Cranfield Aviation Training',
    'Blue Chip Flight School',
    'Eagle Flight Academy',
    'Progress Flight Academy',
    'Cape Town Flight Training Centre',
  ],
  Canada: [
    'Montair Aviation',
    "Harv's Air",
    'Spectrum Airways',
    'Pacific Rim Aviation Academy',
    'Canadian Flight Centre',
    'Seneca College Aviation',
    'Canadore College Aviation',
    'Coast Flight Centre',
  ],
  Spain: [
    'FTE Jerez',
    'CAE Global Academy',
    'FlyBy Aviation Academy',
    'Aeroflota Flight School',
    'European Flyers',
    'Top Fly',
    'Barcelona Flight School',
  ],
  France: [
    "ENAC (École Nationale de l'Aviation Civile)",
    'ISAE-SUPAERO',
    'Airways Aviation',
    "L'Etoile Flight School",
    'Chalair Aviation Academy',
  ],
  Germany: [
    'Lufthansa Aviation Training',
    'European Aviation School',
    'Rheinland Air Service',
    'F AIR Flight School',
    'Air Alliance Flight School',
  ],
  India: [
    'Indira Gandhi Rashtriya Uran Akademi',
    'Chimes Aviation Academy',
    'Flight Cube Aviation',
    'Madras Flying Club',
    'Bombay Flying Club',
    'Ahmedabad Aviation Academy',
    'Rajiv Gandhi Academy',
  ],
  Singapore: [
    'Singapore Flying College',
    'ST Aerospace Academy',
    'Singapore Aviation Academy',
    'Seletar Flying Club',
  ],
  Malaysia: [
    'HM Aerospace',
    'Malaysia Flying Academy',
    'Asia Pacific Flight Training',
    'Borneo Airways Flying School',
    'Elite Flying School',
  ],
  Thailand: [
    'Thai Aviation Academy',
    'Bangkok Aviation Centre',
    'Phuket Flying Club',
    'Chiang Mai Flying Club',
  ],
  'United Arab Emirates': [
    'Emirates Flight Training Academy',
    'Etihad Aviation Training',
    'Alpha Aviation Academy UAE',
    'Gulf Aviation Academy',
  ],
  'Saudi Arabia': [
    'Saudi Aviation Flight Academy',
    'Prince Sultan Aviation Academy',
    'Saudi Aramco Aviation',
  ],
  Mauritius: ['SkyDive Mauritius Academy', 'Air Mauritius Training Centre'],
  Other: ['Other / Not Listed'],
};

const OPERATORS_BY_COUNTRY: Record<string, { name: string; type: string }[]> = {
  Philippines: [
    { name: 'Cebu Pacific', type: 'Airline' },
    { name: 'Philippine Airlines', type: 'Airline' },
    { name: 'PAL Express', type: 'Airline' },
    { name: 'AirAsia Philippines', type: 'Airline' },
    { name: 'Skyjet', type: 'Airline' },
    { name: 'Air Juan', type: 'Airline' },
    { name: 'CebGo', type: 'Airline' },
    { name: 'WCC Aviation', type: 'ATO' },
    { name: 'Orient Flights', type: 'ATO' },
    { name: 'AAA Academy', type: 'ATO' },
    { name: 'APC Aviation', type: 'ATO' },
  ],
  'United States of America': [
    { name: 'Delta Air Lines', type: 'Airline' },
    { name: 'American Airlines', type: 'Airline' },
    { name: 'United Airlines', type: 'Airline' },
    { name: 'Southwest Airlines', type: 'Airline' },
    { name: 'FedEx Express', type: 'Airline' },
    { name: 'UPS Airlines', type: 'Airline' },
    { name: 'JetBlue', type: 'Airline' },
    { name: 'Alaska Airlines', type: 'Airline' },
    { name: 'Spirit Airlines', type: 'Airline' },
    { name: 'NetJets', type: 'Operator' },
    { name: 'Flexjet', type: 'Operator' },
    { name: 'CAE USA', type: 'Type Rating Center' },
    { name: 'FlightSafety International', type: 'Type Rating Center' },
    { name: 'ATP Flight School', type: 'ATO' },
    { name: 'L3Harris', type: 'Type Rating Center' },
  ],
  'United Kingdom': [
    { name: 'British Airways', type: 'Airline' },
    { name: 'EasyJet', type: 'Airline' },
    { name: 'Virgin Atlantic', type: 'Airline' },
    { name: 'TUI Airways', type: 'Airline' },
    { name: 'Jet2', type: 'Airline' },
    { name: 'Ryanair UK', type: 'Airline' },
    { name: 'CAE Oxford', type: 'Type Rating Center' },
    { name: 'L3Harris UK', type: 'Type Rating Center' },
    { name: 'FTA Global', type: 'ATO' },
    { name: 'Skyborne Airline Academy', type: 'ATO' },
  ],
  Australia: [
    { name: 'Qantas', type: 'Airline' },
    { name: 'Virgin Australia', type: 'Airline' },
    { name: 'Jetstar', type: 'Airline' },
    { name: 'Rex Airlines', type: 'Airline' },
    { name: 'Alliance Airlines', type: 'Airline' },
    { name: 'BAe Systems Flight Training', type: 'ATO' },
    { name: 'Flight Training Adelaide', type: 'ATO' },
    { name: 'Soar Aviation', type: 'ATO' },
  ],
  'New Zealand': [
    { name: 'Air New Zealand', type: 'Airline' },
    { name: 'Mainland Air', type: 'Airline' },
    { name: 'Southern Wings', type: 'ATO' },
    { name: 'International Aviation Academy', type: 'ATO' },
  ],
  'United Arab Emirates': [
    { name: 'Emirates', type: 'Airline' },
    { name: 'Etihad Airways', type: 'Airline' },
    { name: 'Air Arabia', type: 'Airline' },
    { name: 'flydubai', type: 'Airline' },
    { name: 'Emirates Flight Training Academy', type: 'ATO' },
    { name: 'Gulf Aviation Academy', type: 'Type Rating Center' },
    { name: 'Alpha Aviation Academy UAE', type: 'ATO' },
  ],
  'Saudi Arabia': [
    { name: 'Saudia', type: 'Airline' },
    { name: 'flynas', type: 'Airline' },
    { name: 'flyadeal', type: 'Airline' },
    { name: 'Saudi Aramco Aviation', type: 'Operator' },
    { name: 'Saudi Aviation Flight Academy', type: 'ATO' },
    { name: 'Prince Sultan Aviation Academy', type: 'ATO' },
  ],
  Canada: [
    { name: 'Air Canada', type: 'Airline' },
    { name: 'WestJet', type: 'Airline' },
    { name: 'Sunwing', type: 'Airline' },
    { name: 'Porter Airlines', type: 'Airline' },
    { name: 'Air Transat', type: 'Airline' },
    { name: 'Flair Airlines', type: 'Airline' },
    { name: 'Montair Aviation', type: 'ATO' },
    { name: "Harv's Air", type: 'ATO' },
    { name: 'Seneca College Aviation', type: 'ATO' },
    { name: 'Canadian Flight Centre', type: 'ATO' },
  ],
  Germany: [
    { name: 'Lufthansa', type: 'Airline' },
    { name: 'Eurowings', type: 'Airline' },
    { name: 'Condor', type: 'Airline' },
    { name: 'TUIfly', type: 'Airline' },
    { name: 'Lufthansa Aviation Training', type: 'Type Rating Center' },
    { name: 'European Aviation School', type: 'ATO' },
    { name: 'F AIR Flight School', type: 'ATO' },
  ],
  France: [
    { name: 'Air France', type: 'Airline' },
    { name: 'Transavia France', type: 'Airline' },
    { name: 'Corsair', type: 'Airline' },
    { name: 'Air Caraibes', type: 'Airline' },
    { name: 'ENAC', type: 'ATO' },
    { name: 'Airways Aviation', type: 'ATO' },
    { name: 'Chalair Aviation Academy', type: 'ATO' },
  ],
  Spain: [
    { name: 'Iberia', type: 'Airline' },
    { name: 'Air Europa', type: 'Airline' },
    { name: 'Vueling', type: 'Airline' },
    { name: 'Volotea', type: 'Airline' },
    { name: 'Binter Canarias', type: 'Airline' },
    { name: 'FTE Jerez', type: 'Type Rating Center' },
    { name: 'FlyBy Aviation Academy', type: 'ATO' },
    { name: 'European Flyers', type: 'ATO' },
    { name: 'Barcelona Flight School', type: 'ATO' },
  ],
  India: [
    { name: 'Air India', type: 'Airline' },
    { name: 'IndiGo', type: 'Airline' },
    { name: 'SpiceJet', type: 'Airline' },
    { name: 'Vistara', type: 'Airline' },
    { name: 'Akasa Air', type: 'Airline' },
    { name: 'Indira Gandhi Rashtriya Uran Akademi', type: 'ATO' },
    { name: 'Chimes Aviation Academy', type: 'ATO' },
    { name: 'Madras Flying Club', type: 'ATO' },
    { name: 'Bombay Flying Club', type: 'ATO' },
  ],
  Singapore: [
    { name: 'Singapore Airlines', type: 'Airline' },
    { name: 'Scoot', type: 'Airline' },
    { name: 'Jetstar Asia', type: 'Airline' },
    { name: 'Singapore Flying College', type: 'ATO' },
    { name: 'ST Aerospace Academy', type: 'ATO' },
    { name: 'Singapore Aviation Academy', type: 'ATO' },
  ],
  Malaysia: [
    { name: 'Malaysia Airlines', type: 'Airline' },
    { name: 'AirAsia', type: 'Airline' },
    { name: 'Malindo Air', type: 'Airline' },
    { name: 'Firefly', type: 'Airline' },
    { name: 'MASwings', type: 'Airline' },
    { name: 'HM Aerospace', type: 'ATO' },
    { name: 'Malaysia Flying Academy', type: 'ATO' },
    { name: 'Asia Pacific Flight Training', type: 'ATO' },
  ],
  Thailand: [
    { name: 'Thai Airways', type: 'Airline' },
    { name: 'Bangkok Airways', type: 'Airline' },
    { name: 'Thai AirAsia', type: 'Airline' },
    { name: 'Thai Lion Air', type: 'Airline' },
    { name: 'Nok Air', type: 'Airline' },
    { name: 'Thai Aviation Academy', type: 'ATO' },
    { name: 'Bangkok Aviation Centre', type: 'ATO' },
  ],
  'South Africa': [
    { name: 'South African Airways', type: 'Airline' },
    { name: 'FlySafair', type: 'Airline' },
    { name: 'Airlink', type: 'Airline' },
    { name: 'Lift', type: 'Airline' },
    { name: 'CemAir', type: 'Airline' },
    { name: '43 Air School', type: 'ATO' },
    { name: 'Cranfield Aviation Training', type: 'ATO' },
    { name: 'Eagle Flight Academy', type: 'ATO' },
  ],
  Mauritius: [
    { name: 'Air Mauritius', type: 'Airline' },
    { name: 'Air Mauritius Training Centre', type: 'ATO' },
    { name: 'SkyDive Mauritius Academy', type: 'ATO' },
  ],
  Japan: [
    { name: 'JAL', type: 'Airline' },
    { name: 'ANA', type: 'Airline' },
    { name: 'Peach Aviation', type: 'Airline' },
    { name: 'Jetstar Japan', type: 'Airline' },
    { name: 'Spring Japan', type: 'Airline' },
    { name: 'Fuji Dream Airlines', type: 'Airline' },
    { name: 'Solaseed Air', type: 'Airline' },
    { name: 'Star Flyer', type: 'Airline' },
  ],
  China: [
    { name: 'Air China', type: 'Airline' },
    { name: 'China Southern', type: 'Airline' },
    { name: 'China Eastern', type: 'Airline' },
    { name: 'Hainan Airlines', type: 'Airline' },
    { name: 'XiamenAir', type: 'Airline' },
    { name: 'Shenzhen Airlines', type: 'Airline' },
    { name: 'Sichuan Airlines', type: 'Airline' },
    { name: 'Juneyao Air', type: 'Airline' },
    { name: 'Spring Airlines', type: 'Airline' },
  ],
  Qatar: [
    { name: 'Qatar Airways', type: 'Airline' },
    { name: 'Qatar Executive', type: 'Operator' },
    { name: 'Gulf Helicopters', type: 'Operator' },
    { name: 'Doha Aviation Academy', type: 'ATO' },
  ],
  Turkey: [
    { name: 'Turkish Airlines', type: 'Airline' },
    { name: 'Pegasus Airlines', type: 'Airline' },
    { name: 'SunExpress', type: 'Airline' },
    { name: 'AnadoluJet', type: 'Airline' },
    { name: 'Corendon Airlines', type: 'Airline' },
    { name: 'Freebird Airlines', type: 'Airline' },
  ],
  Netherlands: [
    { name: 'KLM', type: 'Airline' },
    { name: 'Transavia', type: 'Airline' },
    { name: 'TUI fly Netherlands', type: 'Airline' },
    { name: 'Corendon Dutch Airlines', type: 'Airline' },
  ],
  Other: [{ name: 'Other / Not Listed', type: 'Other' }],
};

const ENGLISH_PROFICIENCY_LEVELS = [
  'Level 1 - Pre-Elementary',
  'Level 2 - Elementary',
  'Level 3 - Pre-Operational',
  'Level 4 - Operational',
  'Level 5 - Extended',
  'Level 6 - Expert',
];

const PREDEFINED_PILOT_STATUSES = [
  'Employed – Active airline pilot',
  'Employed – Corporate / Business aviation',
  'Employed – Cargo / Freighter pilot',
  'Employed – Charter / Tour operations',
  'Waiting for CFI (Certified Flight Instructor) position',
  'Active CFI operations',
  'Low hours – seeking first flying job',
  'Low hours – building time as CFI',
  'Newly licensed CPL – no job yet',
  'Recently graduated from ATO – job hunting',
  'Type rating in progress',
  'Awaiting airline assessment / simulator check',
  'Furloughed / laid off – seeking new role',
  'Transitioning from military to civilian aviation',
  'Career break – planning return to flying',
  'Considering aviation career change',
  'Other',
];

const SLATE = {
  50: '#f8fafc',
  100: '#f1f5f9',
  200: '#e2e8f0',
  300: '#cbd5e1',
  400: '#94a3b8',
  500: '#64748b',
  600: '#475569',
  700: '#334155',
  800: '#1e293b',
  900: '#0f172a',
};

const EMERALD = '#10b981';
const CORPORATE_BLUE = '#003366';

// Monospace font for data fields
const MONO_FONT = "'JetBrains Mono', 'SF Mono', 'Menlo', monospace";

// Helper: Convert DD/MM/YYYY or YYYY-MM-DD to HTML date input format (YYYY-MM-DD)
function toInputDate(raw: string): string {
  if (!raw) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw; // Already ISO
  const m = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const [, day, month, year] = m;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
  // Try parsing as Date
  const d = new Date(raw);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split('T')[0];
  }
  return raw;
}

// Helper: Map D1 ELP value (e.g. "ELP Level 5") to form option (e.g. "Level 5 - Extended")
function mapElpToFormLevel(elp: string): string {
  if (!elp) return '';
  const levelMatch = elp.match(/Level\s+(\d)/i);
  if (!levelMatch) return '';
  const levelNum = levelMatch[1];
  return ENGLISH_PROFICIENCY_LEVELS.find((l) => l.startsWith(`Level ${levelNum}`)) || '';
}

// Helper: Extract short license code from full name, e.g. "Commercial Pilot (CPL)" -> "CPL"
function extractLicenseCode(fullName: string): string | null {
  if (!fullName) return null;
  const m = fullName.match(/\(([A-Z]+)\)/);
  if (m) return m[1];
  // Direct match for short codes already in LICENSE_TYPES
  const upper = fullName.toUpperCase().trim();
  for (const code of LICENSE_TYPES) {
    if (upper === code || upper.includes(code)) return code;
  }
  return null;
}

// Aviation Pathways Options
const AVIATION_PATHWAYS_OPTIONS = [
  'Commercial Aviation (Airlines)',
  'Cargo Aviation',
  'Business Aviation / Private Jets',
  'Flight Instruction',
  'Agricultural Aviation',
  'Emergency Medical Services (Air Ambulance)',
  'Search and Rescue',
  'Firefighting Aviation',
  'Aerial Photography / Surveying',
  'Flight Testing',
  'Military Aviation',
  'Government / Civil Aviation Authority',
  'Aviation Management',
  'Aircraft Maintenance',
  'Aviation Safety & Investigation',
  'Unmanned Aerial Systems (Drones)',
  'Helicopter Operations',
  'Seaplane Operations',
  'Aerobatics / Airshow Flying',
  'Gliding / Soaring',
];

// Pilot Job Positions Options
const PILOT_JOB_POSITIONS_OPTIONS = [
  'Student Pilot',
  'Private Pilot',
  'Commercial Pilot',
  'First Officer (FO)',
  'Senior First Officer (SFO)',
  'Captain',
  'Check Airman / Examiner',
  'Type Rating Instructor',
  'Simulator Instructor',
  'Ground School Instructor',
  'Chief Pilot',
  'Director of Operations',
  'Flight Operations Manager',
  'Corporate Pilot',
  'Charter Pilot',
  'Cargo Pilot',
  'Helicopter Pilot',
  'Agricultural Pilot',
  'Flight Test Pilot',
  'Airshow / Display Pilot',
  'Military Pilot',
  'Flight Dispatcher',
  'Aviation Consultant',
];

const FAVORITE_AIRPORTS_OPTIONS = [
  'DXB - Dubai',
  'AUH - Abu Dhabi',
  'DOH - Doha',
  'JED - Jeddah',
  'RUH - Riyadh',
  'SIN - Singapore',
  'HKG - Hong Kong',
  'NRT - Tokyo Narita',
  'ICN - Seoul Incheon',
  'LHR - London Heathrow',
  'CDG - Paris Charles de Gaulle',
  'FRA - Frankfurt',
  'AMS - Amsterdam',
  'JFK - New York JFK',
  'LAX - Los Angeles',
  "ORD - Chicago O'Hare",
  'DFW - Dallas/Fort Worth',
  'MNL - Manila',
  'BKK - Bangkok',
  'KUL - Kuala Lumpur',
  'CGK - Jakarta',
  'SYD - Sydney',
  'AKL - Auckland',
  'CPT - Cape Town',
  'CAI - Cairo',
  'IST - Istanbul',
  'Other',
];

const BIO_TABS = [
  { key: 'aboutme', label: 'About Me' },
  { key: 'emergency', label: 'Emergency Failures During Flight' },
  { key: 'solo', label: 'Solo Flight' },
  { key: 'training', label: 'The Training Beginning' },
  { key: 'operational', label: 'Operational Experience' },
  { key: 'future', label: 'How Do You See Yourself in the Next 10 Years?' },
] as const;

type BioTabKey = (typeof BIO_TABS)[number]['key'];

const OTHER_INDUSTRY_EXPERIENCE_OPTIONS = [
  'Hospitality / Tourism',
  'IT / Software Engineering',
  'Finance / Banking',
  'Military / Defense',
  'Engineering / Manufacturing',
  'Education / Training',
  'Healthcare',
  'Maritime / Shipping',
  'Logistics / Supply Chain',
  'Real Estate / Construction',
  'Sales / Marketing',
  'Legal / Compliance',
  'Other',
  'None — Aviation only',
];

export const PilotLicensureExperiencePage: React.FC<PilotLicensureExperiencePageProps> = ({
  onBack,
  userProfile: userProfileProp,
  embedded = false,
  visibleSection,
  onNavigateSection,
  onGetStarted,
}) => {
  // Get auth context as fallback when accessed directly via URL
  const { currentUser, userProfile: authUserProfile } = useAuth();
  const { user: auth0User } = useAuth0();
  const { readProfile, readLicensure, writeLicensure, updateProfile } = useVaultProfile();
  const { callApi } = useWorkerAuth();

  // Use prop if provided (nested navigation), otherwise use auth context (direct URL access)
  const userProfile =
    userProfileProp ||
    authUserProfile ||
    (currentUser
      ? {
          id: currentUser.id,
          uid: currentUser.uid,
          email: currentUser.email,
          firstName: authUserProfile?.first_name || '',
          lastName: authUserProfile?.last_name || '',
        }
      : null);
  // Personal Info State
  const [firstName, setFirstName] = useState(userProfile?.firstName || '');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState(userProfile?.lastName || '');

  // Auto-generated full legal name
  const fullLegalName = useMemo(() => {
    const parts = [firstName, middleName, lastName].filter(Boolean);
    return parts.join(' ');
  }, [firstName, middleName, lastName]);

  // Search states for dropdowns
  const [countrySearch, setCountrySearch] = useState('');
  const [nationalitySearch, setNationalitySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const [showNationalityDropdown, setShowNationalityDropdown] = useState(false);
  const [flightSchoolSearch, setFlightSchoolSearch] = useState('');
  const [affiliationTab, setAffiliationTab] = useState<'student' | 'operator'>('student');
  const [atoCountry, setAtoCountry] = useState('');
  const [atoFlightSchoolSearch, setAtoFlightSchoolSearch] = useState('');
  const [showFlightSchoolDropdown, setShowFlightSchoolDropdown] = useState(false);
  const flightSchoolDropdownRef = useRef<HTMLDivElement>(null);
  const [operatorSearch, setOperatorSearch] = useState('');
  const [pilotStatus, setPilotStatus] = useState('');
  const [showPilotStatusDropdown, setShowPilotStatusDropdown] = useState(false);
  const pilotStatusRef = useRef<HTMLDivElement>(null);
  const [operatorCountry, setOperatorCountry] = useState('');
  const [operatorNameSearch, setOperatorNameSearch] = useState('');
  const [showOperatorNameDropdown, setShowOperatorNameDropdown] = useState(false);
  const operatorNameRef = useRef<HTMLDivElement>(null);
  const [interestSearchQuery, setInterestSearchQuery] = useState('');
  const [interestSearchFocused, setInterestSearchFocused] = useState(false);
  const interestSearchRef = useRef<HTMLDivElement>(null);
  const [airportSearch, setAirportSearch] = useState('');
  const [airportSearchFocused, setAirportSearchFocused] = useState(false);
  const airportSearchRef = useRef<HTMLDivElement>(null);
  const [authoritySearch, setAuthoritySearch] = useState('');
  const [showAuthorityDropdown, setShowAuthorityDropdown] = useState(false);
  const authorityDropdownRef = useRef<HTMLDivElement>(null);
  const [medicalAuthoritySearch, setMedicalAuthoritySearch] = useState('');
  const [showMedicalAuthorityDropdown, setShowMedicalAuthorityDropdown] = useState(false);
  const medicalDropdownRef = useRef<HTMLDivElement>(null);
  const medicalTriggerRef = useRef<HTMLDivElement>(null);
  const medicalPortalRef = useRef<HTMLDivElement>(null);
  const [medicalDropdownPos, setMedicalDropdownPos] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [nationality, setNationality] = useState('');
  const [residingCountry, setResidingCountry] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [flightSchoolAddress, setFlightSchoolAddress] = useState('');
  const [languages, setLanguages] = useState('');

  // License Info State
  const [currentLicenses, setCurrentLicenses] = useState<string[]>([]);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [licenseCountryOfIssue, setLicenseCountryOfIssue] = useState('');

  // Medical Certificate State
  const [medicalExpiry, setMedicalExpiry] = useState('');
  const [medicalCountry, setMedicalCountry] = useState('');
  const [medicalClass, setMedicalClass] = useState('');

  // Radio License State
  const [radioLicenseExpiry, setRadioLicenseExpiry] = useState('');
  const [radioLicenseCountry, setRadioLicenseCountry] = useState('');

  // License & Medical staged wizard (0=License, 1=Medical, 2=Radio)
  const [licenseStage, setLicenseStage] = useState(0);

  // Aircraft Ratings State
  const [aircraftRatings, setAircraftRatings] = useState<AircraftRating[]>([]);

  // Endorsements & Additional Ratings State
  const [endorsements, setEndorsements] = useState<Record<string, boolean>>({
    firstOfficer: false,
    captain: false,
    highPerformance: false,
    complexAircraft: false,
    tailwheel: false,
    aerobatic: false,
    seaplane: false,
    catI: false,
    catII: false,
    catIII: false,
  });
  const [endorsementRecency, setEndorsementRecency] = useState<Record<string, string>>({});

  // Custom endorsements that users can add dynamically
  interface CustomEndorsement {
    id: string;
    label: string;
    desc: string;
    section: 'license' | 'aircraft' | 'instrument';
  }
  const [customEndorsements, setCustomEndorsements] = useState<CustomEndorsement[]>([]);

  const addCustomEndorsement = (section: 'license' | 'aircraft' | 'instrument') => {
    const id = `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setCustomEndorsements([...customEndorsements, { id, label: '', desc: '', section }]);
    setEndorsements({ ...endorsements, [id]: true });
  };

  const removeCustomEndorsement = (id: string) => {
    setCustomEndorsements(customEndorsements.filter((ce) => ce.id !== id));
    const next = { ...endorsements };
    delete next[id];
    setEndorsements(next);
    const nextRecency = { ...endorsementRecency };
    delete nextRecency[id];
    setEndorsementRecency(nextRecency);
  };

  const updateCustomEndorsement = (id: string, field: 'label' | 'desc', value: string) => {
    setCustomEndorsements(
      customEndorsements.map((ce) => (ce.id === id ? { ...ce, [field]: value } : ce))
    );
  };

  // Job Experience State
  const [jobExperiences, setJobExperiences] = useState<JobExperience[]>([]);

  // Current Occupation State
  const [currentOccupation, setCurrentOccupation] = useState('');
  const [currentEmployer, setCurrentEmployer] = useState('');
  const [currentPosition, setCurrentPosition] = useState('');

  // Additional Info State
  const [countriesVisited, setCountriesVisited] = useState('');
  const [favoriteAircraft, setFavoriteAircraft] = useState('');
  const [favoriteAircraft2, setFavoriteAircraft2] = useState('');
  const [favoriteAircraft3, setFavoriteAircraft3] = useState('');
  const [favoriteAirports, setFavoriteAirports] = useState<string[]>([]);
  const [biography, setBiography] = useState('');
  const [activeBioTab, setActiveBioTab] = useState<BioTabKey>('aboutme');
  const [bioContents, setBioContents] = useState<Record<BioTabKey, string>>({
    aboutme: '',
    emergency: '',
    solo: '',
    training: '',
    operational: '',
    future: '',
  });
  const [bioSaved, setBioSaved] = useState<Record<BioTabKey, boolean>>({
    aboutme: false,
    emergency: false,
    solo: false,
    training: false,
    operational: false,
    future: false,
  });
  const [experienceStep, setExperienceStep] = useState(0);
  const [whyBecomePilot, setWhyBecomePilot] = useState('');
  const [otherSkills, setOtherSkills] = useState('');
  const [pilotJourneyStory, setPilotJourneyStory] = useState('');
  const [englishProficiency, setEnglishProficiency] = useState('');
  const [englishProficiencySearch, setEnglishProficiencySearch] = useState('');
  const [showEnglishProficiencyDropdown, setShowEnglishProficiencyDropdown] = useState(false);
  const englishProficiencyRef = useRef<HTMLDivElement>(null);

  // Pilot Interests State
  const [aviationPathwaysInterests, setAviationPathwaysInterests] = useState<string[]>([]);
  const [pilotJobPositionsInterests, setPilotJobPositionsInterests] = useState<string[]>([]);
  const [programInterests, setProgramInterests] = useState<string[]>([]);
  const [insightInterests, setInsightInterests] = useState<string[]>([]);

  // Form State
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const TOTAL_STEPS = 4;

  // Review mode state
  const [isReviewMode, setIsReviewMode] = useState(false);

  // Auto-save state
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Tooltip state
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Document upload state
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadType, setActiveUploadType] = useState<'license' | 'medical' | 'rating' | null>(
    null
  );

  // Tier gating
  const {
    isRecognitionPlus,
    tier,
    loading: tierLoading,
  } = useAccountTier(userProfile?.id || currentUser?.id);

  // Filtered flight schools based on ATO country + search
  const filteredFlightSchools = useMemo(() => {
    const schools = atoCountry ? FLIGHT_SCHOOLS_BY_COUNTRY[atoCountry] || [] : [];
    if (!atoFlightSchoolSearch) return schools;
    return schools.filter((s) => s.toLowerCase().includes(atoFlightSchoolSearch.toLowerCase()));
  }, [atoCountry, atoFlightSchoolSearch]);

  // Filtered operators based on country + search
  const filteredOperators = useMemo(() => {
    const operators = operatorCountry ? OPERATORS_BY_COUNTRY[operatorCountry] || [] : [];
    if (!operatorNameSearch) return operators;
    return operators.filter((o) => o.name.toLowerCase().includes(operatorNameSearch.toLowerCase()));
  }, [operatorCountry, operatorNameSearch]);

  // Filtered pilot statuses based on search
  const filteredPilotStatuses = useMemo(() => {
    if (!pilotStatus) return PREDEFINED_PILOT_STATUSES;
    return PREDEFINED_PILOT_STATUSES.filter((s) =>
      s.toLowerCase().includes(pilotStatus.toLowerCase())
    );
  }, [pilotStatus]);

  // Filtered english proficiency levels based on search
  const filteredEnglishProficiencyLevels = useMemo(() => {
    if (!englishProficiencySearch) return ENGLISH_PROFICIENCY_LEVELS;
    return ENGLISH_PROFICIENCY_LEVELS.filter((l) =>
      l.toLowerCase().includes(englishProficiencySearch.toLowerCase())
    );
  }, [englishProficiencySearch]);

  // Filtered options based on search
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return NATIONALITIES;
    return NATIONALITIES.filter((c) => c.toLowerCase().includes(countrySearch.toLowerCase()));
  }, [countrySearch]);

  const filteredNationalities = useMemo(() => {
    if (!nationalitySearch) return NATIONALITIES;
    return NATIONALITIES.filter((n) => n.toLowerCase().includes(nationalitySearch.toLowerCase()));
  }, [nationalitySearch]);

  // Separate effect to handle minimum display time for loading screen
  useEffect(() => {
    // Always show loading for at least 1 second when component mounts
    const timer = setTimeout(() => {
      if (dataLoaded || !userProfile?.uid) {
        // Hide loader if data is loaded OR if no userProfile after timeout
        setIsLoading(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [dataLoaded, userProfile?.id]);

  // Close authority dropdown on click outside
  useEffect(() => {
    if (!showAuthorityDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (
        authorityDropdownRef.current &&
        !authorityDropdownRef.current.contains(e.target as Node)
      ) {
        setShowAuthorityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showAuthorityDropdown]);

  // Close medical authority dropdown on click outside
  useEffect(() => {
    if (!showMedicalAuthorityDropdown) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const inTrigger = medicalTriggerRef.current && medicalTriggerRef.current.contains(target);
      const inWrapper = medicalDropdownRef.current && medicalDropdownRef.current.contains(target);
      const inPortal = medicalPortalRef.current && medicalPortalRef.current.contains(target);
      if (!inTrigger && !inWrapper && !inPortal) {
        setShowMedicalAuthorityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMedicalAuthorityDropdown]);

  // Measure medical dropdown trigger position for fixed positioning
  useEffect(() => {
    if (!showMedicalAuthorityDropdown) {
      setMedicalDropdownPos(null);
      return;
    }
    const measure = () => {
      if (medicalTriggerRef.current) {
        const rect = medicalTriggerRef.current.getBoundingClientRect();
        setMedicalDropdownPos({
          top: rect.bottom + 4,
          left: rect.left,
          width: rect.width,
        });
      }
    };
    measure();
    window.addEventListener('scroll', measure, true);
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure, true);
      window.removeEventListener('resize', measure);
    };
  }, [showMedicalAuthorityDropdown]);

  useEffect(() => {
    if (!showCountryDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showCountryDropdown]);

  useEffect(() => {
    if (!showFlightSchoolDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (
        flightSchoolDropdownRef.current &&
        !flightSchoolDropdownRef.current.contains(e.target as Node)
      ) {
        setShowFlightSchoolDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showFlightSchoolDropdown]);

  useEffect(() => {
    if (!showOperatorNameDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (operatorNameRef.current && !operatorNameRef.current.contains(e.target as Node)) {
        setShowOperatorNameDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showOperatorNameDropdown]);

  useEffect(() => {
    if (!showPilotStatusDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (pilotStatusRef.current && !pilotStatusRef.current.contains(e.target as Node)) {
        setShowPilotStatusDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showPilotStatusDropdown]);

  useEffect(() => {
    if (!showEnglishProficiencyDropdown) return;
    const handleClick = (e: MouseEvent) => {
      if (
        englishProficiencyRef.current &&
        !englishProficiencyRef.current.contains(e.target as Node)
      ) {
        setShowEnglishProficiencyDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showEnglishProficiencyDropdown]);

  // Click-outside for airport search dropdown
  useEffect(() => {
    if (!airportSearchFocused) return;
    const handleClick = (e: MouseEvent) => {
      if (airportSearchRef.current && !airportSearchRef.current.contains(e.target as Node)) {
        setAirportSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [airportSearchFocused]);

  // Load existing data from D1
  useEffect(() => {
    const loadExistingData = async () => {
      let userId = userProfile?.id || userProfile?.uid;

      // Auth0-only fallback: resolve profile ID via auth0_id
      if (!userId && auth0User?.sub) {
        const rows = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'profiles',
          operation: 'select',
          where: { auth0_id: auth0User.sub },
          limit: 1,
        });
        const p = rows?.[0];
        if (p?.id) userId = p.id as string;
      }

      if (!userId) {
        setDataLoaded(true);
        return;
      }

      try {
        // Use vault hook to fetch + decrypt profiles table
        const { data: profileData, error: profileError } = await readProfile(userId);

        // Set initial values from profiles (if available)
        let initialData: any = {};

        if (profileError) {
        } else if (profileData) {
          // Extract from onboarding_responses JSONB as fallback
          const onboarding = profileData.onboarding_responses || {};

          // Handle empty strings as well as null/undefined
          const hasValue = (val: any) => val && val.trim && val.trim() !== '';
          const parseArr = (raw: any) => {
            if (!raw) return [];
            if (Array.isArray(raw)) return raw;
            try {
              return JSON.parse(raw);
            } catch {
              return [raw];
            }
          };

          initialData = {
            fullLegalName: hasValue(profileData.full_name)
              ? profileData.full_name
              : hasValue(onboarding.full_name)
                ? onboarding.full_name
                : '',
            contactNumber: hasValue(profileData.phone)
              ? profileData.phone
              : hasValue(onboarding.phone)
                ? onboarding.phone
                : '',
            residingCountry: hasValue(profileData.country)
              ? profileData.country
              : hasValue(onboarding.country)
                ? onboarding.country
                : '',
            dateOfBirth: toInputDate(
              hasValue(profileData.date_of_birth)
                ? profileData.date_of_birth
                : hasValue(onboarding.date_of_birth)
                  ? onboarding.date_of_birth
                  : ''
            ),
            nationality: hasValue(profileData.nationality)
              ? profileData.nationality
              : hasValue(onboarding.nationality)
                ? onboarding.nationality
                : '',
            flightSchoolAddress: hasValue(profileData.flight_school_address)
              ? profileData.flight_school_address
              : hasValue(onboarding.flight_school_address)
                ? onboarding.flight_school_address
                : '',
            licenseNumber: hasValue(profileData.license_id)
              ? profileData.license_id
              : hasValue(onboarding.license_id)
                ? onboarding.license_id
                : '',
            // Extended profile fields from D1
            licenseType: profileData.license_type || '',
            licenseIssuingAuthority: profileData.license_issuing_authority || '',
            elpLevel: mapElpToFormLevel(profileData.elp_level || ''),
            medicalClass: profileData.medical_class || '',
            ratings: parseArr(profileData.ratings),
            aircraftTypes: parseArr(profileData.aircraft_types),
            typeRatings: parseArr(profileData.type_ratings).filter(
              (a: string) => a && !a.startsWith('__')
            ),
            employmentStatus: profileData.employment_status || '',
            currentOccupation: profileData.current_occupation || '',
            totalFlightHours: profileData.total_flight_hours || profileData.hours_whole || '',
            pilotStage: profileData.pilot_stage || '',
            licenseCountryOfIssue:
              profileData.country_of_license || profileData.license_issuing_authority || '',
            biography: profileData.bio || onboarding.bio || '',
            favoriteAirports: parseArr(profileData.favorite_airports),
            favoriteAircraft2: profileData.favorite_aircraft_2 || '',
            favoriteAircraft3: profileData.favorite_aircraft_3 || '',
          };

          // Parse display_name into first/last name (check for empty string)
          if (hasValue(profileData.display_name)) {
            const nameParts = profileData.display_name.split(' ');
            initialData.firstName = nameParts[0] || '';
            initialData.lastName = nameParts.slice(1).join(' ') || '';
          } else if (hasValue(onboarding.first_name) || hasValue(onboarding.last_name)) {
            initialData.firstName = onboarding.first_name || '';
            initialData.lastName = onboarding.last_name || '';
          } else if (profileData.email) {
            // Fallback: parse email prefix as name
            const emailPrefix = profileData.email.split('@')[0];
            // Parse benjamintigerbowler -> Benjamin Tiger Bowler
            // or john.doe -> John Doe
            const cleanName = emailPrefix
              .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
              .replace(/([0-9])/g, ' ') // Remove numbers
              .replace(/[._-]/g, ' ') // Replace separators with space
              .replace(/\s+/g, ' ') // Collapse multiple spaces
              .trim();

            if (cleanName) {
              const nameParts = cleanName.split(' ').filter((p: string) => p.length > 0);
              if (nameParts.length >= 2) {
                // Capitalize each part
                initialData.firstName =
                  nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
                initialData.lastName = nameParts
                  .slice(1)
                  .map((p: string) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
                  .join(' ');
              } else if (nameParts.length === 1) {
                initialData.firstName =
                  nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
                initialData.lastName = '';
              }
            }
          }
        }

        // Use vault hook to fetch + decrypt licensure table
        const { data, error } = await readLicensure(userId);

        // Also fetch from pilot_profiles for flight hours and license data
        try {
          const pilotProfileRows = await callApi<Record<string, unknown>[]>('queryTable', {
            table: 'pilot_profiles',
            operation: 'select',
            where: { user_id: userId },
            limit: 1,
          });
          const pilotProfileData = pilotProfileRows?.[0];
          if (pilotProfileData) {
            // Pilot profile data available for future use
          }
        } catch {
          // pilot_profiles query failed, continue without it
        }

        if (error) {
          // Only use profile data as fallback if we haven't already set the values
          if (!firstName) setFirstName(initialData.firstName || userProfile?.firstName || '');
          if (!lastName) setLastName(initialData.lastName || userProfile?.lastName || '');
          if (!contactNumber) setContactNumber(initialData.contactNumber || '');
          if (!residingCountry) setResidingCountry(initialData.residingCountry || '');
          if (!dateOfBirth) setDateOfBirth(initialData.dateOfBirth || '');
        } else if (data) {
          // Personal Info - use licensure data if available, fallback to profiles
          setFirstName(data.first_name || initialData.firstName || userProfile?.firstName || '');
          setMiddleName(data.middle_name || '');
          setLastName(data.last_name || initialData.lastName || userProfile?.lastName || '');
          setDateOfBirth(data.date_of_birth || initialData.dateOfBirth || '');
          setNationality(data.nationality || initialData.nationality || '');
          setResidingCountry(data.residing_country || initialData.residingCountry || '');
          setContactNumber(data.contact_number || initialData.contactNumber || '');
          setFlightSchoolAddress(
            data.flight_school_address || initialData.flightSchoolAddress || ''
          );
          setLanguages(data.languages || '');
          setEnglishProficiency(data.english_proficiency || initialData.elpLevel || '');
          setEnglishProficiencySearch(data.english_proficiency || initialData.elpLevel || '');

          // License Info — extract short codes from full names
          const licFromProfile = initialData.licenseType
            ? [extractLicenseCode(initialData.licenseType)].filter(Boolean)
            : [];
          const ratingsFromProfile = (initialData.ratings || [])
            .map((r: string) => extractLicenseCode(r))
            .filter(Boolean);
          const allLicenses = [...new Set([...licFromProfile, ...ratingsFromProfile])] as string[];
          setCurrentLicenses(data.current_license?.length ? data.current_license : allLicenses);
          setLicenseNumber(data.license_number || initialData.licenseNumber || '');
          setLicenseExpiry(data.license_expiry || '');
          setLicenseCountryOfIssue(
            data.license_country_of_issue || initialData.licenseIssuingAuthority || ''
          );

          // Medical Info
          setMedicalExpiry(data.medical_expiry || '');
          setMedicalCountry(data.medical_country || initialData.licenseIssuingAuthority || '');
          setMedicalClass(data.medical_class || initialData.medicalClass || '');
          setRadioLicenseExpiry(data.radio_license_expiry || '');
          setRadioLicenseCountry(
            data.radio_license_country || initialData.licenseIssuingAuthority || ''
          );

          // Aircraft Ratings
          if (data.aircraft_ratings?.length) {
            setAircraftRatings(data.aircraft_ratings);
          } else {
            const allTypes = [
              ...(initialData.aircraftTypes || []),
              ...(initialData.typeRatings || []),
            ];
            if (allTypes.length > 0) {
              setAircraftRatings(
                allTypes.map((type: string, i: number) => ({
                  id: `profile-${i}`,
                  aircraftClass: '',
                  aircraftType: type,
                  manufacturer: '',
                  model: '',
                  tailNumber: '',
                  ratingDate: '',
                  isCurrent: true,
                  lastFlown: '',
                }))
              );
            }
          }

          // Professional Experiences
          setJobExperiences(data.professional_experiences || []);

          // Current Occupation
          setCurrentOccupation(data.current_occupation || initialData.currentOccupation || '');
          setCurrentEmployer(data.current_employer || '');
          setCurrentPosition(data.current_position || '');

          // Pilot Interests
          setCountriesVisited(
            data.countries_visited?.toString() || initialData.totalFlightHours?.toString() || ''
          );
          setFavoriteAircraft(data.favorite_aircraft || '');
          setFavoriteAircraft2(data.favorite_aircraft_2 || initialData.favoriteAircraft2 || '');
          setFavoriteAircraft3(data.favorite_aircraft_3 || initialData.favoriteAircraft3 || '');
          setFavoriteAirports(
            data.favorite_airports?.length
              ? data.favorite_airports
              : initialData.favoriteAirports || []
          );
          setBiography(data.biography || initialData.biography || '');
          setWhyBecomePilot(data.why_become_pilot || '');
          setOtherSkills(data.other_skills || '');
          setPilotJourneyStory(data.pilot_journey_story || '');
          if (data.endorsements) setEndorsements((prev) => ({ ...prev, ...data.endorsements }));
          if (data.endorsement_recency) setEndorsementRecency(data.endorsement_recency);
          setAviationPathwaysInterests(
            data.aviation_pathways_interests?.length
              ? data.aviation_pathways_interests
              : initialData.pilotStage
                ? [initialData.pilotStage]
                : []
          );
          setPilotJobPositionsInterests(data.pilot_job_positions_interests || []);
          setProgramInterests(data.program_interests || initialData.programInterests || []);
          setInsightInterests(data.insight_interests || initialData.insightInterests || []);
        }

        // Apply all profile data fallbacks if no licensure data was found
        if (!data) {
          setFirstName(initialData.firstName || userProfile?.firstName || '');
          setLastName(initialData.lastName || userProfile?.lastName || '');
          setContactNumber(initialData.contactNumber || '');
          setResidingCountry(initialData.residingCountry || '');
          setDateOfBirth(initialData.dateOfBirth || '');
          setNationality(initialData.nationality || '');
          setFlightSchoolAddress(initialData.flightSchoolAddress || '');
          setLicenseNumber(initialData.licenseNumber || '');
          setProgramInterests(initialData.programInterests || []);
          setAviationPathwaysInterests(initialData.pathwayInterests || []);
          setInsightInterests(initialData.insightInterests || []);

          // Extended D1 profile fields
          const licCodes = [
            ...(initialData.licenseType ? [extractLicenseCode(initialData.licenseType)] : []),
            ...(initialData.ratings || []).map((r: string) => extractLicenseCode(r)),
          ].filter(Boolean) as string[];
          if (licCodes.length) setCurrentLicenses([...new Set(licCodes)]);
          if (initialData.licenseIssuingAuthority)
            setLicenseCountryOfIssue(initialData.licenseIssuingAuthority);
          if (initialData.elpLevel) {
            setEnglishProficiency(initialData.elpLevel);
            setEnglishProficiencySearch(initialData.elpLevel);
          }
          if (initialData.medicalClass) setMedicalClass(initialData.medicalClass);
          if (initialData.currentOccupation) setCurrentOccupation(initialData.currentOccupation);
          if (initialData.totalFlightHours)
            setCountriesVisited(initialData.totalFlightHours.toString());
          if (initialData.biography) setBiography(initialData.biography);
          if (initialData.favoriteAirports?.length)
            setFavoriteAirports(initialData.favoriteAirports);
          if (initialData.favoriteAircraft2) setFavoriteAircraft2(initialData.favoriteAircraft2);
          if (initialData.favoriteAircraft3) setFavoriteAircraft3(initialData.favoriteAircraft3);
          if (initialData.pilotStage) setAviationPathwaysInterests([initialData.pilotStage]);
          if (initialData.licenseIssuingAuthority) {
            setRadioLicenseCountry(initialData.licenseIssuingAuthority);
            setMedicalCountry(initialData.licenseIssuingAuthority);
          }

          // Build aircraft ratings from profile arrays
          const allTypes = [
            ...(initialData.aircraftTypes || []),
            ...(initialData.typeRatings || []),
          ];
          if (allTypes.length > 0) {
            setAircraftRatings(
              allTypes.map((type: string, i: number) => ({
                id: `profile-${i}`,
                aircraftClass: '',
                aircraftType: type,
                manufacturer: '',
                model: '',
                tailNumber: '',
                ratingDate: '',
                isCurrent: true,
                lastFlown: '',
              }))
            );
          }
        }

        // Mark data as loaded - the separate effect will handle hiding the loader after min time
        setDataLoaded(true);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Error loading data:', error);
        setDataLoaded(true); // Still mark as loaded to hide loader
      }
    };

    loadExistingData();
  }, [userProfile?.uid]);

  // Add new job experience
  const addJobExperience = (sector: 'aviation' | 'non-aviation' = 'aviation') => {
    const newJob: JobExperience = {
      id: Date.now().toString(),
      sector,
      industry: '',
      company: '',
      position: '',
      fromDate: '',
      toDate: '',
      description: '',
    };
    setJobExperiences([...jobExperiences, newJob]);
  };

  // Update job experience
  const updateJobExperience = (id: string, field: keyof JobExperience, value: string) => {
    setJobExperiences(
      jobExperiences.map((job) => (job.id === id ? { ...job, [field]: value } : job))
    );
  };

  // Remove job experience
  const removeJobExperience = (id: string) => {
    setJobExperiences(jobExperiences.filter((job) => job.id !== id));
  };

  // Add aircraft rating
  const addAircraftRating = () => {
    const newRating: AircraftRating = {
      id: Date.now().toString(),
      aircraftClass: '',
      aircraftType: '',
      manufacturer: '',
      model: '',
      tailNumber: '',
      ratingDate: '',
      isCurrent: true,
      lastFlown: '',
    };
    setAircraftRatings([...aircraftRatings, newRating]);
  };

  // Update aircraft rating
  const updateAircraftRating = (
    id: string,
    field: keyof AircraftRating,
    value: string | boolean
  ) => {
    setAircraftRatings(
      aircraftRatings.map((rating) => (rating.id === id ? { ...rating, [field]: value } : rating))
    );
  };

  // Remove aircraft rating
  const removeAircraftRating = (id: string) => {
    setAircraftRatings(aircraftRatings.filter((rating) => rating.id !== id));
  };

  // Toggle license selection with hierarchical logic
  const toggleLicense = (license: string) => {
    const hierarchy = ['PPL', 'CPL', 'ATPL Frozen', 'ATPL'];
    const ratings = ['SPL', 'CFI', 'IR', 'ME'];

    if (currentLicenses.includes(license)) {
      // If deselecting a main license, deselect all higher licenses too
      if (hierarchy.includes(license)) {
        const licenseIndex = hierarchy.indexOf(license);
        const toRemove = hierarchy.slice(licenseIndex);
        setCurrentLicenses(currentLicenses.filter((l) => !toRemove.includes(l)));
      } else {
        // Just remove the rating
        setCurrentLicenses(currentLicenses.filter((l) => l !== license));
      }
    } else {
      // If selecting a main license, auto-select all lower licenses
      if (hierarchy.includes(license)) {
        const licenseIndex = hierarchy.indexOf(license);
        const lowerLicenses = hierarchy.slice(0, licenseIndex + 1);
        const newLicenses = [...new Set([...currentLicenses, ...lowerLicenses])];
        setCurrentLicenses(newLicenses);
      } else {
        // Just add the rating
        setCurrentLicenses([...currentLicenses, license]);
      }
    }
  };

  // Document upload handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent, docType: 'license' | 'medical' | 'rating') => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0], docType);
    }
  };

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: 'license' | 'medical' | 'rating'
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file, docType);
    }
  };

  const processFile = (file: File, docType: 'license' | 'medical' | 'rating') => {
    const newDoc: UploadedDoc = {
      id: Date.now().toString(),
      type: docType,
      fileName: file.name,
      fileSize: file.size,
      status: 'uploading',
    };

    setUploadedDocs((prev) => [...prev, newDoc]);

    // Simulate upload progress
    setTimeout(() => {
      setUploadedDocs((prev) =>
        prev.map((doc) => (doc.id === newDoc.id ? { ...doc, status: 'processing' } : doc))
      );
    }, 1500);

    // Simulate OCR extraction
    setTimeout(() => {
      const detectedMedicalClass = Math.random() > 0.5 ? 'Class 1' : 'Class 2';

      setUploadedDocs((prev) =>
        prev.map((doc) =>
          doc.id === newDoc.id
            ? {
                ...doc,
                status: 'pending_review',
                extractedData: {
                  licenseNumber:
                    docType === 'license' ? 'CPL-' + Math.floor(Math.random() * 100000) : undefined,
                  expiryDate: docType === 'license' ? '2025-12-31' : undefined,
                  issuingAuthority: docType === 'license' ? 'CAA' : undefined,
                  medicalClass: docType === 'medical' ? detectedMedicalClass : undefined,
                },
              }
            : doc
        )
      );

      // Auto-detect medical class from OCR and update form
      if (docType === 'medical') {
        setMedicalClass(detectedMedicalClass);
      }
    }, 3500);
  };

  const removeDocument = (docId: string) => {
    setUploadedDocs((prev) => prev.filter((doc) => doc.id !== docId));
  };

  const getDocsByType = (type: 'license' | 'medical' | 'rating') => {
    return uploadedDocs.filter((doc) => doc.type === type);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Check if date is expired
  const isDateExpired = (dateString: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date < today;
  };

  // Toggle aviation pathway interest
  const toggleAviationPathway = (pathway: string) => {
    if (aviationPathwaysInterests.includes(pathway)) {
      setAviationPathwaysInterests(aviationPathwaysInterests.filter((p) => p !== pathway));
    } else {
      setAviationPathwaysInterests([...aviationPathwaysInterests, pathway]);
    }
  };

  // Toggle pilot job position interest
  const togglePilotJobPosition = (position: string) => {
    if (pilotJobPositionsInterests.includes(position)) {
      setPilotJobPositionsInterests(pilotJobPositionsInterests.filter((p) => p !== position));
    } else {
      setPilotJobPositionsInterests([...pilotJobPositionsInterests, position]);
    }
  };

  // Toggle favorite airport
  const toggleFavoriteAirport = (airport: string) => {
    if (favoriteAirports.includes(airport)) {
      setFavoriteAirports(favoriteAirports.filter((a) => a !== airport));
    } else {
      setFavoriteAirports([...favoriteAirports, airport]);
    }
  };

  // Save individual bio tab (local feedback)
  const handleSaveBioTab = (tab: BioTabKey) => {
    setBioSaved({ ...bioSaved, [tab]: true });
    setTimeout(() => setBioSaved((prev) => ({ ...prev, [tab]: false })), 2000);
  };

  // Save all data to D1 via Worker API
  const handleSave = async () => {
    const userId = userProfile?.id || userProfile?.uid;
    if (!userId) {
      setSaveMessage('Please log in to save your data');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const data = {
        user_id: userId,
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        nationality,
        languages,
        current_license: currentLicenses,
        license_number: licenseNumber,
        license_expiry: licenseExpiry,
        license_country_of_issue: licenseCountryOfIssue,
        medical_expiry: medicalExpiry,
        medical_country: medicalCountry,
        medical_class: medicalClass,
        radio_license_expiry: radioLicenseExpiry,
        radio_license_country: radioLicenseCountry,
        aircraft_ratings: aircraftRatings,
        professional_experiences: jobExperiences,
        current_occupation: currentOccupation,
        current_employer: currentEmployer,
        current_position: currentPosition,
        full_legal_name: fullLegalName,
        flight_school_address: flightSchoolAddress,
        residing_country: residingCountry,
        contact_number: contactNumber,
        countries_visited: countriesVisited ? parseInt(countriesVisited, 10) : null,
        favorite_aircraft: favoriteAircraft,
        favorite_aircraft_2: favoriteAircraft2,
        favorite_aircraft_3: favoriteAircraft3,
        favorite_airports: favoriteAirports,
        biography,
        why_become_pilot: whyBecomePilot,
        other_skills: otherSkills,
        pilot_journey_story: pilotJourneyStory,
        endorsements,
        endorsement_recency: endorsementRecency,
        aviation_pathways_interests: aviationPathwaysInterests,
        pilot_job_positions_interests: pilotJobPositionsInterests,
        english_proficiency: englishProficiency,
        updated_at: new Date().toISOString(),
      };

      // writeLicensure encrypts sensitive fields via vault key before writing
      const { error } = await writeLicensure(userId, data);

      if (error) {
        console.error('D1 save error:', error);
        throw error;
      }

      // Also sync with profiles table (encrypted via updateProfile)
      if (userId) {
        const profileUpdateData: any = {
          full_name: fullLegalName,
          phone: contactNumber,
          country: residingCountry,
          date_of_birth: dateOfBirth,
          nationality: nationality,
          flight_school_address: flightSchoolAddress,
          license_id: licenseNumber,
          country_of_license: licenseCountryOfIssue,
          aircraft_rated_on: aircraftRatings?.length > 0 ? aircraftRatings[0].aircraftType : '',
          experience_description: whyBecomePilot,
          ratings: currentLicenses,
          program_interests: aviationPathwaysInterests,
          pathway_interests: aviationPathwaysInterests,
          insight_interests: pilotJobPositionsInterests,
          medical_expiry: medicalExpiry,
          medical_country: medicalCountry,
          medical_class: medicalClass,
          radio_license_expiry: radioLicenseExpiry,
          radio_license_country: radioLicenseCountry,
          license_expiry: licenseExpiry,
          bio: biography,
          favorite_airports: favoriteAirports,
          favorite_aircraft_2: favoriteAircraft2,
          favorite_aircraft_3: favoriteAircraft3,
          updated_at: new Date().toISOString(),
        };

        // updateProfile encrypts sensitive fields via vault key before writing
        const { error: profileError } = await updateProfile(userId, profileUpdateData);

        if (profileError) {
          console.error('Profile sync error (non-critical):', profileError);
        } else {
        }
      }

      setLastSaved(new Date());
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus('idle'), 2000);

      setSaveMessage('Data saved successfully!');
    } catch (error: any) {
      console.error('Error saving data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="dashboard-container animate-fade-in"
      style={{
        minHeight: '100vh',
        background: embedded ? 'transparent' : 'linear-gradient(135deg, #f0f4f8 0%, #e8eef5 100%)',
        position: 'relative',
      }}
    >
      {/* Custom scrollbar styles for authority dropdown */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .authority-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .authority-scroll::-webkit-scrollbar-track {
          background: #334155;
          border-radius: 4px;
        }
        .authority-scroll::-webkit-scrollbar-thumb {
          background: #dc2626;
          border-radius: 4px;
          min-height: 48px;
        }
        .authority-scroll::-webkit-scrollbar-thumb:hover {
          background: #ef4444;
        }
      `,
        }}
      />
      {/* Vignette shader overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          background: 'radial-gradient(circle, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)',
          mixBlendMode: 'multiply',
        }}
      />
      {/* Loading Screen */}
      {isLoading ? (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              border: '4px solid #e2e8f0',
              borderTop: '4px solid #2563eb',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 1; transform: scale(1); }
              50% { opacity: 0.5; transform: scale(1.1); }
            }
          `}</style>
          <p
            style={{ marginTop: '1.5rem', fontSize: '1.125rem', color: '#475569', fontWeight: 500 }}
          >
            Loading your profile...
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
            Please wait while we fetch your information
          </p>
        </div>
      ) : (
        <main
          style={{
            padding: embedded && visibleSection ? '1rem 3rem 1rem 1rem' : '2rem',
            maxWidth: embedded && visibleSection ? '100%' : '1200px',
            margin: '0 auto',
            overflowX: 'hidden',
          }}
        >
          {!visibleSection && (
            <div style={{ transform: 'scale(0.9)', transformOrigin: 'top center' }}>
              {/* Get Recognition+ Promo */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  marginBottom: '1.25rem',
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  position: 'relative',
                }}
              >
                <h2
                  style={{
                    margin: '0 0 0.5rem',
                    fontSize: '1.15rem',
                    fontWeight: 700,
                    color: '#111827',
                    lineHeight: 1.4,
                  }}
                >
                  Get <span style={{ color: '#dc2626' }}>Recognition+</span> — Don&apos;t miss a
                  thing. One <span style={{ color: '#dc2626' }}>verification</span>, one{' '}
                  <span style={{ color: '#dc2626' }}>profile</span> that{' '}
                  <span style={{ color: '#dc2626' }}>carries with you</span> in your{' '}
                  <span style={{ color: '#dc2626' }}>aviation career</span>.
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: '0.875rem',
                    color: '#4b5563',
                    lineHeight: 1.5,
                    maxWidth: '720px',
                  }}
                >
                  Build a single, verified pilot profile that airlines and operators trust. One
                  verification check unlocks full pathway matching, unlimited profile comparisons,
                  and priority access to career opportunities.
                </p>
                <div
                  style={{
                    position: 'absolute',
                    bottom: '0.75rem',
                    right: '1.25rem',
                    fontSize: '0.7rem',
                    color: '#6b7280',
                    fontWeight: 500,
                  }}
                >
                  In support of <span style={{ color: '#111827' }}>pilot</span>
                  <span style={{ color: '#dc2626' }}>shortage</span>
                  <span style={{ color: '#dc2626' }}>.org</span>
                </div>
              </motion.div>

              {/* Advanced Profile Introduction */}
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: 'rgba(255, 255, 255, 0.35)',
                  backdropFilter: 'blur(32px) saturate(1.5)',
                  WebkitBackdropFilter: 'blur(32px) saturate(1.5)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  marginBottom: '1.25rem',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  boxShadow:
                    '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                }}
              >
                {/* Hero Image */}
                <div
                  style={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '1.25rem',
                    position: 'relative',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  }}
                >
                  <img
                    src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=1200&q=80"
                    alt="Aviation career pathways"
                    style={{
                      width: '100%',
                      height: '280px',
                      objectFit: 'cover',
                      objectPosition: 'center 50%',
                      display: 'block',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 60%)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '1.5rem',
                      left: '1.5rem',
                      right: '1.5rem',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        color: '#ffffff',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        textShadow: '0 2px 8px rgba(0,0,0,0.4)',
                      }}
                    >
                      Your Advanced Pilot Profile
                    </p>
                    <p
                      style={{
                        margin: '0.25rem 0 0',
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: '0.85rem',
                        textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                      }}
                    >
                      Complete every section to unlock the full power of your profile — airlines and
                      operators are watching.
                    </p>
                  </div>
                </div>

                {/* Feature Cards */}
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}
                >
                  {/* Pathways Eligibility */}
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.5)',
                      borderRadius: '12px',
                      padding: '1rem',
                      border: '1px solid rgba(255,255,255,0.4)',
                      backdropFilter: 'blur(12px)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        boxShadow: '0 4px 12px rgba(220,38,38,0.25)',
                      }}
                    >
                      <Globe style={{ width: '22px', height: '22px', color: '#ffffff' }} />
                    </div>
                    <h3
                      style={{
                        margin: '0 0 0.5rem',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#0f172a',
                      }}
                    >
                      Pathways Eligibility
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>
                      Your completed profile automatically qualifies you for curated career pathways
                      matched to your experience, ratings, and career stage.
                    </p>
                  </div>

                  {/* Unlocking Inbox */}
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.5)',
                      borderRadius: '12px',
                      padding: '1rem',
                      border: '1px solid rgba(255,255,255,0.4)',
                      backdropFilter: 'blur(12px)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        boxShadow: '0 4px 12px rgba(220,38,38,0.25)',
                      }}
                    >
                      <Inbox style={{ width: '22px', height: '22px', color: '#ffffff' }} />
                    </div>
                    <h3
                      style={{
                        margin: '0 0 0.5rem',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#0f172a',
                      }}
                    >
                      Inbox &amp; Communication
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>
                      Once complete, your inbox opens to direct messages from recruiters and pathway
                      coordinators. Stay connected with industry updates and assessment invitations.
                    </p>
                  </div>

                  {/* Logbook Sync */}
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.5)',
                      borderRadius: '12px',
                      padding: '1rem',
                      border: '1px solid rgba(255,255,255,0.4)',
                      backdropFilter: 'blur(12px)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        boxShadow: '0 4px 12px rgba(220,38,38,0.25)',
                      }}
                    >
                      <BookOpen style={{ width: '22px', height: '22px', color: '#ffffff' }} />
                    </div>
                    <h3
                      style={{
                        margin: '0 0 0.5rem',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#0f172a',
                      }}
                    >
                      Logbook Sync &amp; Auditable
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#334155', lineHeight: 1.5 }}>
                      Sync your flight hours and logbook entries automatically. Maintain an
                      auditable, timestamped record that airlines and regulators can verify
                      instantly.
                    </p>
                  </div>
                </div>

                {/* CTA Row */}
                <div
                  style={{
                    marginTop: '1.25rem',
                    padding: '1rem 1.25rem',
                    background: 'rgba(220, 38, 38, 0.08)',
                    borderRadius: '10px',
                    border: '1px solid rgba(220, 38, 38, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: '0 0 0.15rem',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#0f172a',
                      }}
                    >
                      Complete your profile to unlock everything.
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#475569' }}>
                      Every field you fill increases your visibility to airlines and pathway
                      coordinators.
                    </p>
                  </div>
                  <button
                    onClick={onGetStarted}
                    style={{
                      padding: '0.65rem 1.25rem',
                      background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                      color: '#ffffff',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Get Started
                  </button>
                </div>
              </motion.section>
            </div>
          )}

          {/* Save Message */}
          {saveMessage && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{
                background: saveMessage.includes('success') ? '#dcfce7' : '#fee2e2',
                border: `1px solid ${saveMessage.includes('success') ? '#86efac' : '#fca5a5'}`,
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '2rem',
                textAlign: 'center',
                color: saveMessage.includes('success') ? '#166534' : '#991b1b',
              }}
            >
              {saveMessage}
            </motion.div>
          )}

          {/* Personal Information Section */}
          {visibleSection === 'personal' && (
            <div
              style={{
                transform: embedded ? 'scale(0.85)' : 'scale(1)',
                transformOrigin: 'top center',
                width: '100%',
              }}
            >
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: 'rgba(255, 255, 255, 0.35)',
                  borderRadius: '20px',
                  padding: embedded ? '1.25rem 1.5rem' : '2rem',
                  margin: embedded ? '0 auto 2rem' : '0 0 2rem',
                  maxWidth: embedded ? '1100px' : undefined,
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  boxShadow:
                    '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
                }}
              >
                <h2
                  style={{
                    fontSize: embedded ? '1.25rem' : '1.5rem',
                    fontWeight: 700,
                    marginBottom: embedded ? '1rem' : '1.5rem',
                    borderBottom: '2px solid rgba(255,255,255,0.2)',
                    paddingBottom: '0.75rem',
                  }}
                >
                  <span style={{ color: '#ffffff' }}>Personal </span>
                  <span style={{ color: '#dc2626' }}>Information</span>
                </h2>

                {/* Two Column Layout for Personal Info */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: embedded ? '1rem' : '1.5rem',
                    alignItems: 'end',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        marginBottom: '0.5rem',
                      }}
                    >
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid rgba(255,255,255,0.35)',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#dc2626';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="Enter first name"
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#dc2626',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Contact Number *
                      <span style={{ position: 'relative', display: 'inline-flex' }}>
                        <button
                          onMouseEnter={() => setActiveTooltip('contact')}
                          onMouseLeave={() => setActiveTooltip(null)}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'help' }}
                        >
                          <HelpCircle
                            style={{ width: '14px', height: '14px', color: 'rgba(15,23,42,0.4)' }}
                          />
                        </button>
                        {activeTooltip === 'contact' && (
                          <span
                            style={{
                              position: 'absolute',
                              bottom: 'calc(100% + 6px)',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              background: '#1f2937',
                              color: 'white',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              whiteSpace: 'nowrap',
                              zIndex: 20,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            }}
                          >
                            Used by recruiters for urgent interview scheduling
                          </span>
                        )}
                      </span>
                    </label>
                    <input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid rgba(255,255,255,0.35)',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#dc2626';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid rgba(255,255,255,0.35)',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#dc2626';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      placeholder="Enter last name"
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#dc2626',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Date of Birth *
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid rgba(255,255,255,0.35)',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#dc2626';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  {/* Row 3: Country + Nationality */}
                  <div ref={countryDropdownRef} style={{ position: 'relative' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Residing Country *
                      <span style={{ position: 'relative', display: 'inline-flex' }}>
                        <button
                          onMouseEnter={() => setActiveTooltip('country')}
                          onMouseLeave={() => setActiveTooltip(null)}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'help' }}
                        >
                          <HelpCircle
                            style={{ width: '14px', height: '14px', color: 'rgba(15,23,42,0.4)' }}
                          />
                        </button>
                        {activeTooltip === 'country' && (
                          <span
                            style={{
                              position: 'absolute',
                              bottom: 'calc(100% + 6px)',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              background: '#1f2937',
                              color: 'white',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              whiteSpace: 'nowrap',
                              zIndex: 20,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            }}
                          >
                            Used for timezone and regulatory jurisdiction matching
                          </span>
                        )}
                      </span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={residingCountry || countrySearch}
                        onChange={(e) => {
                          setCountrySearch(e.target.value);
                          setShowCountryDropdown(true);
                        }}
                        onFocus={() => setShowCountryDropdown(true)}
                        placeholder="Search country..."
                        style={{
                          width: '100%',
                          padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                          border: '2px solid rgba(255,255,255,0.35)',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          outline: 'none',
                          transition: 'border-color 0.2s, box-shadow 0.2s',
                        }}
                      />
                      <Search
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '16px',
                          height: '16px',
                          color: 'rgba(15,23,42,0.4)',
                        }}
                      />
                    </div>
                    {showCountryDropdown && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 4px)',
                          left: 0,
                          right: 0,
                          zIndex: 20,
                          background: 'rgba(15, 23, 42, 0.92)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Search header */}
                        <div
                          style={{
                            padding: '0.75rem',
                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                            position: 'relative',
                          }}
                        >
                          <Search
                            style={{
                              position: 'absolute',
                              left: '1.25rem',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '14px',
                              height: '14px',
                              color: 'rgba(255,255,255,0.4)',
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Search country..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.75rem 0.5rem 2rem',
                              background: 'rgba(255,255,255,0.08)',
                              border: '1px solid rgba(255,255,255,0.12)',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              color: 'white',
                              outline: 'none',
                            }}
                          />
                        </div>

                        {/* Country list */}
                        <div style={{ maxHeight: '280px', overflowY: 'auto', padding: '0.5rem' }}>
                          {filteredCountries.length === 0 && (
                            <div
                              style={{
                                padding: '1rem',
                                textAlign: 'center',
                                color: 'rgba(255,255,255,0.4)',
                                fontSize: '0.8rem',
                              }}
                            >
                              No countries found
                            </div>
                          )}
                          {filteredCountries.map((country) => {
                            const isSelected = residingCountry === country;
                            return (
                              <button
                                key={country}
                                type="button"
                                onClick={() => {
                                  setResidingCountry(country);
                                  setCountrySearch('');
                                  setShowCountryDropdown(false);
                                }}
                                style={{
                                  width: '100%',
                                  padding: '0.6rem 0.75rem',
                                  textAlign: 'left',
                                  border: 'none',
                                  borderRadius: '6px',
                                  background: isSelected
                                    ? 'rgba(220, 38, 38, 0.25)'
                                    : 'transparent',
                                  color: isSelected ? '#ffffff' : 'rgba(255,255,255,0.85)',
                                  fontSize: '0.875rem',
                                  cursor: 'pointer',
                                  transition: 'all 0.15s',
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSelected)
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSelected) e.currentTarget.style.background = 'transparent';
                                }}
                              >
                                {isSelected && (
                                  <Check
                                    style={{
                                      width: '14px',
                                      height: '14px',
                                      color: '#f87171',
                                      marginRight: '0.5rem',
                                      display: 'inline',
                                      verticalAlign: 'text-bottom',
                                    }}
                                  />
                                )}
                                {country}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ position: 'relative' }}>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#dc2626',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Nationality *
                      <span style={{ position: 'relative', display: 'inline-flex' }}>
                        <button
                          onMouseEnter={() => setActiveTooltip('nationality')}
                          onMouseLeave={() => setActiveTooltip(null)}
                          style={{ background: 'none', border: 'none', padding: 0, cursor: 'help' }}
                        >
                          <HelpCircle
                            style={{ width: '14px', height: '14px', color: 'rgba(15,23,42,0.4)' }}
                          />
                        </button>
                        {activeTooltip === 'nationality' && (
                          <span
                            style={{
                              position: 'absolute',
                              bottom: 'calc(100% + 6px)',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              background: '#1f2937',
                              color: 'white',
                              padding: '0.5rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              whiteSpace: 'nowrap',
                              zIndex: 20,
                              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                            }}
                          >
                            Required for visa and work permit processing
                          </span>
                        )}
                      </span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        value={nationality || nationalitySearch}
                        onChange={(e) => {
                          setNationalitySearch(e.target.value);
                          setShowNationalityDropdown(true);
                        }}
                        onFocus={() => setShowNationalityDropdown(true)}
                        placeholder="Search nationality..."
                        style={{
                          width: '100%',
                          padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                          border: '2px solid rgba(255,255,255,0.35)',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          outline: 'none',
                          transition: 'border-color 0.2s, box-shadow 0.2s',
                        }}
                        onBlur={() => setTimeout(() => setShowNationalityDropdown(false), 200)}
                      />
                      <Search
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '16px',
                          height: '16px',
                          color: 'rgba(15,23,42,0.4)',
                        }}
                      />
                    </div>
                    {showNationalityDropdown && filteredNationalities.length > 0 && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          maxHeight: '200px',
                          overflowY: 'auto',
                          background: 'white',
                          border: '1px solid rgba(255,255,255,0.25)',
                          borderRadius: '8px',
                          marginTop: '4px',
                          zIndex: 10,
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        {filteredNationalities.slice(0, 8).map((nat) => (
                          <button
                            key={nat}
                            onClick={() => {
                              setNationality(nat);
                              setNationalitySearch('');
                              setShowNationalityDropdown(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.75rem',
                              textAlign: 'left',
                              border: 'none',
                              background:
                                nationality === nat
                                  ? 'rgba(239,246,255,0.9)'
                                  : 'rgba(255,255,255,0.95)',
                              color: '#0f172a',
                              fontSize: '0.875rem',
                              cursor: 'pointer',
                              borderBottom: '1px solid #f3f4f6',
                            }}
                          >
                            {nat}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 4: Affiliation Tabs - Flight School / Operator */}
                <div style={{ marginTop: '1.5rem' }}>
                  {/* Tab Switcher */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <button
                      type="button"
                      onClick={() => setAffiliationTab('student')}
                      style={{
                        flex: 1,
                        padding: '0.6rem 1rem',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background:
                          affiliationTab === 'student'
                            ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                            : 'rgba(255,255,255,0.08)',
                        color: affiliationTab === 'student' ? '#ffffff' : '#0f172a',
                        boxShadow:
                          affiliationTab === 'student' ? '0 4px 12px rgba(220,38,38,0.25)' : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Student / Cadet Pilot
                    </button>
                    <button
                      type="button"
                      onClick={() => setAffiliationTab('operator')}
                      style={{
                        flex: 1,
                        padding: '0.6rem 1rem',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        background:
                          affiliationTab === 'operator'
                            ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                            : 'rgba(255,255,255,0.08)',
                        color: affiliationTab === 'operator' ? '#ffffff' : '#0f172a',
                        boxShadow:
                          affiliationTab === 'operator'
                            ? '0 4px 12px rgba(220,38,38,0.25)'
                            : 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Active Pilot / Newly Licensed CPL / Graduates
                    </button>
                  </div>

                  {affiliationTab === 'student' ? (
                    <>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {/* Country of ATO */}
                        <div>
                          <label
                            style={{
                              display: 'block',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: '#dc2626',
                              marginBottom: '0.5rem',
                            }}
                          >
                            Country of ATO *
                          </label>
                          <select
                            value={atoCountry}
                            onChange={(e) => {
                              setAtoCountry(e.target.value);
                              setAtoFlightSchoolSearch('');
                              setFlightSchoolAddress('');
                            }}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '2px solid rgba(255,255,255,0.35)',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              outline: 'none',
                              background: 'white',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="">Select country...</option>
                            {Object.keys(FLIGHT_SCHOOLS_BY_COUNTRY)
                              .sort()
                              .map((country) => (
                                <option key={country} value={country}>
                                  {country}
                                </option>
                              ))}
                          </select>
                        </div>

                        {/* Name of Flight School */}
                        <div ref={flightSchoolDropdownRef} style={{ position: 'relative' }}>
                          <label
                            style={{
                              display: 'block',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: '#dc2626',
                              marginBottom: '0.5rem',
                            }}
                          >
                            Name of Flight School / ATO *
                          </label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type="text"
                              value={atoFlightSchoolSearch}
                              onChange={(e) => {
                                setAtoFlightSchoolSearch(e.target.value);
                                setShowFlightSchoolDropdown(true);
                              }}
                              onFocus={() => setShowFlightSchoolDropdown(true)}
                              onBlur={() => {
                                if (atoCountry && atoFlightSchoolSearch) {
                                  setFlightSchoolAddress(atoFlightSchoolSearch);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && atoCountry && atoFlightSchoolSearch) {
                                  setFlightSchoolAddress(atoFlightSchoolSearch);
                                  setShowFlightSchoolDropdown(false);
                                }
                              }}
                              placeholder={
                                atoCountry
                                  ? 'Type to search flight schools...'
                                  : 'Select a country first'
                              }
                              disabled={!atoCountry}
                              style={{
                                width: '100%',
                                padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                                border: '2px solid rgba(255,255,255,0.35)',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'border-color 0.2s, box-shadow 0.2s',
                                opacity: atoCountry ? 1 : 0.6,
                                cursor: atoCountry ? 'text' : 'not-allowed',
                              }}
                              onFocusCapture={(e) => {
                                if (atoCountry) {
                                  e.currentTarget.style.borderColor = '#dc2626';
                                  e.currentTarget.style.boxShadow =
                                    '0 0 0 3px rgba(220, 38, 38, 0.1)';
                                }
                              }}
                              onBlurCapture={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            />
                            <Search
                              style={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '16px',
                                height: '16px',
                                color: 'rgba(15,23,42,0.4)',
                              }}
                            />
                          </div>
                          {showFlightSchoolDropdown && atoCountry && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 'calc(100% + 4px)',
                                left: 0,
                                right: 0,
                                zIndex: 20,
                                background: 'rgba(15, 23, 42, 0.92)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                                overflow: 'hidden',
                              }}
                            >
                              <div
                                style={{ maxHeight: '240px', overflowY: 'auto', padding: '0.5rem' }}
                              >
                                {filteredFlightSchools.map((school) => (
                                  <button
                                    key={school}
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                      setAtoFlightSchoolSearch(school);
                                      setFlightSchoolAddress(school);
                                      setShowFlightSchoolDropdown(false);
                                    }}
                                    style={{
                                      width: '100%',
                                      padding: '0.6rem 0.75rem',
                                      textAlign: 'left',
                                      border: 'none',
                                      borderRadius: '6px',
                                      background:
                                        atoFlightSchoolSearch === school
                                          ? 'rgba(220, 38, 38, 0.25)'
                                          : 'transparent',
                                      color:
                                        atoFlightSchoolSearch === school
                                          ? '#ffffff'
                                          : 'rgba(255,255,255,0.85)',
                                      fontSize: '0.875rem',
                                      cursor: 'pointer',
                                      transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={(e) => {
                                      if (atoFlightSchoolSearch !== school)
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                    }}
                                    onMouseLeave={(e) => {
                                      if (atoFlightSchoolSearch !== school)
                                        e.currentTarget.style.background = 'transparent';
                                    }}
                                  >
                                    {school}
                                  </button>
                                ))}
                                {atoFlightSchoolSearch && (
                                  <button
                                    type="button"
                                    onMouseDown={(e) => e.preventDefault()}
                                    onClick={() => {
                                      setFlightSchoolAddress(atoFlightSchoolSearch);
                                      setShowFlightSchoolDropdown(false);
                                    }}
                                    style={{
                                      width: '100%',
                                      marginTop: '0.5rem',
                                      padding: '0.6rem 0.75rem',
                                      textAlign: 'left',
                                      border: 'none',
                                      borderRadius: '6px',
                                      background: 'rgba(220, 38, 38, 0.15)',
                                      color: '#ffffff',
                                      fontSize: '0.85rem',
                                      fontWeight: 600,
                                      cursor: 'pointer',
                                      transition: 'all 0.15s',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '0.5rem',
                                      borderTop:
                                        filteredFlightSchools.length > 0
                                          ? '1px solid rgba(255,255,255,0.08)'
                                          : 'none',
                                    }}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.style.background = 'rgba(220, 38, 38, 0.3)';
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.style.background = 'rgba(220, 38, 38, 0.15)';
                                    }}
                                  >
                                    <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span>
                                    Add custom: "{atoFlightSchoolSearch}"
                                  </button>
                                )}
                                {filteredFlightSchools.length === 0 && !atoFlightSchoolSearch && (
                                  <div
                                    style={{
                                      padding: '1rem',
                                      textAlign: 'center',
                                      color: 'rgba(255,255,255,0.4)',
                                      fontSize: '0.8rem',
                                    }}
                                  >
                                    Start typing to search flight schools...
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <p
                        style={{
                          margin: '0.5rem 0 0',
                          fontSize: '0.75rem',
                          color: 'rgba(15,23,42,0.55)',
                        }}
                      >
                        Select your country first, then search and select your ATO. More schools
                        added regularly.
                      </p>
                    </>
                  ) : (
                    <>
                      {/* Pilot Operational Status Header */}
                      <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
                        <div
                          style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}
                        >
                          <span style={{ color: '#0f172a' }}>Current</span>{' '}
                          <span style={{ color: '#dc2626' }}>Pilot Operational Status?</span>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '0.8rem',
                            color: 'rgba(15,23,42,0.85)',
                            lineHeight: 1.5,
                            maxWidth: '480px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                          }}
                        >
                          We need to know your status so that pathways can be catered to your career
                          stage.
                        </p>
                      </div>

                      {/* Row 1: Country + Operator/ATO */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1fr 1fr',
                          gap: '1rem',
                          marginBottom: '1rem',
                        }}
                      >
                        {/* Country of Operator / ATO / TR Center */}
                        <div>
                          <label
                            style={{
                              display: 'block',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: '#dc2626',
                              marginBottom: '0.5rem',
                            }}
                          >
                            Country of Operator / ATO / TR Center *
                          </label>
                          <select
                            value={operatorCountry}
                            onChange={(e) => {
                              setOperatorCountry(e.target.value);
                              setOperatorNameSearch('');
                              setOperatorSearch('');
                              setPilotStatus('');
                            }}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              border: '2px solid rgba(255,255,255,0.35)',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              outline: 'none',
                              background: 'white',
                              cursor: 'pointer',
                            }}
                          >
                            <option value="">Select country...</option>
                            {Object.keys(OPERATORS_BY_COUNTRY)
                              .sort()
                              .map((country) => (
                                <option key={country} value={country}>
                                  {country}
                                </option>
                              ))}
                          </select>
                        </div>

                        {/* Operator / ATO / Type Rating Center / Other */}
                        <div ref={operatorNameRef} style={{ position: 'relative' }}>
                          <label
                            style={{
                              display: 'block',
                              fontSize: '0.875rem',
                              fontWeight: 600,
                              color: '#dc2626',
                              marginBottom: '0.5rem',
                            }}
                          >
                            Operator / ATO / Type Rating Center / Other *
                          </label>
                          <div style={{ position: 'relative' }}>
                            <input
                              type="text"
                              value={operatorNameSearch}
                              onChange={(e) => {
                                setOperatorNameSearch(e.target.value);
                                setShowOperatorNameDropdown(true);
                              }}
                              onFocus={() => setShowOperatorNameDropdown(true)}
                              onBlur={() => {
                                if (operatorCountry && operatorNameSearch) {
                                  setOperatorSearch(operatorNameSearch);
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && operatorCountry && operatorNameSearch) {
                                  setOperatorSearch(operatorNameSearch);
                                  setShowOperatorNameDropdown(false);
                                }
                              }}
                              placeholder={
                                operatorCountry
                                  ? 'Type to search operators...'
                                  : 'Select a country first'
                              }
                              disabled={!operatorCountry}
                              style={{
                                width: '100%',
                                padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                                border: '2px solid rgba(255,255,255,0.35)',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                outline: 'none',
                                transition: 'border-color 0.2s, box-shadow 0.2s',
                                opacity: operatorCountry ? 1 : 0.6,
                                cursor: operatorCountry ? 'text' : 'not-allowed',
                              }}
                              onFocusCapture={(e) => {
                                if (operatorCountry) {
                                  e.currentTarget.style.borderColor = '#dc2626';
                                  e.currentTarget.style.boxShadow =
                                    '0 0 0 3px rgba(220, 38, 38, 0.1)';
                                }
                              }}
                              onBlurCapture={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                                e.currentTarget.style.boxShadow = 'none';
                              }}
                            />
                            <Search
                              style={{
                                position: 'absolute',
                                right: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '16px',
                                height: '16px',
                                color: 'rgba(15,23,42,0.4)',
                              }}
                            />
                          </div>
                          {showOperatorNameDropdown && operatorCountry && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 'calc(100% + 4px)',
                                left: 0,
                                right: 0,
                                zIndex: 20,
                                background: 'rgba(15, 23, 42, 0.92)',
                                backdropFilter: 'blur(20px)',
                                WebkitBackdropFilter: 'blur(20px)',
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                                overflow: 'hidden',
                              }}
                            >
                              <div
                                style={{ maxHeight: '240px', overflowY: 'auto', padding: '0.5rem' }}
                              >
                                {(() => {
                                  const groups: Record<string, typeof filteredOperators> = {};
                                  filteredOperators.forEach((op) => {
                                    if (!groups[op.type]) groups[op.type] = [];
                                    groups[op.type].push(op);
                                  });
                                  const typeOrder = [
                                    'Airline',
                                    'Operator',
                                    'Type Rating Center',
                                    'ATO',
                                    'Other',
                                  ];
                                  const hasMatches = filteredOperators.length > 0;
                                  return (
                                    <>
                                      {typeOrder.map((type) => {
                                        const items = groups[type];
                                        if (!items || items.length === 0) return null;
                                        return (
                                          <div key={type}>
                                            <div
                                              style={{
                                                padding: '0.35rem 0.75rem',
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                color: 'rgba(220, 38, 38, 0.85)',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.05em',
                                                borderBottom: '1px solid rgba(255,255,255,0.06)',
                                                marginTop: '0.25rem',
                                              }}
                                            >
                                              {type}
                                            </div>
                                            {items.map((op) => (
                                              <button
                                                key={op.name}
                                                type="button"
                                                onMouseDown={(e) => e.preventDefault()}
                                                onClick={() => {
                                                  setOperatorNameSearch(op.name);
                                                  setOperatorSearch(op.name);
                                                  setShowOperatorNameDropdown(false);
                                                }}
                                                style={{
                                                  width: '100%',
                                                  padding: '0.5rem 0.75rem',
                                                  textAlign: 'left',
                                                  border: 'none',
                                                  borderRadius: '6px',
                                                  background:
                                                    operatorNameSearch === op.name
                                                      ? 'rgba(220, 38, 38, 0.25)'
                                                      : 'transparent',
                                                  color:
                                                    operatorNameSearch === op.name
                                                      ? '#ffffff'
                                                      : 'rgba(255,255,255,0.85)',
                                                  fontSize: '0.85rem',
                                                  cursor: 'pointer',
                                                  transition: 'all 0.15s',
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  gap: '0.5rem',
                                                }}
                                                onMouseEnter={(e) => {
                                                  if (operatorNameSearch !== op.name)
                                                    e.currentTarget.style.background =
                                                      'rgba(255,255,255,0.06)';
                                                }}
                                                onMouseLeave={(e) => {
                                                  if (operatorNameSearch !== op.name)
                                                    e.currentTarget.style.background =
                                                      'transparent';
                                                }}
                                              >
                                                <span
                                                  style={{
                                                    width: '6px',
                                                    height: '6px',
                                                    borderRadius: '50%',
                                                    background:
                                                      operatorNameSearch === op.name
                                                        ? '#dc2626'
                                                        : 'rgba(255,255,255,0.25)',
                                                    flexShrink: 0,
                                                  }}
                                                />
                                                {op.name}
                                              </button>
                                            ))}
                                          </div>
                                        );
                                      })}
                                      {operatorNameSearch && (
                                        <button
                                          type="button"
                                          onMouseDown={(e) => e.preventDefault()}
                                          onClick={() => {
                                            setOperatorNameSearch(operatorNameSearch);
                                            setOperatorSearch(operatorNameSearch);
                                            setShowOperatorNameDropdown(false);
                                          }}
                                          style={{
                                            width: '100%',
                                            marginTop: '0.5rem',
                                            padding: '0.6rem 0.75rem',
                                            textAlign: 'left',
                                            border: 'none',
                                            borderRadius: '6px',
                                            background: 'rgba(220, 38, 38, 0.15)',
                                            color: '#ffffff',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            transition: 'all 0.15s',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            borderTop: hasMatches
                                              ? '1px solid rgba(255,255,255,0.08)'
                                              : 'none',
                                          }}
                                          onMouseEnter={(e) => {
                                            e.currentTarget.style.background =
                                              'rgba(220, 38, 38, 0.3)';
                                          }}
                                          onMouseLeave={(e) => {
                                            e.currentTarget.style.background =
                                              'rgba(220, 38, 38, 0.15)';
                                          }}
                                        >
                                          <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span>
                                          Add custom: "{operatorNameSearch}"
                                        </button>
                                      )}
                                      {!hasMatches && !operatorNameSearch && (
                                        <div
                                          style={{
                                            padding: '1rem',
                                            textAlign: 'center',
                                            color: 'rgba(255,255,255,0.4)',
                                            fontSize: '0.8rem',
                                          }}
                                        >
                                          Start typing to search operators...
                                        </div>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Row 2: Their Status — Custom based on situation */}
                      <div ref={pilotStatusRef} style={{ position: 'relative' }}>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#dc2626',
                            marginBottom: '0.5rem',
                          }}
                        >
                          Your Current Pilot Status *
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            value={pilotStatus}
                            onChange={(e) => {
                              setPilotStatus(e.target.value);
                              setShowPilotStatusDropdown(true);
                            }}
                            onFocus={() => setShowPilotStatusDropdown(true)}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                setShowPilotStatusDropdown(false);
                              }
                            }}
                            placeholder="e.g. employed, waiting for CFI, low hours, Active CFI operations, Airline mention..."
                            style={{
                              width: '100%',
                              padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                              border: '2px solid rgba(255,255,255,0.35)',
                              borderRadius: '8px',
                              fontSize: '0.875rem',
                              outline: 'none',
                              transition: 'border-color 0.2s, box-shadow 0.2s',
                            }}
                            onFocusCapture={(e) => {
                              e.currentTarget.style.borderColor = '#dc2626';
                              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                            }}
                          />
                          <Search
                            style={{
                              position: 'absolute',
                              right: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              width: '16px',
                              height: '16px',
                              color: 'rgba(15,23,42,0.4)',
                            }}
                          />
                        </div>
                        {showPilotStatusDropdown && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 'calc(100% + 4px)',
                              left: 0,
                              right: 0,
                              zIndex: 20,
                              background: 'rgba(15, 23, 42, 0.92)',
                              backdropFilter: 'blur(20px)',
                              WebkitBackdropFilter: 'blur(20px)',
                              borderRadius: '12px',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                              overflow: 'hidden',
                            }}
                          >
                            <div
                              style={{ maxHeight: '280px', overflowY: 'auto', padding: '0.5rem' }}
                            >
                              {filteredPilotStatuses.map((status) => (
                                <button
                                  key={status}
                                  type="button"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    setPilotStatus(status);
                                    setShowPilotStatusDropdown(false);
                                  }}
                                  style={{
                                    width: '100%',
                                    padding: '0.5rem 0.75rem',
                                    textAlign: 'left',
                                    border: 'none',
                                    borderRadius: '6px',
                                    background:
                                      pilotStatus === status
                                        ? 'rgba(220, 38, 38, 0.25)'
                                        : 'transparent',
                                    color:
                                      pilotStatus === status ? '#ffffff' : 'rgba(255,255,255,0.85)',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                  }}
                                  onMouseEnter={(e) => {
                                    if (pilotStatus !== status)
                                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                  }}
                                  onMouseLeave={(e) => {
                                    if (pilotStatus !== status)
                                      e.currentTarget.style.background = 'transparent';
                                  }}
                                >
                                  <span
                                    style={{
                                      width: '6px',
                                      height: '6px',
                                      borderRadius: '50%',
                                      background:
                                        pilotStatus === status
                                          ? '#dc2626'
                                          : 'rgba(255,255,255,0.25)',
                                      flexShrink: 0,
                                    }}
                                  />
                                  {status}
                                </button>
                              ))}
                              {pilotStatus && !PREDEFINED_PILOT_STATUSES.includes(pilotStatus) && (
                                <button
                                  type="button"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    setShowPilotStatusDropdown(false);
                                  }}
                                  style={{
                                    width: '100%',
                                    marginTop: '0.5rem',
                                    padding: '0.6rem 0.75rem',
                                    textAlign: 'left',
                                    border: 'none',
                                    borderRadius: '6px',
                                    background: 'rgba(220, 38, 38, 0.15)',
                                    color: '#ffffff',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.15s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    borderTop:
                                      filteredPilotStatuses.length > 0
                                        ? '1px solid rgba(255,255,255,0.08)'
                                        : 'none',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(220, 38, 38, 0.3)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(220, 38, 38, 0.15)';
                                  }}
                                >
                                  <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span>
                                  Use custom: "{pilotStatus}"
                                </button>
                              )}
                              {filteredPilotStatuses.length === 0 && !pilotStatus && (
                                <div
                                  style={{
                                    padding: '1rem',
                                    textAlign: 'center',
                                    color: 'rgba(255,255,255,0.4)',
                                    fontSize: '0.8rem',
                                  }}
                                >
                                  Start typing to describe your status...
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                        <p
                          style={{
                            margin: '0.25rem 0 0',
                            fontSize: '0.75rem',
                            color: 'rgba(15,23,42,0.55)',
                          }}
                        >
                          Describe your current situation so pathways can be tailored to your career
                          stage.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Row 5: Languages */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: '1.5rem',
                    marginTop: '1.5rem',
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#0f172a',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Languages You Speak *
                    </label>
                    <input
                      type="text"
                      value={languages}
                      onChange={(e) => setLanguages(e.target.value)}
                      placeholder="e.g. English, Arabic, French"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid rgba(255,255,255,0.35)',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#dc2626';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    <p
                      style={{
                        margin: '0.25rem 0 0',
                        fontSize: '0.75rem',
                        color: 'rgba(15,23,42,0.55)',
                      }}
                    >
                      Enter languages separated by commas
                    </p>
                  </div>
                </div>

                {/* English Proficiency */}
                <div
                  ref={englishProficiencyRef}
                  style={{ marginTop: '1.5rem', position: 'relative' }}
                >
                  <label
                    style={{
                      display: 'block',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: '#dc2626',
                      marginBottom: '0.5rem',
                    }}
                  >
                    English Proficiency Level *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={englishProficiencySearch}
                      onChange={(e) => {
                        setEnglishProficiencySearch(e.target.value);
                        setShowEnglishProficiencyDropdown(true);
                      }}
                      onFocus={() => setShowEnglishProficiencyDropdown(true)}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setEnglishProficiency(englishProficiencySearch);
                          setShowEnglishProficiencyDropdown(false);
                        }
                      }}
                      placeholder={
                        englishProficiency
                          ? englishProficiency
                          : 'Type to search proficiency level...'
                      }
                      style={{
                        width: '100%',
                        padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                        border: '2px solid rgba(255,255,255,0.35)',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        outline: 'none',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                      }}
                      onFocusCapture={(e) => {
                        e.currentTarget.style.borderColor = '#dc2626';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
                      }}
                    />
                    <Search
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        color: 'rgba(15,23,42,0.4)',
                      }}
                    />
                  </div>
                  {showEnglishProficiencyDropdown && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        zIndex: 20,
                        background: 'rgba(15, 23, 42, 0.92)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ maxHeight: '240px', overflowY: 'auto', padding: '0.5rem' }}>
                        {filteredEnglishProficiencyLevels.map((level) => (
                          <button
                            key={level}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setEnglishProficiency(level);
                              setEnglishProficiencySearch(level);
                              setShowEnglishProficiencyDropdown(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '0.5rem 0.75rem',
                              textAlign: 'left',
                              border: 'none',
                              borderRadius: '6px',
                              background:
                                englishProficiency === level
                                  ? 'rgba(220, 38, 38, 0.25)'
                                  : 'transparent',
                              color:
                                englishProficiency === level ? '#ffffff' : 'rgba(255,255,255,0.85)',
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                            }}
                            onMouseEnter={(e) => {
                              if (englishProficiency !== level)
                                e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                            }}
                            onMouseLeave={(e) => {
                              if (englishProficiency !== level)
                                e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                background:
                                  englishProficiency === level
                                    ? '#dc2626'
                                    : 'rgba(255,255,255,0.25)',
                                flexShrink: 0,
                              }}
                            />
                            {level}
                          </button>
                        ))}
                        {englishProficiencySearch &&
                          !ENGLISH_PROFICIENCY_LEVELS.includes(englishProficiencySearch) && (
                            <button
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => {
                                setEnglishProficiency(englishProficiencySearch);
                                setShowEnglishProficiencyDropdown(false);
                              }}
                              style={{
                                width: '100%',
                                marginTop: '0.5rem',
                                padding: '0.6rem 0.75rem',
                                textAlign: 'left',
                                border: 'none',
                                borderRadius: '6px',
                                background: 'rgba(220, 38, 38, 0.15)',
                                color: '#ffffff',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.15s',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                borderTop:
                                  filteredEnglishProficiencyLevels.length > 0
                                    ? '1px solid rgba(255,255,255,0.08)'
                                    : 'none',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(220, 38, 38, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(220, 38, 38, 0.15)';
                              }}
                            >
                              <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span>
                              Use custom: "{englishProficiencySearch}"
                            </button>
                          )}
                        {filteredEnglishProficiencyLevels.length === 0 &&
                          !englishProficiencySearch && (
                            <div
                              style={{
                                padding: '1rem',
                                textAlign: 'center',
                                color: 'rgba(255,255,255,0.4)',
                                fontSize: '0.8rem',
                              }}
                            >
                              Start typing to search proficiency levels...
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                  <p
                    style={{
                      margin: '0.25rem 0 0',
                      fontSize: '0.75rem',
                      color: 'rgba(15,23,42,0.55)',
                    }}
                  >
                    ICAO English Language Proficiency Rating
                  </p>
                </div>
              </motion.section>

              {/* Personal Details CTA */}
              {embedded && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '0.5rem',
                    marginBottom: '2rem',
                  }}
                >
                  <button
                    onClick={() => {
                      handleSave();
                      onNavigateSection?.('license-medical');
                    }}
                    disabled={isSaving}
                    style={{
                      padding: '0.75rem 2rem',
                      borderRadius: '10px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                      color: '#ffffff',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      opacity: isSaving ? 0.7 : 1,
                      boxShadow: '0 4px 12px rgba(220,38,38,0.25)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSaving) {
                        e.currentTarget.style.boxShadow = '0 6px 20px rgba(220,38,38,0.35)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(220,38,38,0.25)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {isSaving ? 'Saving...' : 'Continue to License & Medical →'}
                  </button>
                </motion.div>
              )}
            </div>
          )}

          {/* License Information Section - Glassy UI */}
          {visibleSection === 'license-medical' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '80vh',
              }}
            >
              {licenseStage === 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: 'relative',
                    zIndex: showAuthorityDropdown ? 100 : undefined,
                    background: 'rgba(255, 255, 255, 0.35)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderRadius: '16px',
                    padding: embedded ? '1.25rem 2rem 1.25rem 1.25rem' : '1.5rem',
                    margin: embedded ? '2rem auto' : undefined,
                    maxWidth: embedded ? '960px' : undefined,
                    border: '1px solid rgba(255, 255, 255, 0.45)',
                    boxShadow:
                      '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255,255,255,0.4)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.25rem',
                      paddingBottom: '0.75rem',
                      borderBottom: '1px solid rgba(255,255,255,0.35)',
                    }}
                  >
                    <IdCard style={{ width: '20px', height: '20px', color: '#001E3C' }} />
                    <h2
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        margin: 0,
                      }}
                    >
                      <span style={{ color: 'white' }}>License</span>{' '}
                      <span style={{ color: '#dc2626' }}>Information</span>
                    </h2>
                  </div>

                  {/* License Claim Notice */}
                  <div
                    style={{
                      background: 'rgba(220, 38, 38, 0.08)',
                      border: '1px solid rgba(220, 38, 38, 0.2)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                    }}
                  >
                    <Shield
                      style={{
                        width: '14px',
                        height: '14px',
                        color: '#dc2626',
                        marginTop: '2px',
                        flexShrink: 0,
                      }}
                    />
                    <p
                      style={{ margin: 0, fontSize: '0.75rem', color: '#374151', lineHeight: 1.5 }}
                    >
                      We only hold the claim data of your license governing authority and expiration
                      date as a withholding claim, so that operators will see your current status as
                      a pilot as a free user non-verified through pathway submission of interests.
                    </p>
                  </div>

                  {/* Pilot Licenses - Multi Select */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#374151',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Current License(s) Held *
                    </label>
                    <p
                      style={{
                        margin: '0 0 0.75rem',
                        fontSize: '0.7rem',
                        color: 'rgba(55,65,81,0.7)',
                        lineHeight: 1.5,
                      }}
                    >
                      A detailed audit of individual licenses will undergo the{' '}
                      <strong style={{ color: '#dc2626' }}>
                        Recognition+ Verification Process
                      </strong>{' '}
                      and will be verified with the governing aviation authority that you provide
                      us.
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {LICENSE_TYPES.map((license) => (
                        <button
                          key={license}
                          onClick={() => toggleLicense(license)}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            border: '1px solid',
                            borderColor: currentLicenses.includes(license)
                              ? 'transparent'
                              : 'rgba(255,255,255,0.6)',
                            background: currentLicenses.includes(license)
                              ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                              : 'rgba(255,255,255,0.5)',
                            color: currentLicenses.includes(license) ? 'white' : '#374151',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            fontWeight: 500,
                            boxShadow: currentLicenses.includes(license)
                              ? '0 2px 8px rgba(220,38,38,0.3)'
                              : 'none',
                            transition: 'all 0.15s',
                          }}
                        >
                          {license}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '1.5rem',
                    }}
                  >
                    <div
                      ref={authorityDropdownRef}
                      style={{
                        position: 'relative',
                        zIndex: showAuthorityDropdown ? 9999 : undefined,
                      }}
                    >
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Issuing Authority / Governing Aviation Authority
                      </label>
                      <div
                        style={{ position: 'relative', cursor: 'pointer' }}
                        onClick={() => setShowAuthorityDropdown(!showAuthorityDropdown)}
                      >
                        <div
                          style={{
                            width: '100%',
                            padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                            border: '1px solid rgba(0,0,0,0.08)',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            background: 'white',
                            color: licenseCountryOfIssue ? '#0f172a' : '#9ca3af',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {licenseCountryOfIssue
                              ? (() => {
                                  const a = AVIATION_AUTHORITIES.find(
                                    (x) => x.authority === licenseCountryOfIssue
                                  );
                                  return a
                                    ? `${a.authority} — ${a.fullName}`
                                    : licenseCountryOfIssue;
                                })()
                              : 'Select authority'}
                          </span>
                        </div>
                        <ChevronDown
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: `translateY(-50%) ${showAuthorityDropdown ? 'rotate(180deg)' : ''}`,
                            width: '16px',
                            height: '16px',
                            color: '#9ca3af',
                            transition: 'transform 0.2s',
                          }}
                        />
                      </div>

                      {showAuthorityDropdown && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 4px)',
                            left: 0,
                            right: 0,
                            zIndex: 9999,
                            background: '#1e293b',
                            backdropFilter: 'none',
                            WebkitBackdropFilter: 'none',
                            borderRadius: '12px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                            overflow: 'hidden',
                          }}
                        >
                          {/* Search header */}
                          <div
                            style={{
                              padding: '0.75rem',
                              borderBottom: '1px solid rgba(255,255,255,0.08)',
                              position: 'relative',
                            }}
                          >
                            <Search
                              style={{
                                position: 'absolute',
                                left: '1.25rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '14px',
                                height: '14px',
                                color: 'rgba(255,255,255,0.4)',
                              }}
                            />
                            <input
                              type="text"
                              autoFocus
                              placeholder="Search authority or country..."
                              value={authoritySearch}
                              onChange={(e) => setAuthoritySearch(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                width: '100%',
                                padding: '0.5rem 0.75rem 0.5rem 2rem',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: '8px',
                                fontSize: '0.8rem',
                                color: 'white',
                                outline: 'none',
                              }}
                            />
                          </div>

                          {/* Authority list */}
                          {(() => {
                            const q = authoritySearch.toLowerCase().trim();
                            const list = q
                              ? AVIATION_AUTHORITIES.filter(
                                  (a) =>
                                    a.authority.toLowerCase().includes(q) ||
                                    a.country.toLowerCase().includes(q) ||
                                    a.fullName.toLowerCase().includes(q)
                                )
                              : AVIATION_AUTHORITIES;
                            return (
                              <div
                                key={authoritySearch}
                                className="authority-scroll"
                                style={{
                                  maxHeight: '280px',
                                  overflowY: 'scroll',
                                  padding: '0.5rem',
                                  scrollbarColor: '#dc2626 #334155',
                                  scrollbarWidth: 'thin',
                                }}
                              >
                                <div
                                  style={{
                                    fontSize: '0.65rem',
                                    color: 'rgba(255,255,255,0.3)',
                                    padding: '0 0.5rem 0.25rem',
                                    fontFamily: 'monospace',
                                  }}
                                >
                                  search: "{authoritySearch}" | results: {list.length}
                                </div>
                                {list.length === 0 ? (
                                  <div
                                    style={{
                                      padding: '1rem',
                                      textAlign: 'center',
                                      color: 'rgba(255,255,255,0.4)',
                                      fontSize: '0.8rem',
                                    }}
                                  >
                                    No authorities found
                                  </div>
                                ) : (
                                  list.map((auth) => {
                                    const isSelected = licenseCountryOfIssue === auth.authority;
                                    return (
                                      <button
                                        key={auth.authority}
                                        type="button"
                                        onClick={() => {
                                          setLicenseCountryOfIssue(auth.authority);
                                          setAuthoritySearch('');
                                          setShowAuthorityDropdown(false);
                                        }}
                                        style={{
                                          width: '100%',
                                          padding: '0.6rem 0.75rem',
                                          textAlign: 'left',
                                          border: 'none',
                                          borderRadius: '6px',
                                          background: isSelected
                                            ? 'rgba(220, 38, 38, 0.25)'
                                            : 'transparent',
                                          cursor: 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'space-between',
                                          gap: '0.5rem',
                                          transition: 'all 0.15s',
                                        }}
                                        onMouseEnter={(e) => {
                                          if (!isSelected)
                                            e.currentTarget.style.background =
                                              'rgba(255,255,255,0.06)';
                                        }}
                                        onMouseLeave={(e) => {
                                          if (!isSelected)
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            minWidth: 0,
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontSize: '0.7rem',
                                              fontWeight: 700,
                                              color: 'white',
                                              background: '#dc2626',
                                              padding: '0.15rem 0.5rem',
                                              borderRadius: '9999px',
                                              whiteSpace: 'nowrap',
                                              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                                            }}
                                          >
                                            {auth.authority}
                                          </span>
                                          <div
                                            style={{
                                              display: 'flex',
                                              flexDirection: 'column',
                                              minWidth: 0,
                                            }}
                                          >
                                            <span
                                              style={{
                                                fontSize: '0.8rem',
                                                fontWeight: isSelected ? 600 : 400,
                                                color: isSelected
                                                  ? '#ffffff'
                                                  : 'rgba(255,255,255,0.85)',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                              }}
                                            >
                                              {auth.fullName}
                                            </span>
                                            <span
                                              style={{
                                                fontSize: '0.7rem',
                                                color: 'rgba(255,255,255,0.4)',
                                              }}
                                            >
                                              {auth.country}
                                            </span>
                                          </div>
                                        </div>
                                        {isSelected && (
                                          <Check
                                            style={{
                                              width: '14px',
                                              height: '14px',
                                              color: '#f87171',
                                              flexShrink: 0,
                                            }}
                                          />
                                        )}
                                      </button>
                                    );
                                  })
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Pilot License Expiration Date *
                        {isDateExpired(licenseExpiry) && (
                          <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 500 }}>
                            (Expired)
                          </span>
                        )}
                      </label>
                      <input
                        type="date"
                        value={licenseExpiry}
                        onChange={(e) => setLicenseExpiry(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: 'white',
                          border: `1px solid ${isDateExpired(licenseExpiry) ? '#ef4444' : 'rgba(0,0,0,0.08)'}`,
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontFamily: MONO_FONT,
                          outline: 'none',
                          transition: 'all 0.15s',
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '1.5rem',
                    }}
                  >
                    <button
                      disabled
                      style={{
                        padding: '0.6rem 1.5rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(220, 38, 38, 0.25)',
                        background: '#ffffff',
                        color: '#dc2626',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'not-allowed',
                        opacity: 0.5,
                      }}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setLicenseStage(1)}
                      style={{
                        padding: '0.6rem 1.5rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(220,38,38,0.25)',
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </motion.section>
              )}

              {/* Medical Certificate Section - Glassy UI */}
              {licenseStage === 1 && (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.35)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    margin: embedded ? '2rem auto' : undefined,
                    maxWidth: embedded ? '960px' : undefined,
                    border: '1px solid rgba(255, 255, 255, 0.45)',
                    boxShadow:
                      '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255,255,255,0.4)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.25rem',
                      paddingBottom: '0.75rem',
                      borderBottom: '1px solid rgba(255,255,255,0.35)',
                    }}
                  >
                    <Plus style={{ width: '20px', height: '20px', color: '#dc2626' }} />
                    <h2
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        margin: 0,
                      }}
                    >
                      <span style={{ color: 'white' }}>Medical License</span>{' '}
                      <span style={{ color: '#dc2626' }}>Validity</span>
                    </h2>
                  </div>

                  {/* Medical Claim Notice */}
                  <div
                    style={{
                      background: 'rgba(220, 38, 38, 0.08)',
                      border: '1px solid rgba(220, 38, 38, 0.2)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                    }}
                  >
                    <Shield
                      style={{
                        width: '14px',
                        height: '14px',
                        color: '#dc2626',
                        marginTop: '2px',
                        flexShrink: 0,
                      }}
                    />
                    <p
                      style={{ margin: 0, fontSize: '0.75rem', color: '#374151', lineHeight: 1.5 }}
                    >
                      This medical information is a claim until proven to be verified by the
                      governing aviation authority that issued your medical, through the{' '}
                      <strong style={{ color: '#dc2626' }}>
                        Recognition+ Verification Process
                      </strong>
                      .
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '1.5rem',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Medical Certificate Expiration Date *
                        {isDateExpired(medicalExpiry) && (
                          <span style={{ color: '#ef4444', fontSize: '0.75rem', fontWeight: 500 }}>
                            (Expired)
                          </span>
                        )}
                      </label>
                      <input
                        type="date"
                        value={medicalExpiry}
                        onChange={(e) => setMedicalExpiry(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: 'white',
                          border: `1px solid ${isDateExpired(medicalExpiry) ? '#ef4444' : 'rgba(0,0,0,0.08)'}`,
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontFamily: MONO_FONT,
                          outline: 'none',
                          transition: 'all 0.15s',
                        }}
                      />
                    </div>

                    <div
                      ref={medicalDropdownRef}
                      style={{
                        position: 'relative',
                        zIndex: showMedicalAuthorityDropdown ? 9999 : undefined,
                      }}
                    >
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Governing Aviation Authority Issuer *
                      </label>
                      <div
                        ref={medicalTriggerRef}
                        style={{ position: 'relative', cursor: 'pointer' }}
                        onClick={() =>
                          setShowMedicalAuthorityDropdown(!showMedicalAuthorityDropdown)
                        }
                      >
                        <div
                          style={{
                            width: '100%',
                            padding: '0.75rem 2.5rem 0.75rem 0.75rem',
                            border: '1px solid rgba(0,0,0,0.08)',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            background: 'white',
                            color: medicalCountry ? '#0f172a' : '#9ca3af',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span
                            style={{
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {medicalCountry
                              ? (() => {
                                  const a = AVIATION_AUTHORITIES.find(
                                    (x) => x.authority === medicalCountry
                                  );
                                  return a ? `${a.authority} — ${a.fullName}` : medicalCountry;
                                })()
                              : 'Select authority'}
                          </span>
                        </div>
                        <ChevronDown
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '50%',
                            transform: `translateY(-50%) ${showMedicalAuthorityDropdown ? 'rotate(180deg)' : ''}`,
                            width: '16px',
                            height: '16px',
                            color: '#9ca3af',
                            transition: 'transform 0.2s',
                          }}
                        />
                      </div>

                      {showMedicalAuthorityDropdown &&
                        medicalDropdownPos &&
                        createPortal(
                          <div
                            ref={medicalPortalRef}
                            style={{
                              position: 'fixed',
                              top: medicalDropdownPos.top,
                              left: medicalDropdownPos.left,
                              width: medicalDropdownPos.width,
                              zIndex: 99999,
                              background: '#1e293b',
                              backdropFilter: 'none',
                              WebkitBackdropFilter: 'none',
                              borderRadius: '12px',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
                              overflow: 'hidden',
                            }}
                          >
                            {/* Search header */}
                            <div
                              style={{
                                padding: '0.75rem',
                                borderBottom: '1px solid rgba(255,255,255,0.08)',
                                position: 'relative',
                              }}
                            >
                              <Search
                                style={{
                                  position: 'absolute',
                                  left: '1.25rem',
                                  top: '50%',
                                  transform: 'translateY(-50%)',
                                  width: '14px',
                                  height: '14px',
                                  color: 'rgba(255,255,255,0.4)',
                                }}
                              />
                              <input
                                type="text"
                                autoFocus
                                placeholder="Search authority or country..."
                                value={medicalAuthoritySearch}
                                onChange={(e) => setMedicalAuthoritySearch(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                style={{
                                  width: '100%',
                                  padding: '0.5rem 0.75rem 0.5rem 2rem',
                                  background: 'rgba(255,255,255,0.08)',
                                  border: '1px solid rgba(255,255,255,0.12)',
                                  borderRadius: '8px',
                                  fontSize: '0.8rem',
                                  color: 'white',
                                  outline: 'none',
                                }}
                              />
                            </div>

                            {/* Authority list */}
                            <div
                              key={medicalAuthoritySearch}
                              className="authority-scroll"
                              style={{
                                maxHeight: '280px',
                                overflowY: 'scroll',
                                padding: '0.5rem',
                                scrollbarColor: '#dc2626 #334155',
                                scrollbarWidth: 'thin',
                              }}
                            >
                              {(() => {
                                const q = medicalAuthoritySearch.toLowerCase().trim();
                                const list = q
                                  ? AVIATION_AUTHORITIES.filter(
                                      (a) =>
                                        a.authority.toLowerCase().includes(q) ||
                                        a.country.toLowerCase().includes(q) ||
                                        a.fullName.toLowerCase().includes(q)
                                    )
                                  : AVIATION_AUTHORITIES;
                                if (list.length === 0) {
                                  return (
                                    <div
                                      style={{
                                        padding: '1rem',
                                        textAlign: 'center',
                                        color: 'rgba(255,255,255,0.4)',
                                        fontSize: '0.8rem',
                                      }}
                                    >
                                      No authorities found
                                    </div>
                                  );
                                }
                                return list.map((auth) => {
                                  const isSelected = medicalCountry === auth.authority;
                                  return (
                                    <button
                                      key={auth.authority}
                                      type="button"
                                      onClick={() => {
                                        setMedicalCountry(auth.authority);
                                        setMedicalAuthoritySearch('');
                                        setShowMedicalAuthorityDropdown(false);
                                      }}
                                      style={{
                                        width: '100%',
                                        padding: '0.6rem 0.75rem',
                                        textAlign: 'left',
                                        border: 'none',
                                        borderRadius: '6px',
                                        background: isSelected
                                          ? 'rgba(220, 38, 38, 0.25)'
                                          : 'transparent',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '0.5rem',
                                        transition: 'all 0.15s',
                                      }}
                                      onMouseEnter={(e) => {
                                        if (!isSelected)
                                          e.currentTarget.style.background =
                                            'rgba(255,255,255,0.06)';
                                      }}
                                      onMouseLeave={(e) => {
                                        if (!isSelected)
                                          e.currentTarget.style.background = 'transparent';
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '0.75rem',
                                          minWidth: 0,
                                        }}
                                      >
                                        <span
                                          style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            color: 'white',
                                            background: '#dc2626',
                                            padding: '0.15rem 0.5rem',
                                            borderRadius: '9999px',
                                            whiteSpace: 'nowrap',
                                            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                                          }}
                                        >
                                          {auth.authority}
                                        </span>
                                        <div
                                          style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            minWidth: 0,
                                          }}
                                        >
                                          <span
                                            style={{
                                              fontSize: '0.8rem',
                                              fontWeight: isSelected ? 600 : 400,
                                              color: isSelected
                                                ? '#ffffff'
                                                : 'rgba(255,255,255,0.85)',
                                              whiteSpace: 'nowrap',
                                              overflow: 'hidden',
                                              textOverflow: 'ellipsis',
                                            }}
                                          >
                                            {auth.fullName}
                                          </span>
                                          <span
                                            style={{
                                              fontSize: '0.7rem',
                                              color: 'rgba(255,255,255,0.4)',
                                            }}
                                          >
                                            {auth.country}
                                          </span>
                                        </div>
                                      </div>
                                      {isSelected && (
                                        <Check
                                          style={{
                                            width: '14px',
                                            height: '14px',
                                            color: '#f87171',
                                            flexShrink: 0,
                                          }}
                                        />
                                      )}
                                    </button>
                                  );
                                });
                              })()}
                            </div>
                          </div>,
                          document.body
                        )}
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '0.75rem',
                        }}
                      >
                        Medical Class *
                        {uploadedDocs.some(
                          (d) => d.type === 'medical' && d.status === 'pending_review'
                        ) && (
                          <span
                            style={{
                              fontSize: '0.7rem',
                              color: EMERALD,
                              background: '#f0fdf4',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px',
                              border: `1px solid ${EMERALD}`,
                              fontWeight: 500,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                            }}
                          >
                            <Check style={{ width: '10px', height: '10px' }} />
                            Auto-filled from document
                          </span>
                        )}
                      </label>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {MEDICAL_CLASSES.map((medClass) => (
                          <button
                            key={medClass}
                            onClick={() => setMedicalClass(medClass)}
                            style={{
                              padding: '1rem 1.5rem',
                              borderRadius: '6px',
                              border: '1px solid',
                              borderColor:
                                medicalClass === medClass ? 'transparent' : 'rgba(255,255,255,0.6)',
                              background:
                                medicalClass === medClass
                                  ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                                  : 'rgba(255,255,255,0.5)',
                              color: medicalClass === medClass ? 'white' : '#374151',
                              fontSize: '0.9rem',
                              cursor: 'pointer',
                              fontWeight: medicalClass === medClass ? 700 : 500,
                              flex: 1,
                              boxShadow:
                                medicalClass === medClass
                                  ? '0 2px 8px rgba(220,38,38,0.3)'
                                  : 'none',
                              transition: 'all 0.15s',
                            }}
                          >
                            {medClass}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '1.5rem',
                    }}
                  >
                    <button
                      onClick={() => setLicenseStage(0)}
                      style={{
                        padding: '0.6rem 1.5rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(220, 38, 38, 0.25)',
                        background: '#ffffff',
                        color: '#dc2626',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setLicenseStage(2)}
                      style={{
                        padding: '0.6rem 1.5rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(220,38,38,0.25)',
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </motion.section>
              )}

              {/* Radio License Section - Glassy UI */}
              {licenseStage === 2 && (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.35)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    margin: embedded ? '2rem auto' : undefined,
                    maxWidth: embedded ? '960px' : undefined,
                    border: '1px solid rgba(255, 255, 255, 0.45)',
                    boxShadow:
                      '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255,255,255,0.4)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.25rem',
                      paddingBottom: '0.75rem',
                      borderBottom: '1px solid rgba(255,255,255,0.35)',
                    }}
                  >
                    <Radio style={{ width: '20px', height: '20px', color: '#001E3C' }} />
                    <h2
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: SLATE[800],
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        margin: 0,
                      }}
                    >
                      Radio License
                    </h2>
                  </div>

                  {/* Radio License Claim Notice */}
                  <div
                    style={{
                      background: 'rgba(220, 38, 38, 0.08)',
                      border: '1px solid rgba(220, 38, 38, 0.2)',
                      borderRadius: '8px',
                      padding: '0.75rem 1rem',
                      marginBottom: '1.25rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.5rem',
                    }}
                  >
                    <Shield
                      style={{
                        width: '14px',
                        height: '14px',
                        color: '#dc2626',
                        marginTop: '2px',
                        flexShrink: 0,
                      }}
                    />
                    <p
                      style={{ margin: 0, fontSize: '0.75rem', color: '#374151', lineHeight: 1.5 }}
                    >
                      This radio license information is a claim until proven to be verified by the
                      governing aviation authority that issued your radio license, through the{' '}
                      <strong style={{ color: '#dc2626' }}>
                        Recognition+ Verification Process
                      </strong>
                      .
                    </p>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '1.5rem',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Radio License Country of Issue
                      </label>
                      <select
                        value={radioLicenseCountry}
                        onChange={(e) => setRadioLicenseCountry(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid rgba(0,0,0,0.08)',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          background: 'white',
                        }}
                      >
                        <option value="">Select country</option>
                        {NATIONALITIES.map((country) => (
                          <option key={country} value={country}>
                            {country}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Radio License Expiration Date
                      </label>
                      <input
                        type="date"
                        value={radioLicenseExpiry}
                        onChange={(e) => setRadioLicenseExpiry(e.target.value)}
                        placeholder="DD / MM / YYYY"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          background: 'white',
                          border: '1px solid rgba(0,0,0,0.08)',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontFamily: MONO_FONT,
                        }}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '1.5rem',
                    }}
                  >
                    <button
                      onClick={() => setLicenseStage(1)}
                      style={{
                        padding: '0.6rem 1.5rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(220, 38, 38, 0.25)',
                        background: '#ffffff',
                        color: '#dc2626',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => onNavigateSection?.('aircraft-ratings')}
                      style={{
                        padding: '0.6rem 1.5rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                        color: '#ffffff',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(220,38,38,0.25)',
                      }}
                    >
                      Continue to Aircraft Ratings →
                    </button>
                  </div>
                </motion.section>
              )}
            </div>
          )}

          {/* Aircraft Type Ratings Search */}
          {visibleSection === 'aircraft-ratings' && (
            <>
              <AircraftRatingsSearch />
            </>
          )}

          {visibleSection === 'endorsements' && (
            <>
              {/* Pilot Endorsements and Additional Ratings */}
              <motion.section
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background: 'white',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  marginBottom: '2rem',
                  border: `1px solid ${SLATE[300]}`,
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  overflow: 'visible',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '1.5rem',
                    paddingBottom: '0.75rem',
                    borderBottom: `1px solid ${SLATE[200]}`,
                  }}
                >
                  <Shield style={{ width: '20px', height: '20px', color: '#001E3C' }} />
                  <h3
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: SLATE[800],
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      margin: 0,
                    }}
                  >
                    Pilot Endorsements and Additional Ratings
                  </h3>
                </div>

                <EndorsementsSearch
                  selectedIds={Object.keys(endorsements).filter((k) => endorsements[k])}
                  onToggle={(id) => setEndorsements((prev) => ({ ...prev, [id]: !prev[id] }))}
                />
              </motion.section>
            </>
          )}

          {/* Pilot Status and Interests Section */}
          {visibleSection === 'experience-career' && (
            <>
              {/* Wizard Progress */}
              {experienceStep < 5 && (
                <div
                  style={{
                    marginBottom: '1.5rem',
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.6)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <h3
                      style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#001E3C' }}
                    >
                      Step {experienceStep + 1} of 5
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: SLATE[500] }}>
                      {
                        [
                          'Pilot Status and Interests',
                          'Current Occupation Status',
                          'Pilot Interests',
                          'Skills & Other Experience',
                          'Review Your Information',
                        ][experienceStep]
                      }
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: '6px',
                      background: SLATE[200],
                      borderRadius: '9999px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${((experienceStep + 1) / 5) * 100}%`,
                        height: '100%',
                        background: '#dc2626',
                        borderRadius: '9999px',
                        transition: 'width 0.3s',
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {experienceStep === 0 && (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.65)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    boxShadow: '0 8px 32px rgba(0, 30, 60, 0.08)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1.25rem',
                      paddingBottom: '0.75rem',
                      borderBottom: `1px solid ${SLATE[200]}`,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Shield style={{ width: '20px', height: '20px', color: '#001E3C' }} />
                      <h2
                        style={{
                          fontSize: '0.9rem',
                          fontWeight: 700,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          margin: 0,
                        }}
                      >
                        <span style={{ color: '#001E3C' }}>Pilot </span>
                        <span style={{ color: '#dc2626' }}>Status </span>
                        <span style={{ color: '#001E3C' }}>and </span>
                        <span style={{ color: '#dc2626' }}>Interests</span>
                      </h2>
                    </div>
                    <button
                      onClick={() => addJobExperience('aviation')}
                      style={{
                        padding: '0.4rem 1rem',
                        background: '#001E3C',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 500,
                        cursor: 'pointer',
                      }}
                    >
                      + Add Experience
                    </button>
                  </div>

                  {/* Biography */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#001E3C' }}>
                        Pilot Biography
                      </label>
                      <span style={{ fontSize: '0.75rem', color: '#001E3C', fontStyle: 'italic' }}>
                        optional diverse get to know your Pilot story, KYP — know your pilot
                      </span>
                    </div>

                    {/* Tabs row */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.375rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      {BIO_TABS.map((tab) => {
                        const isActive = activeBioTab === tab.key;
                        return (
                          <button
                            key={tab.key}
                            onClick={() => setActiveBioTab(tab.key)}
                            style={{
                              padding: '0.35rem 0.75rem',
                              borderRadius: '6px',
                              border: `1px solid ${isActive ? '#dc2626' : SLATE[300]}`,
                              background: isActive ? '#dc2626' : 'white',
                              color: isActive ? 'white' : '#001E3C',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ position: 'relative' }}>
                      <textarea
                        value={bioContents[activeBioTab]}
                        onChange={(e) =>
                          setBioContents({ ...bioContents, [activeBioTab]: e.target.value })
                        }
                        style={{
                          width: '100%',
                          background: 'white',
                          padding: '0.75rem',
                          paddingRight: '4rem',
                          paddingBottom: '2rem',
                          border: `1px solid ${SLATE[300]}`,
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          minHeight: '100px',
                          resize: 'vertical',
                          fontFamily: MONO_FONT,
                        }}
                        placeholder={`Tell us about ${BIO_TABS.find((t) => t.key === activeBioTab)?.label.toLowerCase()}...`}
                        maxLength={1000}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '0.5rem',
                          left: '0.75rem',
                          fontSize: '0.75rem',
                          color: SLATE[400],
                          fontFamily: MONO_FONT,
                          pointerEvents: 'none',
                        }}
                      >
                        {bioContents[activeBioTab].length} / 1000
                      </span>
                      <button
                        onClick={() => handleSaveBioTab(activeBioTab)}
                        style={{
                          position: 'absolute',
                          bottom: '0.5rem',
                          right: '0.5rem',
                          padding: '0.3rem 0.75rem',
                          background: '#001E3C',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          zIndex: 10,
                        }}
                      >
                        Save
                      </button>
                      {bioSaved[activeBioTab] && (
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '0.5rem',
                            right: '4rem',
                            fontSize: '0.75rem',
                            color: '#16a34a',
                            fontWeight: 600,
                            zIndex: 10,
                          }}
                        >
                          Saved!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Favorite Airports */}
                  <div style={{ marginBottom: '1.5rem' }} ref={airportSearchRef}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#001E3C',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Favorite Airports
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        marginBottom: '0.5rem',
                      }}
                    >
                      <div style={{ position: 'relative', flex: 1 }}>
                        <Search
                          style={{
                            position: 'absolute',
                            left: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '16px',
                            height: '16px',
                            color: SLATE[400],
                          }}
                        />
                        <input
                          type="text"
                          value={airportSearch}
                          onChange={(e) => setAirportSearch(e.target.value)}
                          onFocus={() => setAirportSearchFocused(true)}
                          onClick={() => setAirportSearchFocused(true)}
                          placeholder="Search airports..."
                          style={{
                            width: '100%',
                            padding: '0.625rem 0.75rem 0.625rem 2.25rem',
                            border: `1px solid ${airportSearchFocused ? '#001E3C' : SLATE[300]}`,
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            outline: 'none',
                            fontFamily: MONO_FONT,
                            background: 'white',
                            transition: 'border-color 0.15s',
                          }}
                        />
                        {/* Dropdown */}
                        {airportSearchFocused && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 'calc(100% + 4px)',
                              left: 0,
                              right: 0,
                              background: 'white',
                              border: `1px solid ${SLATE[200]}`,
                              borderRadius: '8px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                              zIndex: 50,
                              maxHeight: '240px',
                              overflowY: 'auto',
                            }}
                          >
                            {(() => {
                              const q = airportSearch.toLowerCase();
                              const filtered = FAVORITE_AIRPORTS_OPTIONS.filter(
                                (a) => a.toLowerCase().includes(q) && !favoriteAirports.includes(a)
                              );
                              if (filtered.length === 0) {
                                return (
                                  <div
                                    style={{
                                      padding: '0.75rem',
                                      fontSize: '0.8rem',
                                      color: SLATE[400],
                                      textAlign: 'center',
                                    }}
                                  >
                                    No airports found
                                  </div>
                                );
                              }
                              return filtered.map((airport) => (
                                <button
                                  key={airport}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleFavoriteAirport(airport);
                                    setAirportSearchFocused(false);
                                    setAirportSearch('');
                                  }}
                                  style={{
                                    width: '100%',
                                    textAlign: 'left',
                                    padding: '0.5rem 0.75rem',
                                    fontSize: '0.8rem',
                                    color: SLATE[700],
                                    cursor: 'pointer',
                                    border: 'none',
                                    background: 'transparent',
                                    borderBottom: `1px solid ${SLATE[100]}`,
                                    fontFamily: 'inherit',
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = SLATE[50];
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                  }}
                                >
                                  {airport}
                                </button>
                              ));
                            })()}
                          </div>
                        )}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: SLATE[500], whiteSpace: 'nowrap' }}>
                        Select airports you have flown to or wish to visit
                      </span>
                    </div>

                    {/* Selected pills in red */}
                    {favoriteAirports.length > 0 && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: SLATE[400],
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.375rem',
                            display: 'block',
                          }}
                        >
                          Selected
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                          {favoriteAirports.map((airport) => (
                            <span
                              key={airport}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.25rem 0.625rem',
                                borderRadius: '9999px',
                                background: '#dc2626',
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}
                            >
                              {airport}
                              <button
                                onClick={() => toggleFavoriteAirport(airport)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'white',
                                  cursor: 'pointer',
                                  fontSize: '0.7rem',
                                  padding: 0,
                                  lineHeight: 1,
                                }}
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Work Experience — Aviation & Non-Aviation */}
                  <div style={{ marginBottom: '1rem' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#001E3C',
                        marginBottom: '0.75rem',
                      }}
                    >
                      Work Experience
                    </label>
                    {jobExperiences.length === 0 && (
                      <p
                        style={{
                          color: '#6b7280',
                          fontStyle: 'italic',
                          textAlign: 'center',
                          padding: '1rem',
                        }}
                      >
                        No experience added yet. Click "+ Add Experience" to log your aviation or
                        non-aviation work history.
                      </p>
                    )}
                    {jobExperiences.map((job, index) => (
                      <div
                        key={job.id}
                        style={{
                          marginBottom: '1.5rem',
                          padding: '1.5rem',
                          background: 'rgba(255,255,255,0.5)',
                          borderRadius: '12px',
                          border: '1px solid rgba(255,255,255,0.6)',
                          boxShadow: '0 2px 8px rgba(0,30,60,0.04)',
                        }}
                      >
                        {/* Sector selector */}
                        <div
                          style={{
                            display: 'flex',
                            gap: '1rem',
                            marginBottom: '1rem',
                            alignItems: 'center',
                          }}
                        >
                          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#001E3C' }}>
                            Sector:
                          </label>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {(['aviation', 'non-aviation'] as const).map((s) => (
                              <button
                                key={s}
                                onClick={() => updateJobExperience(job.id, 'sector', s)}
                                style={{
                                  padding: '0.3rem 0.75rem',
                                  borderRadius: '9999px',
                                  border: '1px solid',
                                  borderColor: job.sector === s ? '#001E3C' : '#d1d5db',
                                  background: job.sector === s ? '#001E3C' : 'white',
                                  color: job.sector === s ? 'white' : '#374151',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  textTransform: 'capitalize',
                                }}
                              >
                                {s === 'non-aviation' ? 'Non-Aviation' : 'Aviation'}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Industry dropdown for non-aviation */}
                        {job.sector === 'non-aviation' && (
                          <div style={{ marginBottom: '1rem' }}>
                            <label
                              style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#001E3C',
                                marginBottom: '0.25rem',
                              }}
                            >
                              Industry *
                            </label>
                            <select
                              value={job.industry}
                              onChange={(e) =>
                                updateJobExperience(job.id, 'industry', e.target.value)
                              }
                              style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                                background: 'white',
                              }}
                            >
                              <option value="">Select industry</option>
                              {OTHER_INDUSTRY_EXPERIENCE_OPTIONS.map((industry) => (
                                <option key={industry} value={industry}>
                                  {industry}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '1rem',
                            marginBottom: '1rem',
                          }}
                        >
                          <div>
                            <label
                              style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#001E3C',
                                marginBottom: '0.25rem',
                              }}
                            >
                              Company/Organization *
                            </label>
                            <input
                              type="text"
                              value={job.company}
                              onChange={(e) =>
                                updateJobExperience(job.id, 'company', e.target.value)
                              }
                              style={{
                                width: '100%',
                                background: 'white',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                              }}
                              placeholder="e.g., Emirates Airlines"
                            />
                          </div>
                          <div>
                            <label
                              style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#001E3C',
                                marginBottom: '0.25rem',
                              }}
                            >
                              Position/Role *
                            </label>
                            <input
                              type="text"
                              value={job.position}
                              onChange={(e) =>
                                updateJobExperience(job.id, 'position', e.target.value)
                              }
                              style={{
                                width: '100%',
                                background: 'white',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                              }}
                              placeholder="e.g., First Officer"
                            />
                          </div>
                          <div>
                            <label
                              style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#001E3C',
                                marginBottom: '0.25rem',
                              }}
                            >
                              From Date *
                            </label>
                            <input
                              type="date"
                              value={job.fromDate}
                              onChange={(e) =>
                                updateJobExperience(job.id, 'fromDate', e.target.value)
                              }
                              style={{
                                width: '100%',
                                background: 'white',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                              }}
                            />
                          </div>
                          <div>
                            <label
                              style={{
                                display: 'block',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: '#001E3C',
                                marginBottom: '0.25rem',
                              }}
                            >
                              To Date
                            </label>
                            <input
                              type="date"
                              value={job.toDate}
                              onChange={(e) =>
                                updateJobExperience(job.id, 'toDate', e.target.value)
                              }
                              style={{
                                width: '100%',
                                background: 'white',
                                padding: '0.5rem',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                fontSize: '0.875rem',
                              }}
                            />
                          </div>
                        </div>
                        <div style={{ marginBottom: '1rem' }}>
                          <label
                            style={{
                              display: 'block',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: '#001E3C',
                              marginBottom: '0.25rem',
                            }}
                          >
                            Job Description
                          </label>
                          <textarea
                            value={job.description}
                            onChange={(e) =>
                              updateJobExperience(job.id, 'description', e.target.value)
                            }
                            style={{
                              width: '100%',
                              background: 'white',
                              padding: '0.5rem',
                              border: '1px solid #d1d5db',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              minHeight: '80px',
                              resize: 'vertical',
                            }}
                            placeholder="Describe your responsibilities and achievements in this role..."
                          />
                        </div>
                        <button
                          onClick={() => removeJobExperience(job.id)}
                          style={{
                            padding: '0.4rem 0.75rem',
                            background: 'transparent',
                            color: '#ef4444',
                            border: '1px solid #ef4444',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            fontWeight: 500,
                            opacity: 0.7,
                            transition: 'opacity 0.2s',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
                        >
                          ✕ Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* ICAO Data Security Audit Trail */}
                  <div
                    style={{
                      marginTop: '1.5rem',
                      padding: '0.75rem',
                      background: 'rgba(255,255,255,0.4)',
                      borderRadius: '4px',
                      border: '1px solid rgba(255,255,255,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <Lock style={{ width: '14px', height: '14px', color: SLATE[400] }} />
                    <span style={{ fontSize: '0.7rem', color: SLATE[500] }}>
                      Data encrypted and stored according to ICAO data security standards
                    </span>
                  </div>

                  {/* Wizard Nav */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <button
                      onClick={() => setExperienceStep(1)}
                      style={{
                        padding: '0.5rem 1.25rem',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </motion.section>
              )}
              {/* Current Occupation Status Section - Terminal Style */}
              {experienceStep === 1 && (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    border: `1px solid ${SLATE[200]}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.25rem',
                      paddingBottom: '0.75rem',
                      borderBottom: `1px solid ${SLATE[200]}`,
                    }}
                  >
                    <Shield style={{ width: '20px', height: '20px', color: '#001E3C' }} />
                    <h2
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: SLATE[800],
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        margin: 0,
                      }}
                    >
                      Current Occupation Status
                    </h2>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#374151',
                        marginBottom: '0.75rem',
                      }}
                    >
                      Your Current Employment Status *
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {OCCUPATION_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setCurrentOccupation(option.value)}
                          style={{
                            padding: '0.4rem 0.875rem',
                            borderRadius: '9999px',
                            border: '1px solid',
                            borderColor:
                              currentOccupation === option.value ? '#001E3C' : SLATE[300],
                            background: currentOccupation === option.value ? '#001E3C' : 'white',
                            color: currentOccupation === option.value ? 'white' : SLATE[700],
                            fontSize: '0.8rem',
                            cursor: 'pointer',
                            fontWeight: currentOccupation === option.value ? 600 : 500,
                            transition: 'all 0.15s',
                            boxShadow:
                              currentOccupation === option.value
                                ? '0 2px 6px rgba(0, 30, 60, 0.15)'
                                : 'none',
                          }}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(currentOccupation === 'employed' ||
                    currentOccupation === 'open_to_changes') && (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '1.5rem',
                      }}
                    >
                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '0.5rem',
                          }}
                        >
                          Current Employer
                        </label>
                        <input
                          type="text"
                          value={currentEmployer}
                          onChange={(e) => setCurrentEmployer(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                          }}
                          placeholder="Enter current employer name"
                        />
                      </div>

                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#374151',
                            marginBottom: '0.5rem',
                          }}
                        >
                          Current Position
                        </label>
                        <input
                          type="text"
                          value={currentPosition}
                          onChange={(e) => setCurrentPosition(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                          }}
                          placeholder="Enter current position"
                        />
                      </div>
                    </div>
                  )}

                  <div
                    style={{ margin: '1.5rem 0', borderTop: '2px solid rgba(220,38,38,0.15)' }}
                  />

                  {/* pilotshortage.org notice bar */}
                  <div
                    style={{
                      marginBottom: '1.5rem',
                      padding: '1rem',
                      background:
                        'linear-gradient(135deg, rgba(220,38,38,0.06) 0%, rgba(220,38,38,0.03) 100%)',
                      borderRadius: '8px',
                      border: '1px solid rgba(220,38,38,0.15)',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.8125rem',
                        color: SLATE[700],
                        lineHeight: 1.6,
                        fontWeight: 500,
                      }}
                    >
                      With support from{' '}
                      <a
                        href="https://pilotshortage.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#dc2626', fontWeight: 700, textDecoration: 'none' }}
                      >
                        pilotshortage.org
                      </a>
                      , your story will be one of thousands of pilots testifying to the difficulties
                      in the aviation industry — how challenging times can arise and spark change.
                      Common factors such as the <strong>1500-hour rule</strong> implementation
                      caused drastic effects on pilot careers, leading some to change careers
                      entirely. Tell your story on how difficult it was to gain{' '}
                      <strong>recognition</strong> in an industry with little direction or solid
                      foundational structure to place you in.
                    </p>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#374151',
                        marginBottom: '0.25rem',
                      }}
                    >
                      optional - about hardship experience in the aviation industry
                    </label>
                    <p
                      style={{
                        margin: '0 0 0.5rem',
                        fontSize: '0.75rem',
                        color: SLATE[500],
                        lineHeight: 1.5,
                      }}
                    >
                      Your story is anonymized and joined with thousands of other pilots to build a
                      collective voice for the aviation industry.
                    </p>
                    <div style={{ position: 'relative' }}>
                      <textarea
                        value={pilotJourneyStory}
                        onChange={(e) => setPilotJourneyStory(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          minHeight: '180px',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          lineHeight: 1.5,
                        }}
                        placeholder="Share your story. How did you get into aviation? What challenges did you face? Did you shift careers? Are you wishing for an industry demand change? Were you lacking career direction and not enough information to make critical decisions such as type ratings? Were you hesitant on continuing training or planning on shifting to a different course AOM? How did industry changes like the 1500-hour rule, furloughs, or lack of mentorship shape your path? This is your space to be heard."
                        maxLength={2000}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '0.5rem',
                          right: '0.75rem',
                          fontSize: '0.75rem',
                          color: SLATE[400],
                          fontFamily: MONO_FONT,
                          pointerEvents: 'none',
                        }}
                      >
                        {pilotJourneyStory.length} / 2000
                      </span>
                    </div>
                  </div>

                  {/* Wizard Nav */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '1.5rem',
                    }}
                  >
                    <button
                      onClick={() => setExperienceStep(0)}
                      style={{
                        padding: '0.5rem 1.25rem',
                        background: 'transparent',
                        color: '#001E3C',
                        border: '1px solid #001E3C',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setExperienceStep(2)}
                      style={{
                        padding: '0.5rem 1.25rem',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </motion.section>
              )}

              {/* Pilot Interests Section - Terminal Style */}
              {experienceStep === 2 && (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    border: `1px solid ${SLATE[200]}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.25rem',
                      paddingBottom: '0.75rem',
                      borderBottom: `1px solid ${SLATE[200]}`,
                    }}
                  >
                    <Shield style={{ width: '20px', height: '20px', color: '#001E3C' }} />
                    <h2
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: SLATE[800],
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        margin: 0,
                      }}
                    >
                      Pilot Interests
                    </h2>
                  </div>

                  {/* Aviation Interests Search */}
                  <div style={{ marginBottom: '1.5rem' }} ref={interestSearchRef}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: '#001E3C',
                        marginBottom: '0.25rem',
                      }}
                    >
                      Select Aviation Interests
                    </label>
                    <p
                      style={{
                        fontSize: '0.875rem',
                        color: SLATE[500],
                        marginBottom: '0.75rem',
                        fontStyle: 'italic',
                      }}
                    >
                      What makes you Fly?
                    </p>

                    {/* Search bar */}
                    <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
                      <Search
                        style={{
                          position: 'absolute',
                          left: '0.75rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: '16px',
                          height: '16px',
                          color: SLATE[400],
                        }}
                      />
                      <input
                        type="text"
                        value={interestSearchQuery}
                        onChange={(e) => setInterestSearchQuery(e.target.value)}
                        onFocus={() => setInterestSearchFocused(true)}
                        onBlur={() => setTimeout(() => setInterestSearchFocused(false), 150)}
                        placeholder="Search pathways, roles, sectors..."
                        style={{
                          width: '100%',
                          padding: '0.625rem 0.75rem 0.625rem 2.25rem',
                          border: `1px solid ${interestSearchFocused ? '#001E3C' : SLATE[300]}`,
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          outline: 'none',
                          fontFamily: MONO_FONT,
                          background: 'white',
                          transition: 'border-color 0.15s',
                        }}
                      />
                      {/* Dropdown */}
                      {interestSearchFocused && interestSearchQuery.trim().length > 0 && (
                        <div
                          style={{
                            position: 'absolute',
                            top: 'calc(100% + 4px)',
                            left: 0,
                            right: 0,
                            background: 'white',
                            border: `1px solid ${SLATE[200]}`,
                            borderRadius: '8px',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                            zIndex: 50,
                            maxHeight: '280px',
                            overflowY: 'auto',
                          }}
                        >
                          {(() => {
                            const q = interestSearchQuery.toLowerCase();
                            const filteredPathways = AVIATION_PATHWAYS_OPTIONS.filter(
                              (p) =>
                                p.toLowerCase().includes(q) &&
                                !aviationPathwaysInterests.includes(p)
                            );
                            const filteredPositions = PILOT_JOB_POSITIONS_OPTIONS.filter(
                              (p) =>
                                p.toLowerCase().includes(q) &&
                                !pilotJobPositionsInterests.includes(p)
                            );
                            if (filteredPathways.length === 0 && filteredPositions.length === 0) {
                              return (
                                <div
                                  style={{
                                    padding: '0.75rem',
                                    fontSize: '0.8rem',
                                    color: SLATE[400],
                                    textAlign: 'center',
                                  }}
                                >
                                  No matches found
                                </div>
                              );
                            }
                            return (
                              <>
                                {filteredPathways.length > 0 && (
                                  <div>
                                    <div
                                      style={{
                                        padding: '0.5rem 0.75rem',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        color: SLATE[400],
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        background: SLATE[50],
                                      }}
                                    >
                                      Aviation Pathways
                                    </div>
                                    {filteredPathways.map((pathway) => (
                                      <button
                                        key={pathway}
                                        onMouseDown={(e) => {
                                          e.preventDefault();
                                          toggleAviationPathway(pathway);
                                          setInterestSearchQuery('');
                                        }}
                                        style={{
                                          width: '100%',
                                          textAlign: 'left',
                                          padding: '0.5rem 0.75rem',
                                          fontSize: '0.8rem',
                                          color: SLATE[700],
                                          cursor: 'pointer',
                                          border: 'none',
                                          background: 'transparent',
                                          borderBottom: `1px solid ${SLATE[100]}`,
                                          fontFamily: 'inherit',
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.background = SLATE[50];
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.background = 'transparent';
                                        }}
                                      >
                                        {pathway}
                                      </button>
                                    ))}
                                  </div>
                                )}
                                {filteredPositions.length > 0 && (
                                  <div>
                                    <div
                                      style={{
                                        padding: '0.5rem 0.75rem',
                                        fontSize: '0.7rem',
                                        fontWeight: 700,
                                        color: SLATE[400],
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        background: SLATE[50],
                                      }}
                                    >
                                      Pilot Positions
                                    </div>
                                    {filteredPositions.map((position) => (
                                      <button
                                        key={position}
                                        onMouseDown={(e) => {
                                          e.preventDefault();
                                          togglePilotJobPosition(position);
                                          setInterestSearchQuery('');
                                        }}
                                        style={{
                                          width: '100%',
                                          textAlign: 'left',
                                          padding: '0.5rem 0.75rem',
                                          fontSize: '0.8rem',
                                          color: SLATE[700],
                                          cursor: 'pointer',
                                          border: 'none',
                                          background: 'transparent',
                                          borderBottom: `1px solid ${SLATE[100]}`,
                                          fontFamily: 'inherit',
                                        }}
                                        onMouseEnter={(e) => {
                                          e.currentTarget.style.background = SLATE[50];
                                        }}
                                        onMouseLeave={(e) => {
                                          e.currentTarget.style.background = 'transparent';
                                        }}
                                      >
                                        {position}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Selected row */}
                    {[...aviationPathwaysInterests, ...pilotJobPositionsInterests].length > 0 && (
                      <div style={{ marginBottom: '0.75rem' }}>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            color: SLATE[400],
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            marginBottom: '0.375rem',
                            display: 'block',
                          }}
                        >
                          Selected
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                          {aviationPathwaysInterests.map((item) => (
                            <span
                              key={item}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.25rem 0.625rem',
                                borderRadius: '9999px',
                                background: '#001E3C',
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}
                            >
                              {item}
                              <button
                                onClick={() => toggleAviationPathway(item)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'white',
                                  cursor: 'pointer',
                                  fontSize: '0.7rem',
                                  padding: 0,
                                  lineHeight: 1,
                                }}
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                          {pilotJobPositionsInterests.map((item) => (
                            <span
                              key={item}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.25rem 0.625rem',
                                borderRadius: '9999px',
                                background: '#001E3C',
                                color: 'white',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                              }}
                            >
                              {item}
                              <button
                                onClick={() => togglePilotJobPosition(item)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: 'white',
                                  cursor: 'pointer',
                                  fontSize: '0.7rem',
                                  padding: 0,
                                  lineHeight: 1,
                                }}
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommended pills */}
                    <div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: SLATE[400],
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          marginBottom: '0.375rem',
                          display: 'block',
                        }}
                      >
                        Recommended
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                        {[
                          'Commercial Aviation (Airlines)',
                          'Cargo Aviation',
                          'Business Aviation / Private Jets',
                          'First Officer (FO)',
                          'Captain',
                          'Flight Instruction',
                        ]
                          .filter(
                            (rec) =>
                              !aviationPathwaysInterests.includes(rec) &&
                              !pilotJobPositionsInterests.includes(rec)
                          )
                          .map((rec) => (
                            <button
                              key={rec}
                              onClick={() => {
                                if (AVIATION_PATHWAYS_OPTIONS.includes(rec))
                                  toggleAviationPathway(rec);
                                else togglePilotJobPosition(rec);
                              }}
                              style={{
                                padding: '0.3rem 0.625rem',
                                borderRadius: '9999px',
                                border: '1px solid',
                                borderColor: SLATE[200],
                                background: 'white',
                                color: SLATE[600],
                                fontSize: '0.75rem',
                                cursor: 'pointer',
                                fontWeight: 500,
                                transition: 'all 0.15s',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = '#001E3C';
                                e.currentTarget.style.color = '#001E3C';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = SLATE[200];
                                e.currentTarget.style.color = SLATE[600];
                              }}
                            >
                              + {rec}
                            </button>
                          ))}
                      </div>
                    </div>

                    {/* Powered by */}
                    <div style={{ marginTop: '0.75rem', textAlign: 'right' }}>
                      <span style={{ fontSize: '0.7rem', color: SLATE[400] }}>
                        Powered by pilotcareer
                        <span style={{ color: '#dc2626', fontWeight: 700 }}>pathways</span>.com
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '1.5rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Countries Visited
                      </label>
                      <input
                        type="number"
                        value={countriesVisited}
                        onChange={(e) => setCountriesVisited(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                        }}
                        placeholder="Number of countries visited"
                        min="0"
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Favorite Aircraft #1
                      </label>
                      <select
                        value={favoriteAircraft}
                        onChange={(e) => setFavoriteAircraft(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          background: 'white',
                        }}
                      >
                        <option value="">Select aircraft</option>
                        {COMMON_AIRCRAFT.map((aircraft) => (
                          <option key={aircraft} value={aircraft}>
                            {aircraft}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Favorite Aircraft #2
                      </label>
                      <select
                        value={favoriteAircraft2}
                        onChange={(e) => setFavoriteAircraft2(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          background: 'white',
                        }}
                      >
                        <option value="">Select aircraft</option>
                        {COMMON_AIRCRAFT.map((aircraft) => (
                          <option key={aircraft} value={aircraft}>
                            {aircraft}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          color: '#374151',
                          marginBottom: '0.5rem',
                        }}
                      >
                        Favorite Aircraft #3
                      </label>
                      <select
                        value={favoriteAircraft3}
                        onChange={(e) => setFavoriteAircraft3(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          background: 'white',
                        }}
                      >
                        <option value="">Select aircraft</option>
                        {COMMON_AIRCRAFT.map((aircraft) => (
                          <option key={aircraft} value={aircraft}>
                            {aircraft}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#374151',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Why Did You Become a Pilot / Hold a Pilot License?
                    </label>
                    <div style={{ position: 'relative' }}>
                      <textarea
                        value={whyBecomePilot}
                        onChange={(e) => setWhyBecomePilot(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          paddingRight: '4rem',
                          border: `1px solid ${SLATE[300]}`,
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          minHeight: '80px',
                          resize: 'vertical',
                          fontFamily: MONO_FONT,
                        }}
                        placeholder="Focusing on long-haul operations and EBT-aligned training..."
                        maxLength={500}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '0.75rem',
                          right: '0.75rem',
                          fontSize: '0.75rem',
                          color: SLATE[400],
                          fontFamily: MONO_FONT,
                          pointerEvents: 'none',
                        }}
                      >
                        {whyBecomePilot.length} / 500
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#374151',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Other Skills & Experiences (e.g., Cooking, IT, Languages, etc.)
                    </label>
                    <div style={{ position: 'relative' }}>
                      <textarea
                        value={otherSkills}
                        onChange={(e) => setOtherSkills(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          paddingRight: '4rem',
                          border: `1px solid ${SLATE[300]}`,
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          minHeight: '60px',
                          resize: 'vertical',
                          fontFamily: MONO_FONT,
                        }}
                        placeholder="Multi-engine IFR experience, technical documentation, crew resource management..."
                        maxLength={500}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '0.75rem',
                          right: '0.75rem',
                          fontSize: '0.75rem',
                          color: SLATE[400],
                          fontFamily: MONO_FONT,
                          pointerEvents: 'none',
                        }}
                      >
                        {otherSkills.length} / 500
                      </span>
                    </div>
                  </div>

                  {/* Wizard Nav */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '1.5rem',
                    }}
                  >
                    <button
                      onClick={() => setExperienceStep(1)}
                      style={{
                        padding: '0.5rem 1.25rem',
                        background: 'transparent',
                        color: '#001E3C',
                        border: '1px solid #001E3C',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setExperienceStep(3)}
                      style={{
                        padding: '0.5rem 1.25rem',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </motion.section>
              )}

              {/* Skills & Other Experience */}
              {experienceStep === 3 && (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    border: `1px solid ${SLATE[300]}`,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.5rem',
                      paddingBottom: '0.75rem',
                      borderBottom: `1px solid ${SLATE[200]}`,
                    }}
                  >
                    <Zap style={{ width: '20px', height: '20px', color: '#001E3C' }} />
                    <h3
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: SLATE[800],
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        margin: 0,
                      }}
                    >
                      Skills & Other Experience
                    </h3>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#374151',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Other Skills & Experiences That Give You an Edge
                    </label>
                    <p
                      style={{
                        margin: '0 0 0.75rem',
                        fontSize: '0.8125rem',
                        color: SLATE[500],
                        lineHeight: 1.5,
                      }}
                    >
                      Customer service, IT management, leadership roles, language fluency,
                      mechanical expertise, military service, teaching, project management — these
                      details are often overlooked but can bring your profile to the forefront
                      during pathway submissions on <strong>pilotcareerpathways.com</strong>.
                    </p>
                    <div style={{ position: 'relative' }}>
                      <textarea
                        value={otherSkills}
                        onChange={(e) => setOtherSkills(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '1px solid #d1d5db',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          minHeight: '120px',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                          lineHeight: 1.5,
                        }}
                        placeholder="List your transferable skills and non-aviation experiences that set you apart..."
                        maxLength={500}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          bottom: '0.5rem',
                          right: '0.75rem',
                          fontSize: '0.75rem',
                          color: SLATE[400],
                          fontFamily: MONO_FONT,
                          pointerEvents: 'none',
                        }}
                      >
                        {otherSkills.length} / 500
                      </span>
                    </div>
                  </div>

                  {/* Community notice */}
                  <div
                    style={{
                      padding: '1rem',
                      background:
                        'linear-gradient(135deg, rgba(37,99,235,0.06) 0%, rgba(37,99,235,0.03) 100%)',
                      borderRadius: '8px',
                      border: '1px solid rgba(37,99,235,0.15)',
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.8125rem',
                        color: SLATE[700],
                        lineHeight: 1.6,
                        fontWeight: 500,
                      }}
                    >
                      In accordance with <strong>pilot advocacy and transparency</strong> at{' '}
                      <a
                        href="https://pilotshortage.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#dc2626', fontWeight: 700, textDecoration: 'none' }}
                      >
                        pilotshortage.org
                      </a>
                      , always remember that <strong>you are never alone</strong>. That is why we
                      developed this platform — to voice out for many pilots and build a community.
                      Join the association at{' '}
                      <a
                        href="https://pilotshortage.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#dc2626', fontWeight: 700, textDecoration: 'none' }}
                      >
                        pilotshortage.org
                      </a>{' '}
                      with a mission to fight the cause of ending the pilot shortage and providing{' '}
                      <strong>transparency, direction, recognition</strong> and mission-driven
                      pathways.
                    </p>
                  </div>

                  {/* Wizard Nav */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '1.5rem',
                    }}
                  >
                    <button
                      onClick={() => setExperienceStep(2)}
                      style={{
                        padding: '0.5rem 1.25rem',
                        background: 'transparent',
                        color: '#001E3C',
                        border: '1px solid #001E3C',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setExperienceStep(4)}
                      style={{
                        padding: '0.5rem 1.25rem',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Next →
                    </button>
                  </div>
                </motion.section>
              )}

              {/* Review Your Information - Terminal Style */}
              {experienceStep === 4 && (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    border: `1px solid ${SLATE[300]}`,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.5rem',
                      paddingBottom: '0.75rem',
                      borderBottom: `1px solid ${SLATE[200]}`,
                    }}
                  >
                    <Shield style={{ width: '20px', height: '20px', color: '#001E3C' }} />
                    <h3
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: SLATE[800],
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        margin: 0,
                      }}
                    >
                      Review Your Information
                    </h3>
                  </div>

                  <p
                    style={{
                      color: SLATE[600],
                      lineHeight: 1.6,
                      marginBottom: '1.5rem',
                      fontSize: '0.875rem',
                    }}
                  >
                    Before saving, please review your information. This data will be visible on your
                    ATLAS CV and shared with aviation industry partners including airlines and
                    manufacturers.
                  </p>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    <div
                      style={{
                        padding: '1rem',
                        background: SLATE[50],
                        borderRadius: '6px',
                        border: `1px solid ${SLATE[200]}`,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.7rem',
                          color: SLATE[500],
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          fontWeight: 600,
                        }}
                      >
                        Pilot Name
                      </p>
                      <p
                        style={{
                          margin: '0.25rem 0 0',
                          fontSize: '0.875rem',
                          fontWeight: fullLegalName ? 700 : 400,
                          color: fullLegalName ? SLATE[900] : SLATE[400],
                        }}
                      >
                        {fullLegalName || 'Not entered'}
                      </p>
                    </div>
                    <div
                      style={{
                        padding: '1rem',
                        background: SLATE[50],
                        borderRadius: '6px',
                        border: `1px solid ${SLATE[200]}`,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.7rem',
                          color: SLATE[500],
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          fontWeight: 600,
                        }}
                      >
                        License Type
                      </p>
                      <p
                        style={{
                          margin: '0.25rem 0 0',
                          fontSize: '0.875rem',
                          fontWeight: currentLicenses.length > 0 ? 700 : 400,
                          color: currentLicenses.length > 0 ? SLATE[900] : SLATE[400],
                        }}
                      >
                        {currentLicenses.join(', ') || 'None selected'}
                      </p>
                    </div>
                    <div
                      style={{
                        padding: '1rem',
                        background: SLATE[50],
                        borderRadius: '6px',
                        border: `1px solid ${SLATE[200]}`,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.7rem',
                          color: SLATE[500],
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          fontWeight: 600,
                        }}
                      >
                        Medical Status
                      </p>
                      <p
                        style={{
                          margin: '0.25rem 0 0',
                          fontSize: '0.875rem',
                          fontWeight: medicalClass ? 700 : 400,
                          color: medicalClass
                            ? isDateExpired(medicalExpiry)
                              ? '#ef4444'
                              : EMERALD
                            : SLATE[400],
                        }}
                      >
                        {medicalClass || 'Not selected'}{' '}
                        {isDateExpired(medicalExpiry) && '(Expired)'}
                      </p>
                    </div>
                    <div
                      style={{
                        padding: '1rem',
                        background: SLATE[50],
                        borderRadius: '6px',
                        border: `1px solid ${SLATE[200]}`,
                      }}
                    >
                      <p
                        style={{
                          margin: 0,
                          fontSize: '0.7rem',
                          color: SLATE[500],
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          fontWeight: 600,
                        }}
                      >
                        Type Ratings
                      </p>
                      <p
                        style={{
                          margin: '0.25rem 0 0',
                          fontSize: '0.875rem',
                          fontWeight: aircraftRatings.length > 0 ? 700 : 400,
                          color: aircraftRatings.length > 0 ? SLATE[900] : SLATE[400],
                        }}
                      >
                        {aircraftRatings.length > 0
                          ? `${aircraftRatings.length} rating(s)`
                          : 'None added'}
                      </p>
                    </div>
                  </div>

                  {isDateExpired(licenseExpiry) && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        background: '#fee2e2',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                      }}
                    >
                      <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                        ⚠️ Your license appears to be expired. Please verify the expiration date.
                      </span>
                    </div>
                  )}
                  {isDateExpired(medicalExpiry) && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.75rem',
                        background: '#fee2e2',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                      }}
                    >
                      <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>
                        ⚠️ Your medical certificate appears to be expired. Please verify the
                        expiration date.
                      </span>
                    </div>
                  )}

                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      cursor: 'pointer',
                      padding: '1rem',
                      background: SLATE[50],
                      borderRadius: '6px',
                      border: `1px solid ${SLATE[200]}`,
                    }}
                  >
                    <input
                      type="checkbox"
                      style={{
                        marginTop: '0.125rem',
                        width: '1.25rem',
                        height: '1.25rem',
                        accentColor: '#001E3C',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '0.875rem',
                        color: SLATE[700],
                        lineHeight: 1.5,
                        fontWeight: 500,
                      }}
                    >
                      <strong style={{ color: '#001E3C' }}>Legal Confirmation:</strong> I confirm
                      that all information provided is accurate and complete. I understand this data
                      will be visible to aviation industry partners and may be verified according to
                      ICAO standards.
                    </span>
                  </label>

                  {/* Wizard Nav */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '1.5rem',
                    }}
                  >
                    <button
                      onClick={() => setExperienceStep(3)}
                      style={{
                        padding: '0.5rem 1.25rem',
                        background: 'transparent',
                        color: '#001E3C',
                        border: '1px solid #001E3C',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      style={{
                        padding: '0.5rem 1.25rem',
                        background: isSaving ? 'rgba(220,38,38,0.5)' : '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: isSaving ? 'not-allowed' : 'pointer',
                      }}
                    >
                      {isSaving ? 'Saving...' : 'Save All'}
                    </button>
                  </div>
                </motion.section>
              )}

              {/* Industry Visibility Notice - Terminal Style (Legal Disclosure) */}
              {experienceStep === 4 && (
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: SLATE[50],
                    borderRadius: '6px',
                    padding: '1.25rem',
                    marginBottom: '2rem',
                    border: `1px solid ${SLATE[200]}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <Shield style={{ width: '16px', height: '16px', color: SLATE[500] }} />
                    <h3
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: SLATE[600],
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        margin: 0,
                      }}
                    >
                      Industry Visibility Notice
                    </h3>
                  </div>
                  <p
                    style={{
                      color: SLATE[700],
                      lineHeight: 1.5,
                      marginBottom: '0.75rem',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <strong>
                      This information is visible to aviation industry manufacturers and airlines.
                    </strong>
                  </p>
                  <p style={{ color: SLATE[500], lineHeight: 1.5, fontSize: '0.8125rem' }}>
                    Leading aviation companies including Boeing, Airbus, Emirates, Etihad Airways,
                    and other major airlines regularly review pilot profiles on our platform. Your
                    current state, qualifications, experience, and employment status will be visible
                    to recruiters and hiring managers who are looking for qualified pilots. Keep
                    your information up-to-date to maximize your opportunities in the aviation
                    industry.
                  </p>
                </motion.section>
              )}
            </>
          )}
        </main>
      )}
    </div>
  );
};

export default PilotLicensureExperiencePage;
