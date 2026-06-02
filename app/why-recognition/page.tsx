import { WhyRecognitionPage } from '@/components/website/components/WhyRecognitionPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Why Every Pilot Needs a Recognition Profile | PilotRecognition.com',
  description: 'In a rapidly evolving industry, a paper logbook and standard CV are no longer enough. Discover why being "Recognized" is the new aviation standard for students, hobbyists, and active pilots.',
  keywords: 'pilot recognition profile, aviation career, pilot digital identity, airline ready, pilot verification, aviation standards, pilot resume',
  authors: [{ name: 'WM Pilot Group' }],
  openGraph: {
    title: 'Why Every Pilot Needs a Recognition Profile | PilotRecognition.com',
    description: 'Pilot Recognition is the global infrastructure for your aviation identity. Whether career or recreation, being "Recognized" is the new industry standard.',
    url: 'https://pilotrecognition.com/why-recognition',
    siteName: 'Pilotrecognition.com',
    images: [
      {
        url: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
        width: 1200,
        height: 630,
        alt: 'Why Every Pilot Needs a Recognition Profile - PilotRecognition',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Why Every Pilot Needs a Recognition Profile',
    description: 'Claim your identity. Get Recognized. The global registry where pilots are vetted, ranked, and respected.',
    images: ['https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://pilotrecognition.com/why-recognition',
  },
};

export default function WhyRecognitionRoute() {
  return (
    <WhyRecognitionPage 
      onBack={() =>
        {/* Coded by Benjamin Bowler */} window.history.back()} 
      onNavigate={(page: string) => {
        if (page.startsWith('/')) {
          window.location.href = page;
        } else {
// [AUDIT] Removed console.log // line 48
        }
      }}
      onLogin={() => console.log('Login clicked')}
    />
  );
}
