import { Navigate } from 'react-router-dom';

export const metadata = {
  title: 'Terms of Service — PilotTerminal',
  description: 'Terms of service for PilotTerminal.com.',
};

export default function PilotTerminalTermsRedirect() {
  return <Navigate to="/terms-of-service" replace />;
}
