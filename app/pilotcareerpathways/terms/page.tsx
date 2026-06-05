import { Navigate } from 'react-router-dom';

export const metadata = {
  title: 'Terms of Service — Pilot Career Pathways',
  description: 'Terms of service for pilotcareerpathways.com.',
};

export default function PathwaysTermsRedirect() {
  return <Navigate to="/terms-of-service" replace />;
}
