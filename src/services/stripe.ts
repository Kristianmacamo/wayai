/**
 * Stripe Payments & Checkout Service
 * Way Estudantes AI - Academic AI Platform Mozambique
 */

import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js';

export interface StripeCheckoutOptions {
  planId: string;
  planName?: string;
  amountMT?: number;
  userId: string;
  userEmail: string;
  userName?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface StripeSessionResult {
  success: boolean;
  sessionId?: string;
  checkoutUrl?: string;
  error?: string;
}

export interface StripeWebhookHandlerResult {
  processed: boolean;
  eventType: string;
  userId?: string;
  planId?: string;
  amountPaid?: number;
  customerEmail?: string;
  status: 'activated' | 'ignored' | 'failed';
  message: string;
}

class StripeClientService {
  private stripePromise: Promise<StripeJS | null> | null = null;

  /**
   * Initializes or gets the Stripe.js instance using public key
   */
  public getStripe(): Promise<StripeJS | null> {
    if (!this.stripePromise) {
      const publishableKey =
        (typeof process !== 'undefined' && process.env?.VITE_STRIPE_PUBLISHABLE_KEY) ||
        (typeof window !== 'undefined' && (window as any).__STRIPE_PK__) ||
        'pk_test_placeholder_key_way_estudantes_ai';
      this.stripePromise = loadStripe(publishableKey);
    }
    return this.stripePromise;
  }

  /**
   * Creates a Stripe Checkout Session on the backend and redirects user to Stripe gateway
   */
  public async createCheckoutSession(options: StripeCheckoutOptions): Promise<StripeSessionResult> {
    try {
      const origin =
        typeof window !== 'undefined' && window.location.origin
          ? window.location.origin
          : 'https://ais-dev-g7tgs7pd4a2plrbolxlzc3-485809716515.europe-west1.run.app';

      const successUrl =
        options.successUrl || `${origin}?stripe_payment=success&plan_id=${options.planId}&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = options.cancelUrl || `${origin}?stripe_payment=cancelled`;

      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': options.userId,
        },
        body: JSON.stringify({
          userId: options.userId,
          planId: options.planId,
          userEmail: options.userEmail,
          userName: options.userName,
          successUrl,
          cancelUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Falha ao criar sessão Stripe.`);
      }

      const data = await response.json();

      if (data.checkoutUrl) {
        // Redirect browser to Stripe Checkout Gateway
        if (typeof window !== 'undefined') {
          window.location.href = data.checkoutUrl;
        }
        return {
          success: true,
          sessionId: data.sessionId,
          checkoutUrl: data.checkoutUrl,
        };
      } else if (data.sessionId) {
        const stripe = await this.getStripe();
        if (stripe) {
          await (stripe as any).redirectToCheckout({ sessionId: data.sessionId });
          return { success: true, sessionId: data.sessionId };
        }
      }

      return {
        success: true,
        sessionId: data.sessionId,
        checkoutUrl: data.checkoutUrl,
      };
    } catch (err: any) {
      console.error('❌ [STRIPE CHECKOUT ERROR]:', err);
      return {
        success: false,
        error: err.message || 'Erro inesperado no checkout Stripe.',
      };
    }
  }

  /**
   * Processes incoming Stripe webhook events, specifically handling `checkout.session.completed`
   * and `payment_intent.succeeded` to automatically activate subscriptions.
   */
  public async handleStripeWebhookEvent(event: {
    type: string;
    data: {
      object: any;
    };
  }): Promise<StripeWebhookHandlerResult> {
    const { type, data } = event;
    const sessionOrIntent = data?.object;

    if (type === 'checkout.session.completed') {
      const metadata = sessionOrIntent?.metadata || {};
      const userId = metadata.userId || sessionOrIntent?.client_reference_id;
      const planId = metadata.planId;
      const customerEmail = sessionOrIntent?.customer_email || metadata.userEmail;
      const amountTotal = sessionOrIntent?.amount_total;

      console.log(`💳 [STRIPE WEBHOOK] checkout.session.completed recebido para utilizador: ${userId}, plano: ${planId}`);

      return {
        processed: true,
        eventType: type,
        userId,
        planId,
        amountPaid: amountTotal ? amountTotal / 100 : undefined,
        customerEmail,
        status: 'activated',
        message: `Sessão de checkout completada com sucesso. Subscrição activada para o plano ${planId}.`,
      };
    }

    if (type === 'payment_intent.succeeded') {
      const metadata = sessionOrIntent?.metadata || {};
      const userId = metadata.userId;
      const planId = metadata.planId;

      return {
        processed: true,
        eventType: type,
        userId,
        planId,
        customerEmail: metadata.userEmail || sessionOrIntent?.receipt_email,
        status: 'activated',
        message: `Pagamento Directo Stripe aprovado para o plano ${planId}.`,
      };
    }

    return {
      processed: false,
      eventType: type,
      status: 'ignored',
      message: `Evento ${type} recebido sem acções requeridas.`,
    };
  }
}

export const stripeClientService = new StripeClientService();

/**
 * Convenient standalone export for creating Stripe checkout session
 */
export async function createCheckoutSession(options: StripeCheckoutOptions): Promise<StripeSessionResult> {
  return stripeClientService.createCheckoutSession(options);
}

/**
 * Convenient standalone export for handling webhook events
 */
export async function handleStripeWebhook(event: any): Promise<StripeWebhookHandlerResult> {
  return stripeClientService.handleStripeWebhookEvent(event);
}
