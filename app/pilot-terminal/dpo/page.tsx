import { Navigate } from 'react-router-dom';

export const metadata = {
  title: 'DPO — PilotTerminal',
  description: 'Data Protection Officer contact for PilotTerminal.com.',
};

export default function PilotTerminalDPORedirect() {
  return <Navigate to="/dpo" replace />;
}
