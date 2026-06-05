export const metadata = {
  title: 'PilotRecognition Blog | Modern Aviation Career Intelligence',
  description: 'Evidence-based strategies for pilots navigating the new competency-focused recruitment landscape. Learn about EBT/CBTA, skill stacking, ATLAS CV formatting, and more.',
  keywords: ['aviation careers', 'pilot recruitment', 'EBT training', 'CBTA', 'competency-based training', 'ATLAS CV', 'pilot profile'],
  openGraph: {
    title: 'PilotRecognition Blog',
    description: 'Modern Aviation Career Intelligence',
    type: 'website',
    url: 'https://blog.pilotrecognition.com',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://blog.pilotrecognition.com" />
        <meta name="robots" content="index, follow" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
