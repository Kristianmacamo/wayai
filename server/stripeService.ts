import Stripe from 'stripe';

export interface StripePaymentConfig {
  secretKey?: string;
  publishableKey?: string;
  webhookSecret?: string;
}

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      // In development / demo when key is not yet set, we initialize with fallback or throw clear error
      console.warn('⚠️ [STRIPE WARNING] STRIPE_SECRET_KEY is not defined in environment.');
      // Initialize with dummy key for types/safety or throw
      stripeClient = new Stripe('sk_test_placeholder_key_for_way_ai_mozambique', {
        apiVersion: '2025-02-24.acacia' as any,
      });
    } else {
      stripeClient = new Stripe(key, {
        apiVersion: '2025-02-24.acacia' as any,
      });
    }
  }
  return stripeClient;
}

export class StripeService {
  /**
   * Check if real Stripe credentials are provided
   */
  public isConfigured(): boolean {
    const key = process.env.STRIPE_SECRET_KEY;
    return !!key && key.startsWith('sk_');
  }

  public getPublishableKey(): string {
    return process.env.STRIPE_PUBLISHABLE_KEY || process.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
  }

  /**
   * Convert Mozambican Meticais (MT) to equivalent USD cents (approx 1 USD = 64 MT)
   * or direct MZN if supported by merchant account.
   */
  public convertMeticaisToCents(amountMT: number, currency: string = 'usd'): number {
    if (currency.toLowerCase() === 'mzn') {
      return Math.round(amountMT * 100);
    }
    // Approx exchange rate: 64 MT = 1 USD
    const usdAmount = amountMT / 64.0;
    return Math.max(50, Math.round(usdAmount * 100)); // Minimum 50 cents ($0.50)
  }

  /**
   * Create a Stripe PaymentIntent for Card / Apple Pay / Google Pay
   */
  public async createPaymentIntent(params: {
    amountMT: number;
    planId: string;
    planName: string;
    userId: string;
    userEmail: string;
    userName: string;
    currency?: string;
  }): Promise<{
    clientSecret: string;
    paymentIntentId: string;
    amountCents: number;
    currency: string;
    amountMT: number;
  }> {
    const stripe = getStripe();
    const currency = (params.currency || 'usd').toLowerCase();
    const amountCents = this.convertMeticaisToCents(params.amountMT, currency);

    if (!this.isConfigured()) {
      // Return simulated client secret for local testing / seamless sandbox
      const simId = `pi_sim_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      return {
        clientSecret: `${simId}_secret_${Math.random().toString(36).substring(7)}`,
        paymentIntentId: simId,
        amountCents,
        currency,
        amountMT: params.amountMT,
      };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: currency,
      description: `Way Estudantes AI - ${params.planName} (${params.amountMT} MT) para ${params.userName}`,
      receipt_email: params.userEmail,
      metadata: {
        userId: params.userId,
        planId: params.planId,
        planName: params.planName,
        userEmail: params.userEmail,
        userName: params.userName,
        amountMT: params.amountMT.toString(),
        platform: 'Way Estudantes AI Moçambique',
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret || '',
      paymentIntentId: paymentIntent.id,
      amountCents: paymentIntent.amount,
      currency: paymentIntent.currency,
      amountMT: params.amountMT,
    };
  }

  /**
   * Create a Stripe Checkout Session (Stripe Hosted Checkout URL)
   */
  public async createCheckoutSession(params: {
    amountMT: number;
    planId: string;
    planName: string;
    durationDays: number;
    userId: string;
    userEmail: string;
    userName: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ sessionId: string; checkoutUrl: string }> {
    const stripe = getStripe();
    const currency = 'usd';
    const amountCents = this.convertMeticaisToCents(params.amountMT, currency);

    if (!this.isConfigured()) {
      return {
        sessionId: `cs_sim_${Date.now()}`,
        checkoutUrl: `${params.successUrl}?session_id=cs_sim_${Date.now()}&status=simulated_success`,
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: params.userEmail,
      client_reference_id: params.userId,
      line_items: [
        {
          price_data: {
            currency: currency,
            unit_amount: amountCents,
            product_data: {
              name: `Way Estudantes AI: ${params.planName}`,
              description: `Acesso total de ${params.durationDays} dias às ferramentas académicas e modelo Gemini com normas UEM/UP.`,
              images: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80'],
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: params.userId,
        planId: params.planId,
        planName: params.planName,
        userEmail: params.userEmail,
        userName: params.userName,
        amountMT: params.amountMT.toString(),
      },
      success_url: `${params.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: params.cancelUrl,
    });

    return {
      sessionId: session.id,
      checkoutUrl: session.url || '',
    };
  }

  /**
   * Retrieve and verify status of PaymentIntent
   */
  public async retrievePaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent | null> {
    if (!this.isConfigured() || paymentIntentId.startsWith('pi_sim_')) {
      return null;
    }
    const stripe = getStripe();
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  }

  /**
   * Verify webhook signature and construct Stripe event
   */
  public constructWebhookEvent(payload: string | Buffer, signature: string): Stripe.Event {
    const stripe = getStripe();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }
}

export const stripeService = new StripeService();
