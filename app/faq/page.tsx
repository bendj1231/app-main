import { FAQPage } from '@/components/website/components/FAQPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - Pilotrecognition.com | Aviation Career Recognition Platform',
  description: 'Find answers to common questions about pilotrecognition, our Foundation Program, Transition Program, mentorship, and career opportunities in aviation. Operated by WM Pilot Group.',
  keywords: 'pilotrecognition, pilot recognition, aviation career, pilot jobs, foundation program, transition program, mentorship, ATLAS CV, EBT CBTA, Airbus, Etihad',
  authors: [{ name: 'WM Pilot Group' }],
  openGraph: {
    title: 'FAQ - Pilotrecognition.com | Aviation Career Recognition Platform',
    description: 'Find answers to common questions about pilotrecognition, our programs, mentorship, and career opportunities in aviation.',
    url: 'https://pilotrecognition.com/faq',
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
    title: 'FAQ - Pilotrecognition.com | Aviation Career Recognition Platform',
    description: 'Find answers to common questions about pilotrecognition, our programs, mentorship, and career opportunities in aviation.',
    images: ['https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://pilotrecognition.com/faq',
  },
};

export default function FAQPage() {
  return (
    <FAQPage 
      onBack={() => window.history.back()} 
      onNavigate={(page) => console.log('Navigate to:', page)}
      onLogin={() => console.log('Login clicked')}
    />
  );
}
