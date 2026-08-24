import pg from 'pg';
const { Pool } = pg;

export interface PaymentRecord {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  planId: string;
  planName?: string;
  amountMT: number;
  commissionRate: number;
  commissionMT: number;
  netAmountMT: number;
  paymentMethod: 'mpesa' | 'emola' | 'stripe' | 'card';
  phoneNumber: string;
  referenceCode: string;
  thirdPartyReference?: string;
  status: 'pending' | 'completed' | 'failed';
  mpesaTransactionId?: string;
  mpesaConversationId?: string;
  stripePaymentIntentId?: string;
  responseCode?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionRecord {
  id: string;
  userId: string;
  planId: string;
  planName?: string;
  status: 'active' | 'expired' | 'pending';
  startDate: string;
  expiresAt: string;
  durationDays: number;
  dailyQuota: number;
  createdAt: string;
  updatedAt: string;
}

class DatabaseService {
  private pool: pg.Pool | null = null;
  private isPostgresConnected = false;

  // In-Memory Storage replicating PostgreSQL tables for resilience
  public paymentsTable: Map<string, PaymentRecord> = new Map();
  public subscriptionsTable: Map<string, SubscriptionRecord> = new Map();

  constructor() {
    this.initPostgres();
  }

  private async initPostgres() {
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    if (!connectionString && !process.env.PGHOST) {
      console.log('ℹ️ PostgreSQL: Rodando com repositório nativo em memória/PostgreSQL-compatible.');
      return;
    }

    try {
      this.pool = new Pool({
        connectionString,
        host: process.env.PGHOST,
        port: Number(process.env.PGPORT) || 5432,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
        max: 10,
        idleTimeoutMillis: 30000,
      });

      const client = await this.pool.connect();
      this.isPostgresConnected = true;
      console.log('✅ PostgreSQL: Conectado com sucesso ao banco de dados.');
      client.release();

      await this.ensureTablesExist();
    } catch (err: any) {
      console.warn('⚠️ PostgreSQL connection not available, operating in resilient storage mode:', err.message);
      this.isPostgresConnected = false;
    }
  }

  public async ensureTablesExist() {
    if (!this.pool || !this.isPostgresConnected) return;

    const createTablesSql = `
      CREATE TABLE IF NOT EXISTS payments (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100) NOT NULL,
        user_name VARCHAR(255),
        user_email VARCHAR(255),
        plan_id VARCHAR(100) NOT NULL,
        plan_name VARCHAR(255),
        amount_mt NUMERIC(10, 2) NOT NULL,
        commission_rate NUMERIC(5, 4) DEFAULT 0.10,
        commission_mt NUMERIC(10, 2) DEFAULT 0,
        net_amount_mt NUMERIC(10, 2) DEFAULT 0,
        payment_method VARCHAR(50) NOT NULL,
        phone_number VARCHAR(50),
        reference_code VARCHAR(100) UNIQUE NOT NULL,
        third_party_reference VARCHAR(100),
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        mpesa_transaction_id VARCHAR(100),
        mpesa_conversation_id VARCHAR(100),
        response_code VARCHAR(50),
        error_message TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS subscriptions (
        id VARCHAR(100) PRIMARY KEY,
        user_id VARCHAR(100) UNIQUE NOT NULL,
        plan_id VARCHAR(100) NOT NULL,
        plan_name VARCHAR(255),
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        duration_days INTEGER NOT NULL DEFAULT 30,
        daily_quota INTEGER NOT NULL DEFAULT 100,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    try {
      await this.pool.query(createTablesSql);
      console.log('✅ PostgreSQL: Tabelas "payments" e "subscriptions" prontas.');
    } catch (err: any) {
      console.error('Erro ao verificar tabelas no PostgreSQL:', err.message);
    }
  }

  // === Payments Table Operations ===

  public async insertPayment(payment: PaymentRecord): Promise<PaymentRecord> {
    this.paymentsTable.set(payment.id, { ...payment });

    if (this.pool && this.isPostgresConnected) {
      try {
        const query = `
          INSERT INTO payments (
            id, user_id, user_name, user_email, plan_id, plan_name,
            amount_mt, commission_rate, commission_mt, net_amount_mt,
            payment_method, phone_number, reference_code, third_party_reference,
            status, mpesa_transaction_id, mpesa_conversation_id, response_code,
            error_message, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
          ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status,
            mpesa_transaction_id = EXCLUDED.mpesa_transaction_id,
            response_code = EXCLUDED.response_code,
            updated_at = NOW();
        `;
        await this.pool.query(query, [
          payment.id,
          payment.userId,
          payment.userName || '',
          payment.userEmail || '',
          payment.planId,
          payment.planName || '',
          payment.amountMT,
          payment.commissionRate,
          payment.commissionMT,
          payment.netAmountMT,
          payment.paymentMethod,
          payment.phoneNumber,
          payment.referenceCode,
          payment.thirdPartyReference || null,
          payment.status,
          payment.mpesaTransactionId || null,
          payment.mpesaConversationId || null,
          payment.responseCode || null,
          payment.errorMessage || null,
          new Date(payment.createdAt),
          new Date(payment.updatedAt || payment.createdAt),
        ]);
      } catch (err: any) {
        console.warn('⚠️ Erro ao inserir no PostgreSQL (mantido em memória):', err.message);
      }
    }

    return payment;
  }

  public async getPaymentByIdOrReference(query: string): Promise<PaymentRecord | null> {
    // Search in-memory cache first
    for (const p of this.paymentsTable.values()) {
      if (
        p.id === query ||
        p.referenceCode === query ||
        p.thirdPartyReference === query ||
        p.mpesaTransactionId === query
      ) {
        return p;
      }
    }

    if (this.pool && this.isPostgresConnected) {
      try {
        const sql = `
          SELECT * FROM payments 
          WHERE id = $1 OR reference_code = $1 OR third_party_reference = $1 OR mpesa_transaction_id = $1
          LIMIT 1;
        `;
        const res = await this.pool.query(sql, [query]);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          const record: PaymentRecord = {
            id: row.id,
            userId: row.user_id,
            userName: row.user_name,
            userEmail: row.user_email,
            planId: row.plan_id,
            planName: row.plan_name,
            amountMT: Number(row.amount_mt),
            commissionRate: Number(row.commission_rate),
            commissionMT: Number(row.commission_mt),
            netAmountMT: Number(row.net_amount_mt),
            paymentMethod: row.payment_method,
            phoneNumber: row.phone_number,
            referenceCode: row.reference_code,
            thirdPartyReference: row.third_party_reference,
            status: row.status,
            mpesaTransactionId: row.mpesa_transaction_id,
            mpesaConversationId: row.mpesa_conversation_id,
            responseCode: row.response_code,
            errorMessage: row.error_message,
            createdAt: new Date(row.created_at).toISOString(),
            updatedAt: new Date(row.updated_at).toISOString(),
          };
          this.paymentsTable.set(record.id, record);
          return record;
        }
      } catch (err: any) {
        console.warn('⚠️ Erro ao consultar pagamento no PostgreSQL:', err.message);
      }
    }

    return null;
  }

  public async updatePaymentStatus(
    paymentId: string,
    status: 'pending' | 'completed' | 'failed',
    details?: {
      mpesaTransactionId?: string;
      mpesaConversationId?: string;
      responseCode?: string;
      errorMessage?: string;
    }
  ): Promise<PaymentRecord | null> {
    const payment = this.paymentsTable.get(paymentId);
    if (payment) {
      payment.status = status;
      payment.updatedAt = new Date().toISOString();
      if (details?.mpesaTransactionId) payment.mpesaTransactionId = details.mpesaTransactionId;
      if (details?.mpesaConversationId) payment.mpesaConversationId = details.mpesaConversationId;
      if (details?.responseCode) payment.responseCode = details.responseCode;
      if (details?.errorMessage !== undefined) payment.errorMessage = details.errorMessage;
    }

    if (this.pool && this.isPostgresConnected) {
      try {
        const query = `
          UPDATE payments
          SET status = $2,
              mpesa_transaction_id = COALESCE($3, mpesa_transaction_id),
              mpesa_conversation_id = COALESCE($4, mpesa_conversation_id),
              response_code = COALESCE($5, response_code),
              error_message = COALESCE($6, error_message),
              updated_at = NOW()
          WHERE id = $1 OR reference_code = $1 OR third_party_reference = $1
          RETURNING *;
        `;
        await this.pool.query(query, [
          paymentId,
          status,
          details?.mpesaTransactionId || null,
          details?.mpesaConversationId || null,
          details?.responseCode || null,
          details?.errorMessage || null,
        ]);
      } catch (err: any) {
        console.warn('⚠️ Erro ao atualizar status no PostgreSQL:', err.message);
      }
    }

    return payment || null;
  }

  // === Subscriptions Table Operations ===

  public async getSubscriptionByUserId(userId: string): Promise<SubscriptionRecord | null> {
    for (const sub of this.subscriptionsTable.values()) {
      if (sub.userId === userId) {
        return sub;
      }
    }

    if (this.pool && this.isPostgresConnected) {
      try {
        const sql = `SELECT * FROM subscriptions WHERE user_id = $1 LIMIT 1;`;
        const res = await this.pool.query(sql, [userId]);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          const record: SubscriptionRecord = {
            id: row.id,
            userId: row.user_id,
            planId: row.plan_id,
            planName: row.plan_name,
            status: row.status,
            startDate: new Date(row.start_date).toISOString(),
            expiresAt: new Date(row.expires_at).toISOString(),
            durationDays: Number(row.duration_days),
            dailyQuota: Number(row.daily_quota),
            createdAt: new Date(row.created_at).toISOString(),
            updatedAt: new Date(row.updated_at).toISOString(),
          };
          this.subscriptionsTable.set(record.id, record);
          return record;
        }
      } catch (err: any) {
        console.warn('⚠️ Erro ao consultar subscrição no PostgreSQL:', err.message);
      }
    }

    return null;
  }

  /**
   * Extends or creates subscription in the PostgreSQL `subscriptions` table.
   * If current subscription is still active (expires_at > now), the new duration
   * is accumulated on top of the existing expiry date.
   */
  public async extendSubscription(
    userId: string,
    planId: string,
    planName: string,
    durationDays: number,
    dailyQuota: number
  ): Promise<SubscriptionRecord> {
    const now = Date.now();
    const existing = await this.getSubscriptionByUserId(userId);

    let baseStartTime = now;
    if (existing && new Date(existing.expiresAt).getTime() > now) {
      // Extend seamlessly from current future expiration
      baseStartTime = new Date(existing.expiresAt).getTime();
    }

    const newExpiresAt = new Date(baseStartTime + durationDays * 86400000).toISOString();
    const subId = existing?.id || 'sub-' + userId + '-' + Date.now();

    const subscription: SubscriptionRecord = {
      id: subId,
      userId,
      planId,
      planName,
      status: 'active',
      startDate: existing?.startDate || new Date(now).toISOString(),
      expiresAt: newExpiresAt,
      durationDays: (existing?.durationDays || 0) + durationDays,
      dailyQuota,
      createdAt: existing?.createdAt || new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
    };

    this.subscriptionsTable.set(subscription.id, subscription);

    if (this.pool && this.isPostgresConnected) {
      try {
        const sql = `
          INSERT INTO subscriptions (
            id, user_id, plan_id, plan_name, status, start_date, expires_at,
            duration_days, daily_quota, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (user_id) DO UPDATE SET
            plan_id = EXCLUDED.plan_id,
            plan_name = EXCLUDED.plan_name,
            status = 'active',
            expires_at = EXCLUDED.expires_at,
            duration_days = subscriptions.duration_days + EXCLUDED.duration_days,
            daily_quota = EXCLUDED.daily_quota,
            updated_at = NOW()
          RETURNING *;
        `;
        await this.pool.query(sql, [
          subscription.id,
          subscription.userId,
          subscription.planId,
          subscription.planName || '',
          subscription.status,
          new Date(subscription.startDate),
          new Date(subscription.expiresAt),
          durationDays,
          dailyQuota,
          new Date(subscription.createdAt),
          new Date(subscription.updatedAt),
        ]);
        console.log(`✅ PostgreSQL: Subscrição do utilizador ${userId} estendida até ${newExpiresAt}.`);
      } catch (err: any) {
        console.warn('⚠️ Erro ao atualizar subscrição no PostgreSQL:', err.message);
      }
    }

    return subscription;
  }
}

export const dbService = new DatabaseService();
