export type UserRole = 'student' | 'admin' | 'super_admin' | 'blocked';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  course?: string;
  institution?: string;
  academicLevel?: 'Secundário' | 'Licenciatura' | 'Mestrado' | 'Doutoramento' | 'Técnico-Profissional';
  role: UserRole;
  emailVerified?: boolean;
  whatsappVerified?: boolean;
  createdAt: string;
  planId?: string;
  planExpiry?: string;
  dailyUsageCount: number;
  maxDailyQuota: number;
}

export interface Plan {
  id: string;
  name: string;
  durationDays: number;
  priceMT: number;
  price?: number;
  commissionRate?: number; // e.g. 0.10 for 10%
  commissionMT?: number;
  netAmountMT?: number;
  description: string;
  popular?: boolean;
  features: string[];
  maxMessagesPerDay: number;
  maxFileSizeMB: number;
  allowVision: boolean;
  allowDocxPdfExport: boolean;
  active: boolean;
}

export type PlanConfig = Plan;

export interface PaymentTransaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  planId: string;
  planName: string;
  amountMT: number;
  amount?: number;
  commissionRate?: number; // 0.10 (10%)
  commissionMT?: number;   // 10% of amount
  netAmountMT?: number;    // 90% of amount
  paymentMethod: 'mpesa' | 'emola' | 'stripe' | 'card';
  phoneNumber: string;
  referenceCode: string;
  reference?: string;
  status: 'completed' | 'pending' | 'failed';
  mpesaTransactionId?: string;
  mpesaConversationId?: string;
  stripePaymentIntentId?: string;
  responseCode?: string;
  errorMessage?: string;
  createdAt: string;
}

export interface MpesaC2BResult {
  output_ResponseCode: string;
  output_ResponseDesc: string;
  output_TransactionID?: string;
  output_ConversationID?: string;
  output_ThirdPartyReference?: string;
  isSuccess: boolean;
  status: 'completed' | 'pending' | 'failed';
}

export type Transaction = PaymentTransaction;

export interface Attachment {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  dataUrl?: string; // base64
  extractedText?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  attachments?: Attachment[];
  timestamp: string;
  isStreaming?: boolean;
  isError?: boolean;
  category?: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  pinned?: boolean;
}

export interface AcademicWorkData {
  theme: string;
  subject: string;
  course: string;
  description?: string;
  institution?: string;
  studentName?: string;
  supervisorName?: string;
  pagesCount: 3 | 6 | 12 | 18 | number;
  workType?: 'Trabalho de Investigação' | 'Monografia' | 'Relatório de Estágio' | 'Artigo Científico' | 'Ensaio Académico' | string;
  standard?: 'Normas UEM / UP' | 'Normas APA 7ª Edição' | 'Normas ABNT' | string;
  customInstructions?: string;
  generatedContent?: {
    coverPage: {
      institution: string;
      faculty?: string;
      title: string;
      subtitle?: string;
      author: string;
      supervisor: string;
      location: string;
      year: string;
    };
    tableOfContents: string[];
    introduction: string;
    objectives: {
      general: string;
      specifics: string[];
    };
    methodology: string;
    bodyChapters: {
      title: string;
      content: string;
    }[];
    conclusion: string;
    recommendations?: string[];
    references: string[];
  };
}

export interface AdminStats {
  totalUsers: number;
  activeSubscribers: number;
  totalRevenueMT: number;
  totalCommissionMT?: number;
  totalNetRevenueMT?: number;
  commissionRate?: number;
  totalConversations: number;
  totalMessages: number;
  geminiStatus: 'operational' | 'degraded' | 'configured';
  geminiModel: string;
  geminiHealth: string;
  geminiLatencyMs: number;
  recentPayments: PaymentTransaction[];
  usageByDay: { date: string; messages: number; users: number }[];
}

export type SystemStats = AdminStats;

export interface AdminDataResponse {
  stats: AdminStats;
  users: User[];
  transactions: PaymentTransaction[];
  plans: Plan[];
}
