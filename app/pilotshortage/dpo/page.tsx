import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'DPO — Pilot Shortage Association',
  description: 'Data Protection Officer contact for pilotshortage.org.',
};

export default function ShortageDPORedirect() {
  redirect('/dpo');
}
