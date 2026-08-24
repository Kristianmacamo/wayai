import { mpesaService, MpesaC2BResponse } from './mpesa.js';
import { dbService, PaymentRecord, SubscriptionRecord } from './db.js';

export interface VerificationResult {
  success: boolean;
  status: 'completed' | 'pending' | 'failed' | 'not_found';
  message: string;
  responseCode?: string;
  mpesaTransactionId?: string;
  mpesaConversationId?: string;
  payment?: PaymentRecord;
  subscription?: SubscriptionRecord;
  rawGatewayResponse?: any;
}

export class MpesaVerificationService {
  /**
   * Consults the M-Pesa gateway for transaction status and updates:
   * 1. `status` in the `payments` table
   * 2. `expires_at` in the `subscriptions` table
   */
  public async verifyAndUpdateTransaction(params: {
    paymentId?: string;
    referenceCode?: string;
    thirdPartyReference?: string;
    queryReference?: string;
    planDurationDays?: number;
    planDailyQuota?: number;
  }): Promise<VerificationResult> {
    const lookupKey =
      params.paymentId ||
      params.referenceCode ||
      params.thirdPartyReference ||
      params.queryReference ||
      '';

    if (!lookupKey) {
      return {
        success: false,
        status: 'not_found',
        message: 'Nenhum identificador de transacção ou referência fornecido.',
      };
    }

    console.log(`🔍 [M-Pesa Verification Service] Consultando status para: ${lookupKey}`);

    // 1. Locate payment in database / repository
    let payment = await dbService.getPaymentByIdOrReference(lookupKey);

    const thirdPartyRef =
      params.thirdPartyReference ||
      payment?.thirdPartyReference ||
      payment?.referenceCode ||
      lookupKey;

    const queryRef =
      params.queryReference ||
      payment?.mpesaTransactionId ||
      payment?.referenceCode ||
      '';

    // 2. Query M-Pesa Gateway
    let gatewayResponse: MpesaC2BResponse;
    try {
      gatewayResponse = await mpesaService.queryTransactionStatus({
        thirdPartyReference: thirdPartyRef,
        queryReference: queryRef,
      });
    } catch (err: any) {
      console.error('❌ [M-Pesa Gateway Error]:', err.message);
      return {
        success: false,
        status: 'failed',
        message: `Falha ao comunicar com o Gateway do M-Pesa: ${err.message}`,
      };
    }

    console.log(
      `📡 [M-Pesa Gateway Response]: Code=${gatewayResponse.output_ResponseCode} Desc="${gatewayResponse.output_ResponseDesc}" Status=${gatewayResponse.status}`
    );

    const isSuccess =
      gatewayResponse.output_ResponseCode === 'INS-0' || gatewayResponse.status === 'completed';
    const isFailed =
      gatewayResponse.output_ResponseCode.startsWith('INS-2') ||
      gatewayResponse.output_ResponseCode.startsWith('INS-1') ||
      gatewayResponse.status === 'failed';

    const newStatus: 'completed' | 'pending' | 'failed' = isSuccess
      ? 'completed'
      : isFailed
      ? 'failed'
      : 'pending';

    // 3. If payment record exists, update `payments` table
    let updatedPayment: PaymentRecord | null = null;
    if (payment) {
      updatedPayment = await dbService.updatePaymentStatus(payment.id, newStatus, {
        mpesaTransactionId: gatewayResponse.output_TransactionID || payment.mpesaTransactionId,
        mpesaConversationId: gatewayResponse.output_ConversationID || payment.mpesaConversationId,
        responseCode: gatewayResponse.output_ResponseCode,
        errorMessage: isSuccess ? undefined : gatewayResponse.output_ResponseDesc,
      });
    }

    // 4. If status is completed, extend expiration in the `subscriptions` table in PostgreSQL
    let updatedSubscription: SubscriptionRecord | undefined = undefined;

    if (newStatus === 'completed' && payment) {
      const durationDays = params.planDurationDays || (payment.planId === 'plan-diario' ? 1 : payment.planId === 'plan-semanal' ? 7 : 30);
      const dailyQuota = params.planDailyQuota || (payment.planId === 'plan-diario' ? 100 : payment.planId === 'plan-semanal' ? 300 : 9999);

      updatedSubscription = await dbService.extendSubscription(
        payment.userId,
        payment.planId,
        payment.planName || 'Plano Way Estudantes AI',
        durationDays,
        dailyQuota
      );

      console.log(
        `🎉 [M-Pesa Verification Service] Transacção ${payment.referenceCode} confirmada! Subscrição de ${payment.userId} estendida até ${updatedSubscription.expiresAt}.`
      );
    }

    const friendlyMessage = isSuccess
      ? `Transacção M-Pesa confirmada com sucesso! A subscrição foi ${updatedSubscription ? `estendida até ${new Date(updatedSubscription.expiresAt).toLocaleDateString('pt-MZ')}` : 'activada'}.`
      : isFailed
      ? `Transacção M-Pesa não concluída: ${gatewayResponse.output_ResponseDesc || 'Erro no processamento'}`
      : `Transacção em processamento pelo M-Pesa. Aguarde a confirmação do PIN no telemóvel.`;

    return {
      success: isSuccess,
      status: newStatus,
      message: friendlyMessage,
      responseCode: gatewayResponse.output_ResponseCode,
      mpesaTransactionId: gatewayResponse.output_TransactionID,
      mpesaConversationId: gatewayResponse.output_ConversationID,
      payment: updatedPayment || payment || undefined,
      subscription: updatedSubscription,
      rawGatewayResponse: gatewayResponse.rawResponse,
    };
  }

  /**
   * Batch verification for any pending transactions
   */
  public async syncPendingTransactions(): Promise<{
    checkedCount: number;
    updatedCount: number;
    results: VerificationResult[];
  }> {
    const results: VerificationResult[] = [];
    let updatedCount = 0;

    const allPayments = Array.from(dbService.paymentsTable.values()).filter(
      (p) => p.status === 'pending'
    );

    for (const payment of allPayments) {
      const res = await this.verifyAndUpdateTransaction({
        paymentId: payment.id,
        thirdPartyReference: payment.thirdPartyReference,
        queryReference: payment.mpesaTransactionId || payment.referenceCode,
      });
      results.push(res);
      if (res.status !== 'pending') {
        updatedCount++;
      }
    }

    return {
      checkedCount: allPayments.length,
      updatedCount,
      results,
    };
  }
}

export const mpesaVerificationService = new MpesaVerificationService();
