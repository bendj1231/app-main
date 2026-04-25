import Stripe from 'stripe';
import { supabase } from '@/shared/lib/supabase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia',
});

export default async function handler(req: Request) {
  try {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const { userId, newPriceId } = await req.json();

    if (!userId || !newPriceId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user || user.id !== userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_subscription_id, stripe_price_id')
      .eq('user_id', userId)
      .single();

    if (!subscription?.stripe_subscription_id) {
      return new Response(JSON.stringify({ error: 'No active subscription' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id);
    
    const subscriptionItemId = stripeSubscription.items.data[0].id;

    await stripe.subscriptionItems.update(subscriptionItemId, {
      price: newPriceId,
    });

    await supabase.from('subscriptions').update({
      stripe_price_id: newPriceId,
    }).eq('user_id', userId);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Upgrade subscription error:', error);
    return new Response(JSON.stringify({ error: 'Failed to upgrade subscription' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const config = {
  runtime: 'edge',
};
