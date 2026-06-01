import { HomePage } from '@/components/website/components/home/HomePage';
import PilotShortageUCF from './pilotshortage/page';
import BrandSwitchWrapper from '@/components/domains/BrandSwitchWrapper';
import { Metadata } from 'next';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Pilotrecognition.com | Aviation Industry\'s First Pilot Recognition-Based Platform - WM Pilot Group',
  description: 'Pilotrecognition.com is the Aviation Industry\'s First Pilot Recognition-Based Platform operated by WM Pilot Group. Transform your aviation career with industry-accredited pilot recognition profiles, EBT CBTA training, Foundation and Transition programs, AI-powered career matching, and direct airline pathways with support from Airbus and Etihad.',
  keywords: 'pilotrecognition, pilot recognition, aviation industry first, recognition-based platform, aviation career, pilot pathways, foundation program, transition program, EBT CBTA, Airbus, Etihad, ATLAS CV, pilot jobs, aviation training, WM Pilot Group, mentorship, blockchain certificates',
  authors: [{ name: 'WM Pilot Group' }],
  openGraph: {
    title: 'Pilotrecognition.com | Aviation Career Recognition & Pilot Pathways',
    description: 'Transform your aviation career with Pilotrecognition.com. Industry-accredited pilot recognition profiles, EBT CBTA training, Foundation and Transition programs, AI-powered career matching, and direct airline pathways.',
    url: 'https://pilotrecognition.com',
    siteName: 'Pilotrecognition.com',
    images: [
      {
        url: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
        width: 1200,
        height: 630,
        alt: 'Pilotrecognition Logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pilotrecognition.com | Aviation Career Recognition & Pilot Pathways',
    description: 'Transform your aviation career with Pilotrecognition.com. Industry-accredited pilot recognition profiles, EBT CBTA training, Foundation and Transition programs, AI-powered career matching, and direct airline pathways.',
    images: ['https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://pilotrecognition.com',
  },
};

export default function MainPage() {
  // Domain-based brand detection
  const headersList = headers();
  const domain = headersList.get('host') || '';
  const isShortage = domain.includes('pilotshortage.org');
  const isPathways = domain.includes('pilotcareerpathways.com');
  const isTerminal = domain.includes('pilotterminal.com');

  // Server-rendered domain detection
  if (isShortage) {
    return <PilotShortageUCF />;
  }

  if (isPathways) {
    return <PilotShortageUCF />;
  }

  if (isTerminal) {
    return <BrandSwitchWrapper />;
  }

  // For localhost:3000 with brand_override, render client-side switcher component
  // The DomainSwitcher component handles localStorage-based switching
  return (
    <>
      <HomePage
        onJoinUs={() => console.log('Join Us clicked')}
        onLogin={() => console.log('Login clicked')}
        onNavigate={(page: string) => console.log('Navigate to:', page)}
        onGoToProgramDetail={(slide: string) => console.log('Go to program detail:', slide)}
        isLoggedIn={false}
        onLoginModalOpen={() => console.log('Login modal opened')}
      />
      {/* Client component for dev domain switching */}
      <BrandSwitchWrapper />
    </>
  );
}
