import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Privacy Policy — PilotTerminal',
  description: 'Privacy policy for PilotTerminal.com.',
};

export default function PilotTerminalPrivacyRedirect() {
  redirect('/privacy-policy');
}
