import React from 'react';
import { useParams } from 'react-router-dom';
import { PathwayLandingPage, type PathwayLandingPageProps } from './PathwayLandingPage';

const pathwayConfigs: Record<string, PathwayLandingPageProps> = {
  'explore-pathways': {
    heroTitle: 'Explore pathways',
    heroCtaTargetId: 'pathway-content',
    choiceRectangles: [
      {
        label: 'Discover',
        title: 'Browse all',
        description: 'See every career pathway',
        path: '/discover',
      },
      {
        label: 'Pathways',
        title: 'View categories',
        description: 'Filter by training, ratings, or operators',
        path: '/pathways',
      },
      {
        label: 'Recognition+',
        title: 'Get verified first',
        description: 'Operators prefer pre-screened pilots',
        path: '/recognition-plus',
        accentColor: '#f87171',
      },
    ],
    searchPlaceholder: 'Search aircraft type, school, job, or pathway...',
    searchPath: '/discover',
    contentTagline: 'Explore every pathway',
    contentDescription:
      'Compare training programs, type ratings, airlines, cargo, charter, and eVTOL pathways side by side.',
    contentPrimaryCta: { label: 'Browse all pathways', path: '/discover' },
    contentSecondaryCta: { label: 'Back home', path: '/pathways' },
    contentFeatures: [
      { label: 'Training', color: '#34d399' },
      { label: 'Type Ratings', color: '#818cf8' },
      { label: 'Operator Pathways', color: '#fbbf24' },
    ],
    carouselTitle: 'Recommended pathways',
    recommendedManufacturerId: 'embraer',
    additionalAircraftIds: ['a320-200', 'b737-max', 'cessna-172', 'atr-72-600', 'crj900'],
    detailCtaPath: '/discover',
  },
  'airline-pathways': {
    heroTitle: 'Airline pathways',
    heroCtaTargetId: 'pathway-content',
    choiceRectangles: [
      {
        label: 'Airlines',
        title: 'Search',
        description: 'Find airline operator pathways',
        path: '/airlines',
      },
      {
        label: 'Expectations',
        title: 'View requirements',
        description: 'Know what airlines want before you apply',
        path: '/airline-expectations',
      },
      {
        label: 'Recognition+',
        title: 'Get verified first',
        description: 'Airlines prefer pre-screened pilots',
        path: '/recognition-plus',
        accentColor: '#f87171',
      },
    ],
    searchPlaceholder: 'Search airline, aircraft type, or pathway...',
    searchPath: '/airlines',
    contentTagline: 'Airline operator pathways',
    contentDescription:
      'Explore commercial airline pathways worldwide, compare requirements, and align your career with operator expectations.',
    contentPrimaryCta: { label: 'Browse airline pathways', path: '/airlines' },
    contentSecondaryCta: { label: 'Close', path: '/pathways' },
    contentFeatures: [
      { label: 'Major Airlines', color: '#34d399' },
      { label: 'Regional Airlines', color: '#818cf8' },
      { label: 'Career Progression', color: '#fbbf24' },
    ],
    carouselTitle: 'Recommended airline aircraft',
    recommendedManufacturerId: 'airbus',
    additionalAircraftIds: ['a320-200', 'b737-max', 'b777-300er', 'a350-900', 'a220-300'],
    detailCtaPath: '/airlines',
  },
  'type-rating-center-pathways': {
    heroTitle: 'Type rating centers',
    heroCtaTargetId: 'pathway-content',
    choiceRectangles: [
      {
        label: 'Type Ratings',
        title: 'Search',
        description: 'Find your next rating',
        path: '/type-ratings',
      },
      {
        label: 'Pathways',
        title: 'View all pathways',
        description: 'Browse every career pathway',
        path: '/pathways',
      },
      {
        label: 'Recognition+',
        title: 'Get verified first',
        description: 'Operators prefer pre-screened pilots',
        path: '/recognition-plus',
        accentColor: '#f87171',
      },
    ],
    searchPlaceholder: 'Search aircraft type rating or training center...',
    searchPath: '/type-ratings',
    contentTagline: 'ATOs & type rating centers',
    contentDescription:
      'Compare type rating offerings from ATOs and type rating centers, then submit interest to start your pathway.',
    contentPrimaryCta: { label: 'Browse type ratings', path: '/type-ratings' },
    contentSecondaryCta: { label: 'Close', path: '/pathways' },
    contentFeatures: [
      { label: 'ATO Directory', color: '#34d399' },
      { label: 'Submit Interest', color: '#818cf8' },
      { label: 'Career Pathways', color: '#fbbf24' },
    ],
    hideContentSection: true,
    carouselTitle: 'Recommended type rating pathways',
    recommendedManufacturerId: 'embraer',
    additionalAircraftIds: ['a320-200', 'b737-max', 'cessna-172', 'atr-72-600', 'crj900'],
    detailCtaPath: '/type-ratings',
  },
  'ato-pathways': {
    heroTitle: 'ATO pathways',
    heroCtaTargetId: 'pathway-content',
    choiceRectangles: [
      {
        label: 'Flight Schools',
        title: 'Search',
        description: 'Find ATOs and flight schools',
        path: '/programs',
      },
      {
        label: 'Type Ratings',
        title: 'Get rated',
        description: 'Compare type rating centers',
        path: '/get-rated',
      },
      {
        label: 'Recognition+',
        title: 'Get verified first',
        description: 'Schools prefer organized logbooks',
        path: '/recognition-plus',
        accentColor: '#f87171',
      },
    ],
    searchPlaceholder: 'Search flight school, ATO, or training program...',
    searchPath: '/programs',
    contentTagline: 'Approved training organizations',
    contentDescription:
      'Find flight schools, ATOs, and instructor roles to build your commercial pilot foundation.',
    contentPrimaryCta: { label: 'Browse ATOs', path: '/programs' },
    contentSecondaryCta: { label: 'Close', path: '/pathways' },
    contentFeatures: [
      { label: 'Flight Schools', color: '#34d399' },
      { label: 'CPL & IR Programs', color: '#818cf8' },
      { label: 'Instructor Roles', color: '#fbbf24' },
    ],
    carouselTitle: 'Recommended training aircraft',
    recommendedManufacturerId: 'cessna',
    additionalAircraftIds: ['cessna-172', 'a320-200', 'b737-max', 'crj900', 'atr-72-600'],
    detailCtaPath: '/programs',
  },
  'cargo-pathways': {
    heroTitle: 'Cargo pathways',
    heroCtaTargetId: 'pathway-content',
    choiceRectangles: [
      {
        label: 'Cargo Operators',
        title: 'Search',
        description: 'Find cargo airline pathways',
        path: '/airlines',
      },
      {
        label: 'Requirements',
        title: 'View expectations',
        description: 'Know what cargo operators want',
        path: '/airline-expectations',
      },
      {
        label: 'Recognition+',
        title: 'Get verified first',
        description: 'Cargo operators prefer pre-screened pilots',
        path: '/recognition-plus',
        accentColor: '#f87171',
      },
    ],
    searchPlaceholder: 'Search cargo operator, aircraft type, or pathway...',
    searchPath: '/airlines',
    contentTagline: 'Cargo & freight operator pathways',
    contentDescription:
      'Explore cargo, freight, and logistics operator routes, compare requirements, and start your cargo pilot career.',
    contentPrimaryCta: { label: 'Browse cargo pathways', path: '/airlines' },
    contentSecondaryCta: { label: 'Close', path: '/pathways' },
    contentFeatures: [
      { label: 'Freight Operators', color: '#34d399' },
      { label: 'Logistics Routes', color: '#818cf8' },
      { label: 'Career Progression', color: '#fbbf24' },
    ],
    carouselTitle: 'Recommended cargo aircraft',
    recommendedManufacturerId: 'boeing',
    additionalAircraftIds: ['b747-8f', 'a330-200f', 'b777-300er', 'atr-72-600', 'a350-900'],
    detailCtaPath: '/airlines',
  },
  'charter-pathways': {
    heroTitle: 'Charter pathways',
    heroCtaTargetId: 'pathway-content',
    choiceRectangles: [
      {
        label: 'Charter Operators',
        title: 'Search',
        description: 'Find charter and business aviation pathways',
        path: '/airlines',
      },
      {
        label: 'Type Ratings',
        title: 'Get rated',
        description: 'Compare business jet type ratings',
        path: '/get-rated',
      },
      {
        label: 'Recognition+',
        title: 'Build your profile',
        description: 'Charter operators value verified pilots',
        path: '/recognition-plus',
        accentColor: '#f87171',
      },
    ],
    searchPlaceholder: 'Search charter operator, aircraft type, or pathway...',
    searchPath: '/airlines',
    contentTagline: 'Business aviation & charter pathways',
    contentDescription:
      'Explore charter, business aviation, and corporate flight department careers with leading operators.',
    contentPrimaryCta: { label: 'Browse charter pathways', path: '/airlines' },
    contentSecondaryCta: { label: 'Close', path: '/pathways' },
    contentFeatures: [
      { label: 'Charter Operators', color: '#34d399' },
      { label: 'Corporate Flight Departments', color: '#818cf8' },
      { label: 'Business Jet Ratings', color: '#fbbf24' },
    ],
    carouselTitle: 'Recommended charter aircraft',
    recommendedManufacturerId: 'gulfstream',
    additionalAircraftIds: ['gulfstream-g650', 'global-7500', 'citation-x', 'crj900', 'a320-200'],
    detailCtaPath: '/airlines',
  },
  'program-pathways': {
    heroTitle: 'Program pathways',
    heroCtaTargetId: 'pathway-content',
    choiceRectangles: [
      {
        label: 'Programs',
        title: 'Search',
        description: 'Find Wingmentor and partner pathways',
        path: '/programs',
      },
      {
        label: 'Discover',
        title: 'View all',
        description: 'Browse every career pathway',
        path: '/discover',
      },
      {
        label: 'Recognition+',
        title: 'Get verified first',
        description: 'Programs prefer organized pilots',
        path: '/recognition-plus',
        accentColor: '#f87171',
      },
    ],
    searchPlaceholder: 'Search program, aircraft type, or pathway...',
    searchPath: '/programs',
    contentTagline: 'Wingmentor & partner programs',
    contentDescription:
      'Discover structured pilot programs from Wingmentor and partners designed to take you from license to airline.',
    contentPrimaryCta: { label: 'Browse programs', path: '/programs' },
    contentSecondaryCta: { label: 'Close', path: '/pathways' },
    contentFeatures: [
      { label: 'Structured Programs', color: '#34d399' },
      { label: 'Partner Pathways', color: '#818cf8' },
      { label: 'Mentorship', color: '#fbbf24' },
    ],
    carouselTitle: 'Recommended program aircraft',
    recommendedManufacturerId: 'embraer',
    additionalAircraftIds: ['a320-200', 'b737-max', 'cessna-172', 'crj900', 'atr-72-600'],
    detailCtaPath: '/programs',
  },
  about: {
    heroTitle: 'About pilot career pathways',
    heroCtaTargetId: 'pathway-content',
    choiceRectangles: [
      {
        label: 'Mission',
        title: 'Our mission',
        description: 'Learn why we built this network',
        path: '/pathways',
      },
      {
        label: 'Network',
        title: 'Join the network',
        description: 'Connect with pilots and operators',
        path: '/become-member',
      },
      {
        label: 'Recognition+',
        title: 'Get verified first',
        description: 'Build your portable pilot profile',
        path: '/recognition-plus',
        accentColor: '#f87171',
      },
    ],
    searchPlaceholder: 'Search aircraft type, school, job, or pathway...',
    searchPath: '/discover',
    contentTagline: 'Our mission and network',
    contentDescription:
      'Pilot Career Pathways is built by pilots, for pilots — a network to discover training, ratings, and operator pathways worldwide.',
    contentPrimaryCta: { label: 'Discover pathways', path: '/discover' },
    contentSecondaryCta: { label: 'Back home', path: '/pathways' },
    contentFeatures: [
      { label: 'Pilot-First', color: '#34d399' },
      { label: 'Global Network', color: '#818cf8' },
      { label: 'Transparent Pathways', color: '#fbbf24' },
    ],
    carouselTitle: 'Aircraft in our network',
    recommendedManufacturerId: 'airbus',
    additionalAircraftIds: ['a320-200', 'b737-max', 'gulfstream-g650', 'atr-72-600', 'crj900'],
    detailCtaPath: '/discover',
  },
  'evtol-air-taxi-pathways': {
    heroTitle: 'eVTOL & air taxi pathways',
    heroCtaTargetId: 'pathway-content',
    choiceRectangles: [
      {
        label: 'Operators',
        title: 'Search',
        description: 'Find eVTOL and air taxi operators',
        path: '/airlines',
      },
      {
        label: 'Aircraft',
        title: 'View aircraft',
        description: 'Compare advanced air mobility vehicles',
        path: '/discover',
      },
      {
        label: 'Recognition+',
        title: 'Get verified first',
        description: 'Operators prefer pre-screened pilots',
        path: '/recognition-plus',
        accentColor: '#f87171',
      },
    ],
    searchPlaceholder: 'Search eVTOL operator, aircraft, or pathway...',
    searchPath: '/airlines',
    contentTagline: 'Urban air mobility & advanced air mobility',
    contentDescription:
      'Explore eVTOL, air taxi, and urban air mobility operator pathways as aviation enters a new era.',
    contentPrimaryCta: { label: 'Browse eVTOL pathways', path: '/airlines' },
    contentSecondaryCta: { label: 'Close', path: '/pathways' },
    contentFeatures: [
      { label: 'eVTOL Operators', color: '#34d399' },
      { label: 'Air Taxi Networks', color: '#818cf8' },
      { label: 'Advanced Air Mobility', color: '#fbbf24' },
    ],
    carouselTitle: 'Recommended eVTOL & air taxi aircraft',
    recommendedManufacturerId: 'archer',
    additionalAircraftIds: ['archer-midnight', 'joby-s4', 'lilium-jet'],
    detailCtaPath: '/airlines',
  },
};

export const PathwayFilteredPage: React.FC = () => {
  const { pathwayType } = useParams<{ pathwayType: string }>();
  const config = pathwayType ? pathwayConfigs[pathwayType] : undefined;

  if (!config) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-white">Pathway not found</h1>
          <p className="text-slate-400">The pathway you are looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return <PathwayLandingPage {...config} />;
};

export default PathwayFilteredPage;
