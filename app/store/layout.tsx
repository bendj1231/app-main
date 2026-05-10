import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PilotRecognition Store | Programs, Digital Products & Gift Cards',
  description: 'Invest in your aviation career with PilotRecognition programs, digital resources, and tools. Foundation Program, Transition Program, Recognition+ Membership, and more.',
  keywords: ['pilot training', 'aviation programs', 'ATLAS CV', 'pilot career', 'flight training', 'Recognition+', 'gift cards'],
  openGraph: {
    title: 'PilotRecognition Store',
    description: 'Invest in Your Aviation Career',
    type: 'website',
    url: 'https://store.pilotrecognition.com',
  },
};

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://store.pilotrecognition.com" />
        <meta name="robots" content="index, follow" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
