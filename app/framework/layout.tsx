export const metadata = {
  title: 'Universal Commercial Framework | PilotRecognition.com - Aviation Industry Operating System',
  description: 'The Master Blueprint for the Aviation Industry Operating System. 21 Pillars covering Commercial Airlines, Cargo & Freight, Charter Aviation, Flight Training, Background Checks, Government Authorities, and Humanitarian Missions. Strategic framework for pilot recognition, verification, and career pathways.',
  keywords: [
    'aviation industry framework',
    'pilot recognition system',
    'commercial aviation framework',
    'flight training organizations',
    'aviation verification',
    'pilot career pathways',
    'aviation ecosystem',
    'background check verification',
    'aviation authorities',
    'humanitarian aviation missions',
    'airline recruitment',
    'pilot verification wallet',
    'aviation industry operating system',
    '21 pillars aviation',
    'universal commercial framework'
  ],
  openGraph: {
    title: 'Universal Commercial Framework | PilotRecognition.com',
    description: 'The Master Blueprint for the Aviation Industry Operating System - 21 Pillars covering the complete aviation ecosystem.',
    url: 'https://pilotrecognition.com/framework/full',
    siteName: 'PilotRecognition.com',
    images: [
      {
        url: 'https://pilotrecognition.com/og-image-framework.jpg',
        width: 1200,
        height: 630,
        alt: 'Universal Commercial Framework - Aviation Industry Operating System',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Universal Commercial Framework | PilotRecognition.com',
    description: 'The Master Blueprint for the Aviation Industry Operating System - 21 Pillars covering the complete aviation ecosystem.',
    images: ['https://pilotrecognition.com/og-image-framework.jpg'],
  },
  alternates: {
    canonical: 'https://pilotrecognition.com/framework/full',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function FrameworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
