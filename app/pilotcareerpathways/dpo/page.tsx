import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'DPO — Pilot Career Pathways',
  description: 'Data Protection Officer contact for pilotcareerpathways.com.',
};

export default function PathwaysDPORedirect() {
  redirect('/dpo');
}
