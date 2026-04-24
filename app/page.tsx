import { HomePage } from '@/components/website/components/home/HomePage';
import { Metadata } from 'next';

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
  return (
    <HomePage 
      onJoinUs={() => console.log('Join Us clicked')}
      onLogin={() => console.log('Login clicked')}
      onNavigate={(page) => console.log('Navigate to:', page)}
      onGoToProgramDetail={(slide) => console.log('Go to program detail:', slide)}
      isLoggedIn={false}
      onLoginModalOpen={() => console.log('Login modal opened')}
    />
  );
}
