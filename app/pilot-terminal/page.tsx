import PilotTerminalDashboard from '@/components/website/components/pilot-terminal/PilotTerminalDashboard';

export const metadata = {
  title: 'Pilot Terminal - AI-Powered Aviation Career Intelligence | Pilotrecognition.com',
  description: 'Access the Pilot Terminal AI system for intelligent aviation career matching, real-time market intelligence, and AI-powered pilot recognition profiles. Powered by Pilotrecognition.com operated by Benjamin Bowler.',
  keywords: 'pilot terminal, AI aviation, career intelligence, pilot recognition, aviation AI, career matching, pilot database, Pilotrecognition',
  authors: [{ name: 'Benjamin Bowler' }],
  openGraph: {
    title: 'Pilot Terminal - AI-Powered Aviation Career Intelligence | Pilotrecognition.com',
    description: 'Access the Pilot Terminal AI system for intelligent aviation career matching, real-time market intelligence, and AI-powered pilot recognition profiles.',
    url: 'https://pilotrecognition.com/pilot-terminal',
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
    title: 'Pilot Terminal - AI-Powered Aviation Career Intelligence | Pilotrecognition.com',
    description: 'Access the Pilot Terminal AI system for intelligent aviation career matching, real-time market intelligence, and AI-powered pilot recognition profiles.',
    images: ['https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png'],
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
  // Coded by Benjamin Bowler
  return <PilotTerminalDashboard />;
}
