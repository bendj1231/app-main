import { Navigate } from 'react-router-dom';

export const metadata = {
  title: 'DPO — Pilot Career Pathways',
  description: 'Data Protection Officer contact for pilotcareerpathways.com.',
};

export default function PathwaysDPORedirect() {
  return <Navigate to="/dpo" replace />;
}
