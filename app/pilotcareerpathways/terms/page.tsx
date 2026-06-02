import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Terms of Service — Pilot Career Pathways',
  description: 'Terms of service for pilotcareerpathways.com.',
};

export default function PathwaysTermsRedirect() {
  redirect('/terms-of-service');
}
