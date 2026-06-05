import { Navigate } from 'react-router-dom';

export const metadata = {
  title: 'DPO — Pilot Shortage Association',
  description: 'Data Protection Officer contact for pilotshortage.org.',
};

export default function ShortageDPORedirect() {
  return <Navigate to="/dpo" replace />;
}
