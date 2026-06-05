import { PilotShortagePage } from '@/components/website/components/PilotShortagePage';
import { safeRedirect } from '@/src/lib/url-validator';
export const metadata = {
  title: 'The Truth About the Pilot Shortage | PilotRecognition.com',
  description: 'Everyone talks about a pilot shortage, but airlines aren\'t looking for pilots—they are looking for certainty. Learn why thousands of applications sit unread and how a PR Score makes you the candidate they want.',
  keywords: 'pilot shortage, pilot jobs, airline hiring, aviation careers, pilot recognition, PR Score, pilot shortage myth, airline recruitment',
  authors: [{ name: 'Benjamin Bowler' }],
  openGraph: {
    title: 'The Truth About the Pilot Shortage | PilotRecognition.com',
    description: 'Airlines aren\'t looking for pilots; they are looking for certainty. Without a PR Score, you are just a number in a stack.',
    url: 'https://pilotrecognition.com/pilot-shortage',
    siteName: 'Pilotrecognition.com',
    images: [
      {
        url: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
        width: 1200,
        height: 630,
        alt: 'The Truth About the Pilot Shortage - PilotRecognition',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Truth About the Pilot Shortage',
    description: 'Stop being an applicant. Start being a candidate. The "shortage" is a Fugazzi if you\'re on the outside looking in.',
    images: ['https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://pilotrecognition.com/pilot-shortage',
  },
};

export default function PilotShortageRoute() {
  return (
    <PilotShortagePage 
      onBack={() => {
        // Coded by Benjamin Bowler
        window.history.back();
      }} 
      onNavigate={(page) => {
        if (page.startsWith('/')) {
          safeRedirect(page);
        } else {
        }
      }}
      onLogin={() => console.log('Login clicked')}
    />
  );
}
