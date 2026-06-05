import { Navigate } from 'react-router-dom';

export const metadata = {
  title: 'Privacy Policy — Pilot Career Pathways',
  description: 'Privacy policy for pilotcareerpathways.com.',
};

export default function PathwaysPrivacyRedirect() {
  return <Navigate to="/privacy-policy" replace />;
}
