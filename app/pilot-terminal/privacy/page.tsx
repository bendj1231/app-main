import { Navigate } from 'react-router-dom';

export const metadata = {
  title: 'Privacy Policy — PilotTerminal',
  description: 'Privacy policy for PilotTerminal.com.',
};

export default function PilotTerminalPrivacyRedirect() {
  return <Navigate to="/privacy-policy" replace />;
}
