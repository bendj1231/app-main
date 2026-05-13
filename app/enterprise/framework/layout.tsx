export const metadata = {
  title: 'Universal Commercial Framework | PilotRecognition Enterprise',
  description: 'The 25-Pillar Aviation Industry Operating System - Strategic partnership framework for airlines, ATOs, manufacturers, and industry stakeholders.',
};

export default function EnterpriseFrameworkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white">{children}</body>
    </html>
  );
}
