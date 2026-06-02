import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Terms of Service — PilotTerminal',
  description: 'Terms of service for PilotTerminal.com.',
};

export default function PilotTerminalTermsRedirect() {
  redirect('/terms-of-service');
}
