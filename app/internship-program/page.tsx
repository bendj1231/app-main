import InternshipProgramPage from '@/components/website/components/InternshipProgramPage';
import { safeRedirect } from '@/lib/url-validator';

export const metadata = {
  title: 'Internship Program — Aviation Pathways Consultancy Ltd',
  description:
    'An internship program for pilots who have been locked out of the cockpit. Your aviation knowledge is an asset. Your lived experience is qualification. We hire the pilots the industry threw away.',
  keywords:
    'aviation internship, pilot internship, aviation careers, aviation consultancy, pilot career change, long-term unemployed pilot, aviation industry jobs, aviation pathways, pilot recognition, CPL career, aviation knowledge career',
  authors: [{ name: 'Aviation Pathways Consultancy Ltd' }],
  openGraph: {
    title: 'The Door Is Open — Aviation Pathways Consultancy Internship Program',
    description:
      'An internship program for pilots who have been locked out of the cockpit. 15 years of waiting. 15 years of knowledge. We hire the pilots the industry threw away.',
    url: 'https://pilotrecognition.com/internship-program',
    siteName: 'PilotRecognition.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Door Is Open — Aviation Internship Program',
    description:
      'We hire the pilots the industry threw away. Your aviation knowledge is an asset.',
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://pilotrecognition.com/internship-program',
  },
};

export default function Page() {
  return (
    <InternshipProgramPage
      onNavigate={(page) => {
        safeRedirect(`/${page}`);
      }}
      onLogin={() => {
        safeRedirect('/login');
      }}
    />
  );
}
