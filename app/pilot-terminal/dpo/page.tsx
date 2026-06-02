import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'DPO — PilotTerminal',
  description: 'Data Protection Officer contact for PilotTerminal.com.',
};

export default function PilotTerminalDPORedirect() {
  redirect('/dpo');
}
