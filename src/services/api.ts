import { User, Plan, PaymentTransaction, Conversation, ChatMessage, AcademicWorkData, SystemStats, AdminDataResponse } from '../types';

const API_BASE = '/api';

function getHeaders(userId?: string) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (userId) {
    headers['x-user-id'] = userId;
  }
  return headers;
}

export const api = {
  // Auth
  async sendVerificationCode(
    email: string,
    type: 'register' | 'reset' = 'register',
    name?: string,
    phone?: string
  ): Promise<{ success: boolean; message: string; devCode?: string }> {
    const res = await fetch(`${API_BASE}/auth/send-verification-code`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, type, name, phone }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Falha ao enviar código de verificação.');
    }
    return res.json();
  },

  async resendVerificationCode(
    email: string,
    type: 'register' | 'reset' = 'register',
    name?: string,
    phone?: string
  ): Promise<{ success: boolean; message: string; devCode?: string }> {
    const res = await fetch(`${API_BASE}/auth/resend-verification-code`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, type, name, phone }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Falha ao reenviar código de verificação.');
    }
    return res.json();
  },

  async verifyRegistrationCode(
    email: string,
    code: string
  ): Promise<{ success: boolean; valid: boolean; user: User; token: string; message: string }> {
    const res = await fetch(`${API_BASE}/auth/verify-registration-code`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, code }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Código de verificação de 6 dígitos incorrecto ou expirado.');
    }
    return res.json();
  },

  async verifyCode(
    email: string,
    code: string,
    type: 'register' | 'reset' = 'register'
  ): Promise<{ valid: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/verify-code`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, code, type }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Código de verificação incorrecto ou expirado.');
    }
    return res.json();
  },

  async resetPassword(
    email: string,
    code: string,
    newPassword: string
  ): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, code, newPassword }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Falha ao redefinir a palavra-passe.');
    }
    return res.json();
  },

  async register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    course?: string;
    institution?: string;
    academicLevel?: string;
    verificationCode?: string;
  }): Promise<{ user?: User; token?: string; pendingVerification?: boolean; email?: string; name?: string; message: string; devCode?: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Falha ao criar conta.');
    }
    return res.json();
  },

  async login(email: string, password: string): Promise<{ user?: User; token?: string; pendingVerification?: boolean; email?: string; name?: string; message?: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      if (err.pendingVerification) {
        return {
          pendingVerification: true,
          email: err.email,
          name: err.name,
          message: err.error,
        };
      }
      throw new Error(err.error || 'Credenciais inválidas.');
    }
    return res.json();
  },

  async getMe(userId: string): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(userId),
    });
    return res.json();
  },

  async updateProfile(userId: string, data: Partial<User> & { password?: string }): Promise<{ user: User; message: string }> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Falha ao atualizar perfil.');
    }
    return res.json();
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email }),
    });
    return res.json();
  },

  // Conversations
  async getConversations(userId: string): Promise<{ conversations: Conversation[] }> {
    const res = await fetch(`${API_BASE}/conversations`, {
      headers: getHeaders(userId),
    });
    return res.json();
  },

  async createConversation(userId: string, title?: string): Promise<{ conversation: Conversation }> {
    const res = await fetch(`${API_BASE}/conversations`, {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify({ title }),
    });
    return res.json();
  },

  async getConversation(id: string, userId: string): Promise<{ conversation: Conversation }> {
    const res = await fetch(`${API_BASE}/conversations/${id}`, {
      headers: getHeaders(userId),
    });
    if (!res.ok) throw new Error('Conversa não encontrada');
    return res.json();
  },

  async updateConversation(id: string, userId: string, data: { title?: string; pinned?: boolean }): Promise<{ conversation: Conversation }> {
    const res = await fetch(`${API_BASE}/conversations/${id}`, {
      method: 'PATCH',
      headers: getHeaders(userId),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteConversation(id: string, userId: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/conversations/${id}`, {
      method: 'DELETE',
      headers: getHeaders(userId),
    });
    return res.json();
  },

  // Chat Generation
  async sendChatMessage(
    userId: string,
    payload: {
      conversationId?: string;
      message: string;
      attachments?: any[];
      academicContext?: {
        subject?: string;
        level?: string;
        institution?: string;
      };
    }
  ): Promise<{ message: ChatMessage; conversationId: string; conversationTitle: string }> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao comunicar com o Way Estudantes AI.');
    }
    return res.json();
  },

  async streamChatMessage(
    userId: string,
    payload: {
      conversationId?: string;
      message: string;
      attachments?: any[];
      academicContext?: {
        subject?: string;
        level?: string;
        institution?: string;
      };
    },
    callbacks: {
      onChunk: (chunk: string, accumulated: string) => void;
      onDone: (data: { message?: ChatMessage; conversationId?: string; conversationTitle?: string }) => void;
      onError?: (err: Error) => void;
    },
    signal?: AbortSignal
  ): Promise<string> {
    try {
      const res = await fetch(`${API_BASE}/chat/stream`, {
        method: 'POST',
        headers: getHeaders(userId),
        body: JSON.stringify(payload),
        signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: Falha na conexão de streaming`);
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error('Leitor de stream não suportado');
      }

      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let accumulatedText = '';
      let serverDoneData: { message?: ChatMessage; conversationId?: string; conversationTitle?: string } = {};

      const processBufferBlock = (block: string) => {
        const trimmed = block.trim();
        if (!trimmed) return;

        const lines = trimmed.split('\n');
        for (const line of lines) {
          const cleanLine = line.trim();
          if (cleanLine.startsWith('data:')) {
            const jsonStr = cleanLine.replace(/^data:\s*/, '');
            if (!jsonStr) continue;
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed.error) {
                console.warn('[SSE Stream Warning]:', parsed.error);
              }
              if (parsed.chunk) {
                accumulatedText += parsed.chunk;
                callbacks.onChunk(parsed.chunk, accumulatedText);
              }
              if (parsed.done) {
                serverDoneData = {
                  message: parsed.message,
                  conversationId: parsed.conversationId,
                  conversationTitle: parsed.conversationTitle,
                };
              }
            } catch (pe: any) {
              // ignore partial json
            }
          }
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          if (buffer.trim()) {
            processBufferBlock(buffer);
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';

        for (const part of parts) {
          processBufferBlock(part);
        }
      }

      if (accumulatedText.trim().length > 0) {
        callbacks.onDone(serverDoneData);
        return accumulatedText;
      }
      throw new Error('Stream concluído sem texto emitido.');
    } catch (streamErr: any) {
      if (signal?.aborted) {
        throw streamErr;
      }

      // If streaming fails or emitted nothing, seamlessly fallback to non-streaming HTTP POST /api/chat
      try {
        const fallbackRes = await this.sendChatMessage(userId, payload);
        const text = fallbackRes.message?.content || '';
        if (text) {
          callbacks.onChunk(text, text);
          callbacks.onDone({
            message: fallbackRes.message,
            conversationId: fallbackRes.conversationId,
            conversationTitle: fallbackRes.conversationTitle,
          });
          return text;
        }
      } catch (fbErr: any) {
        // Continue to notify error so client-side pedagogical fallback can activate
      }

      callbacks.onError?.(streamErr);
      throw streamErr;
    }
  },

  // Academic Generator
  async generateAcademicWork(
    userId: string,
    data: AcademicWorkData
  ): Promise<{ content: string; metadata: any }> {
    const res = await fetch(`${API_BASE}/academic/generate-work`, {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao gerar trabalho.');
    }
    return res.json();
  },

  // Academic Tools
  async runAcademicTool(
    userId: string,
    toolType: 'explain' | 'summarize' | 'solve_step_by_step' | 'generate_test' | 'correct_work',
    inputContent: string,
    extraParams?: any
  ): Promise<{ result: string; toolType: string }> {
    const res = await fetch(`${API_BASE}/academic/tool`, {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify({ toolType, inputContent, extraParams }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao executar ferramenta.');
    }
    return res.json();
  },

  // Plans & Payments
  async getPlans(): Promise<{ plans: Plan[] }> {
    const res = await fetch(`${API_BASE}/plans`);
    return res.json();
  },

  async savePlan(userId: string, plan: Partial<Plan>): Promise<{ plan: Plan; message: string }> {
    const res = await fetch(`${API_BASE}/plans`, {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify(plan),
    });
    return res.json();
  },

  async processPayment(
    userId: string,
    data: {
      planId: string;
      paymentMethod: 'mpesa' | 'emola';
      phoneNumber: string;
    }
  ): Promise<{ success: boolean; transaction: PaymentTransaction; message: string; userSafe: any }> {
    const res = await fetch(`${API_BASE}/payments/create`, {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify({ userId, ...data }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao processar pagamento.');
    }
    return res.json();
  },

  async verifyRealPaymentReference(
    userId: string,
    data: {
      planId: string;
      paymentMethod: 'mpesa' | 'emola';
      referenceCode: string;
      phoneNumber?: string;
    }
  ): Promise<{ success: boolean; transaction: PaymentTransaction; message: string; userSafe: any }> {
    const res = await fetch(`${API_BASE}/payments/verify-reference`, {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify({ userId, ...data }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao validar comprovativo de pagamento real.');
    }
    return res.json();
  },

  // Stripe Payments API
  async getStripeConfig(): Promise<{
    configured: boolean;
    publishableKey: string;
    supportedCurrencies: string[];
    exchangeRateMTtoUSD: number;
  }> {
    const res = await fetch(`${API_BASE}/stripe/config`);
    return res.json();
  },

  async createStripePaymentIntent(
    userId: string,
    data: { planId: string; currency?: string }
  ): Promise<{
    success: boolean;
    clientSecret: string;
    paymentIntentId: string;
    amountCents: number;
    amountMT: number;
    currency: string;
    plan: { id: string; name: string; priceMT: number };
    transactionId: string;
  }> {
    const res = await fetch(`${API_BASE}/stripe/create-payment-intent`, {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify({ userId, ...data }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao inicializar pagamento com cartão Stripe.');
    }
    return res.json();
  },

  async createStripeCheckoutSession(
    userId: string,
    data: { planId: string; successUrl?: string; cancelUrl?: string }
  ): Promise<{ success: boolean; sessionId: string; checkoutUrl: string }> {
    const res = await fetch(`${API_BASE}/stripe/create-checkout-session`, {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify({ userId, ...data }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao gerar sessão de checkout Stripe.');
    }
    return res.json();
  },

  async confirmStripePayment(
    userId: string,
    data: {
      planId: string;
      paymentIntentId: string;
      paymentMethodDetails?: any;
    }
  ): Promise<{
    success: boolean;
    transaction: PaymentTransaction;
    message: string;
    userSafe: any;
  }> {
    const res = await fetch(`${API_BASE}/stripe/confirm-payment`, {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify({ userId, ...data }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao confirmar pagamento Stripe.');
    }
    return res.json();
  },

  async getPaymentHistory(userId: string): Promise<{ transactions: PaymentTransaction[] }> {
    const res = await fetch(`${API_BASE}/payments/history`, {
      headers: getHeaders(userId),
    });
    return res.json();
  },

  // M-Pesa Status Verification & PostgreSQL Subscription Extension
  async verifyTransactionStatus(data: {
    paymentId?: string;
    referenceCode?: string;
    thirdPartyReference?: string;
    queryReference?: string;
    userId?: string;
    planId?: string;
  }): Promise<{
    success: boolean;
    status: 'completed' | 'pending' | 'failed' | 'not_found';
    message: string;
    responseCode?: string;
    mpesaTransactionId?: string;
    payment?: any;
    subscription?: any;
  }> {
    const res = await fetch(`${API_BASE}/payments/verify-status`, {
      method: 'POST',
      headers: getHeaders(data.userId),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async syncPendingTransactions(): Promise<any> {
    const res = await fetch(`${API_BASE}/payments/sync-pending`, {
      method: 'POST',
      headers: getHeaders(),
    });
    return res.json();
  },

  // M-Pesa Specialized Methods
  async initiateMpesaC2B(data: {
    customerMSISDN: string;
    amount: number | string;
    transactionReference?: string;
    thirdPartyReference?: string;
    serviceProviderCode?: string;
    userId?: string;
    planId?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/mpesa/c2b`, {
      method: 'POST',
      headers: getHeaders(data.userId),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async queryMpesaTransaction(reference: string): Promise<any> {
    const res = await fetch(`${API_BASE}/mpesa/query/${encodeURIComponent(reference)}`, {
      headers: getHeaders(),
    });
    return res.json();
  },

  async simulateMpesaScenario(data: {
    scenario: 'success' | 'insufficient_funds' | 'user_cancelled' | 'timeout';
    phoneNumber: string;
    amount?: number;
    planId?: string;
    userId?: string;
  }): Promise<any> {
    const res = await fetch(`${API_BASE}/mpesa/simulate`, {
      method: 'POST',
      headers: getHeaders(data.userId),
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Admin
  async getAdminStats(userId: string): Promise<AdminDataResponse> {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getHeaders(userId),
    });
    return res.json();
  },

  async updatePlanConfig(userId: string, planId: string, data: Partial<Plan>): Promise<{ plan: Plan; message: string }> {
    const res = await fetch(`${API_BASE}/plans`, {
      method: 'POST',
      headers: getHeaders(userId),
      body: JSON.stringify({ id: planId, ...data }),
    });
    return res.json();
  },

  // Gmail & Notification Endpoints
  async sendSupportEmail(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
    phone?: string;
  }): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/email/send-support`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao enviar mensagem.');
    }
    return res.json();
  },

  async sendPaymentReceiptEmail(data: {
    transactionId: string;
    email: string;
  }): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/email/send-receipt`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erro ao enviar comprovativo.');
    }
    return res.json();
  },

  async getAdminUsers(userId: string): Promise<{ users: User[] }> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getHeaders(userId),
    });
    return res.json();
  },

  async updateAdminUser(userId: string, targetUserId: string, data: Partial<User>): Promise<{ user: User; message: string }> {
    const res = await fetch(`${API_BASE}/admin/users/${targetUserId}`, {
      method: 'PATCH',
      headers: getHeaders(userId),
      body: JSON.stringify(data),
    });
    return res.json();
  },
};
