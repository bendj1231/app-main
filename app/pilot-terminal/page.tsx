import PilotTerminalDashboard from '@/components/website/components/pilot-terminal/PilotTerminalDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pilot Terminal - AI-Powered Aviation Career Intelligence | Pilotrecognition.com',
  description: 'Access the Pilot Terminal AI system for intelligent aviation career matching, real-time market intelligence, and AI-powered pilot recognition profiles. Powered by Pilotrecognition.com and WM Pilot Group.',
  keywords: 'pilot terminal, AI aviation, career intelligence, pilot recognition, aviation AI, career matching, pilot database, WM Pilot Group, Pilotrecognition',
  authors: [{ name: 'WM Pilot Group' }],
  openGraph: {
    title: 'Pilot Terminal - AI-Powered Aviation Career Intelligence | Pilotrecognition.com',
    description: 'Access the Pilot Terminal AI system for intelligent aviation career matching, real-time market intelligence, and AI-powered pilot recognition profiles.',
    url: 'https://pilotrecognition.com/pilot-terminal',
    siteName: 'Pilotrecognition.com',
    images: [
      {
        url: 'https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR',
        width: 1200,
        height: 630,
        alt: 'Pilotrecognition Logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pilot Terminal - AI-Powered Aviation Career Intelligence | Pilotrecognition.com',
    description: 'Access the Pilot Terminal AI system for intelligent aviation career matching, real-time market intelligence, and AI-powered pilot recognition profiles.',
    images: ['https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://pilotrecognition.com/pilot-terminal',
  },
};

export default function PilotTerminalPage() {
  return <PilotTerminalDashboard />;
}
