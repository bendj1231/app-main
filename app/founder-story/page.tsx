import { FounderStoryPage } from '@/components/website/components/FounderStoryPage';
import { safeRedirect } from '@/lib/url-validator';
export const metadata = {
  title: "The Founder's Story — PilotRecognition.com",
  description: "Benjamin Tiger Bowler built PilotRecognition after living $50,000 in training debt, a 3-year waiting list, and being handed a QR code at the Dubai Aviation Career Fair. This is the story of why PilotRecognition exists.",
  keywords: 'pilot recognition founder story, Benjamin Bowler, aviation career platform, pilot shortage, CPL low timer, Philippine flight training, Dubai aviation career fair',
  authors: [{ name: 'Benjamin Tiger Bowler' }],
  openGraph: {
    title: "The Founder's Story — PilotRecognition.com",
    description: "The gate was locked. So we built a door. The story of PilotRecognition, built by pilots who lived the problem.",
    url: 'https://pilotrecognition.com/founder-story',
    siteName: 'Pilotrecognition.com',
    images: [
      {
        url: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png',
        width: 1200,
        height: 630,
        alt: 'PilotRecognition Founder Story',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "The Founder's Story — PilotRecognition.com",
    description: "The gate was locked. So we built a door.",
    images: ['https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://pilotrecognition.com/founder-story',
  },
};

export default function Page() {
  return (
    <FounderStoryPage
      onNavigate={(page) => { safeRedirect(`/${page}`); }}
      onLogin={() => { safeRedirect('/login'); }}
    />
  );
}
