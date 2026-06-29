import { PilotShortageSupportPage } from '@/components/website/components/PilotShortageSupportPage';
import { safeRedirect } from '@/lib/url-validator';

export const metadata = {
  title: 'In Support of pilotshortage.org | PilotRecognition.com',
  description:
    'The WingMentor Program is fully aligned with and in support of pilots building leadership skills through 50 hours of self-initiated mentorship action.',
  keywords:
    'pilot shortage, wingmentor, mentorship, leadership, pilot recognition, aviation careers',
  authors: [{ name: 'Benjamin Bowler' }],
  openGraph: {
    title: 'In Support of pilotshortage.org | PilotRecognition.com',
    description:
      'Leadership through action. 50 hours of helping fellow pilots. Building the mindset aviation needs today.',
    url: 'https://pilotrecognition.com/pilot-shortage-support',
    siteName: 'Pilotrecognition.com',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PilotShortageSupportRoute() {
  return (
    <PilotShortageSupportPage
      onBack={() => {
        window.history.back();
      }}
      onNavigate={(page) => {
        if (page.startsWith('/')) {
          safeRedirect(page);
        }
      }}
    />
  );
}
