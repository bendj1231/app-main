import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Privacy Policy — Pilot Career Pathways',
  description: 'Privacy policy for pilotcareerpathways.com.',
};

export default function PathwaysPrivacyRedirect() {
  redirect('/privacy-policy');
}
