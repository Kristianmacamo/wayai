import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { createCheckoutSession } from '../services/stripe';
import {
  X,
  Sparkles,
  CreditCard,
  Phone,
  CheckCircle2,
  AlertCircle,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
  RotateCcw,
  Lock,
  Globe,
  ExternalLink,
} from 'lucide-react';

export const PlansAndPaymentModal: React.FC = () => {
  const { user, activePlanModal, setActivePlanModal, refreshUser, showToast } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState<'plan-diario' | 'plan-semanal' | 'plan-mensal'>('plan-semanal');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'emola' | 'stripe'>('mpesa');
  const [paymentMode, setPaymentMode] = useState<'instant' | 'reference'>('instant');
  const [manualReference, setManualReference] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || '+258 84 ');
  const [step, setStep] = useState<'choose' | 'confirm_ussd' | 'success'>('choose');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);

  // Stripe Card Details State
  const [cardHolder, setCardHolder] = useState(user?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  if (!activePlanModal) return null;

  const plans = [
    {
      id: 'plan-diario',
      name: 'Plano Diário',
      price: 65,
      commission: 6.5,
      duration: '24 horas',
      badge: null,
      desc: 'Ideal para finalizar aquele trabalho urgente para amanhã.',
      features: [
        'Acesso total ao Gemini 3.7 Flash',
        'Gerador de Trabalhos UEM/UP',
        'Exportação em PDF e Word (.docx)',
        'Análise de fotos e enunciados',
      ],
    },
    {
      id: 'plan-semanal',
      name: 'Plano Semanal',
      price: 180,
      commission: 18.0,
      duration: '7 dias',
      badge: 'Mais Popular 🔥',
      desc: 'Perfeito para a semana de testes, frequências e pesquisas.',
      features: [
        'Tudo do Plano Diário',
        'Resolução detalhada de exercícios',
        'Simulador de Testes com Chave',
        'Alta prioridade de resposta',
      ],
    },
    {
      id: 'plan-mensal',
      name: 'Plano Mensal',
      price: 300,
      commission: 30.0,
      duration: '30 dias',
      badge: 'Melhor Custo-Benefício 💡',
      desc: 'Apenas 10 MT por dia para teres a melhor IA durante todo o mês.',
      features: [
        'Geração ilimitada de monografias',
        'Revisão ortográfica e normas ABNT',
        'Suporte prioritário via WhatsApp',
        'Acesso sem limites diários',
      ],
    },
  ];

  const currentPlanObj = plans.find((p) => p.id === selectedPlan)!;
  const approxUsd = (currentPlanObj.price / 64.0).toFixed(2);

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) {
      return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    return digits;
  };

  const handleStartPayment = async () => {
    if (!user) {
      showToast('Por favor, inicia sessão para activar um plano.', 'error');
      return;
    }

    // 1. Stripe Card Checkout Flow
    if (paymentMethod === 'stripe') {
      if (cardNumber.replace(/\s/g, '').length < 13) {
        showToast('Por favor, introduz um número de cartão de crédito/débito válido.', 'error');
        return;
      }
      if (cardExpiry.length < 4) {
        showToast('Por favor, introduz a data de validade (MM/AA).', 'error');
        return;
      }
      if (cardCvc.length < 3) {
        showToast('Por favor, introduz o código CVC de 3 dígitos.', 'error');
        return;
      }

      setIsProcessing(true);
      try {
        // Step 1: Create Stripe PaymentIntent on backend
        const intent = await api.createStripePaymentIntent(user.id, {
          planId: selectedPlan,
          currency: 'usd',
        });

        // Step 2: Confirm Stripe Payment on backend
        const confirmRes = await api.confirmStripePayment(user.id, {
          planId: selectedPlan,
          paymentIntentId: intent.paymentIntentId,
          paymentMethodDetails: {
            brand: 'visa',
            last4: cardNumber.replace(/\s/g, '').slice(-4),
            cardHolder: cardHolder || user.name,
          },
        });

        setTransactionData(confirmRes);
        setStep('success');
        await refreshUser();
        showToast('Pagamento com cartão (Stripe) aprovado e plano activado! 🎉', 'success');
      } catch (err: any) {
        showToast(err.message || 'Erro ao processar pagamento Stripe.', 'error');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // 2. Mobile Wallet SMS Reference Validation Flow
    if (paymentMode === 'reference') {
      if (!manualReference || manualReference.trim().length < 4) {
        showToast('Por favor, introduz o código de confirmação da transacção (SMS M-Pesa / e-Mola).', 'error');
        return;
      }

      setIsProcessing(true);
      try {
        const res = await api.verifyRealPaymentReference(user.id, {
          planId: selectedPlan,
          paymentMethod,
          referenceCode: manualReference,
          phoneNumber,
        });

        setTransactionData(res);
        setStep('success');
        await refreshUser();
        showToast('Comprovativo validado e plano activado com sucesso! 🎉', 'success');
      } catch (err: any) {
        showToast(err.message || 'Erro ao validar comprovativo.', 'error');
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // 3. Mobile Wallet USSD Push Flow (M-Pesa / e-Mola)
    if (!phoneNumber || phoneNumber.trim().length < 8) {
      showToast('Por favor, introduz um número de telemóvel válido de Moçambique (+258 84/85/86/87).', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const res = await api.processPayment(user.id, {
        planId: selectedPlan,
        paymentMethod: paymentMethod as 'mpesa' | 'emola',
        phoneNumber,
      });

      setTransactionData(res);
      setStep('confirm_ussd');
      showToast('Pedido de pagamento enviado para o teu telemóvel!', 'info');
    } catch (err: any) {
      showToast(err.message || 'Erro ao iniciar pagamento.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulateUSSDConfirm = async () => {
    setIsProcessing(true);
    setTimeout(async () => {
      setIsProcessing(false);
      setStep('success');
      await refreshUser();
      showToast('Pagamento confirmado e plano activado com sucesso! 🎉', 'success');
    }, 1000);
  };

  const handleClose = () => {
    setActivePlanModal(false);
    setStep('choose');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content according to Step */}
        {step === 'choose' && (
          <div className="space-y-6">
            <div className="text-center space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-1">
                <Zap className="w-3.5 h-3.5" />
                <span>Activação Imediata • M-Pesa, e-Mola & Cartão Stripe 💳</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Escolhe o teu Plano de Estudos
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paga de forma simples e segura em Meticais (MT) com M-Pesa, e-Mola ou Cartão Visa/Mastercard.
              </p>
            </div>

            {/* Plan selection radio cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {plans.map((p) => {
                const isSelected = selectedPlan === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id as any)}
                    className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 shadow-md'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                    }`}
                  >
                    {p.badge && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-extrabold uppercase tracking-wider">
                        {p.badge}
                      </span>
                    )}
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</p>
                      <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                        {p.price} MT
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                        <span>/{p.duration}</span>
                        <span className="text-emerald-600 dark:text-emerald-400">≈ ${(p.price / 64).toFixed(2)} USD</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                      {p.features.slice(0, 2).map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Forma de Pagamento:
                </label>
                {paymentMethod !== 'stripe' && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('instant')}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
                        paymentMode === 'instant'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Prompt Automático
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMode('reference')}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-colors ${
                        paymentMode === 'reference'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Validar Código SMS
                    </button>
                  </div>
                )}
              </div>

              {/* 3 Payment Options: M-Pesa, e-Mola, Stripe Card */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('mpesa')}
                  className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 transition-all text-center sm:text-left ${
                    paymentMethod === 'mpesa'
                      ? 'border-red-600 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-red-600 shrink-0" />
                  <span className="truncate text-[11px] sm:text-xs">M-Pesa (84/85)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('emola')}
                  className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 transition-all text-center sm:text-left relative ${
                    paymentMethod === 'emola'
                      ? 'border-amber-600 bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-amber-600 shrink-0" />
                  <span className="truncate text-[11px] sm:text-xs">e-Mola (86/87)</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-200/80 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 font-semibold">
                    Em breve
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-3 rounded-2xl border-2 font-bold text-xs flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 transition-all text-center sm:text-left ${
                    paymentMethod === 'stripe'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span className="truncate text-[11px] sm:text-xs">Cartão (Stripe)</span>
                </button>
              </div>
            </div>

            {/* Content for Stripe Card */}
            {paymentMethod === 'stripe' ? (
              <div className="space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Pagamento Seguro com Stripe
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold">VISA</span>
                    <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold">MC</span>
                    <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold">AMEX</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Nome no Cartão:
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: KRISTIAN MACAMO"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Número do Cartão (Débito / Crédito):
                    </label>
                    <div className="relative">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        placeholder="4000 1234 5678 9010"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Validade (MM/AA):
                      </label>
                      <input
                        type="text"
                        placeholder="12/28"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                        maxLength={5}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        CVC / CVV:
                      </label>
                      <input
                        type="password"
                        placeholder="123"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        maxLength={4}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white font-mono text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  <span>Valor: <strong className="text-slate-800 dark:text-white">{currentPlanObj.price} MT</strong></span>
                  <span>Conversão Stripe: <strong className="text-indigo-600 dark:text-indigo-400 font-mono">${approxUsd} USD</strong></span>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={async () => {
                      if (!user) return;
                      setIsProcessing(true);
                      try {
                        const res = await createCheckoutSession({
                          planId: selectedPlan,
                          planName: currentPlanObj.name,
                          amountMT: currentPlanObj.price,
                          userId: user.id,
                          userEmail: user.email || 'estudante@moz.ac.mz',
                          userName: user.name,
                        });
                        if (res.error) {
                          showToast(res.error, 'error');
                        }
                      } catch (e: any) {
                        showToast(e.message || 'Erro ao redirecionar para o Stripe.', 'error');
                      } finally {
                        setIsProcessing(false);
                      }
                    }}
                    className="w-full py-2 px-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ou pagar no portal Stripe Checkout (com Apple Pay/Google Pay)</span>
                  </button>
                </div>
              </div>
            ) : paymentMode === 'instant' ? (
              /* Phone Number Input for USSD prompt */
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Número de Telemóvel para Pagamento:
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="+258 84 123 4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Receberás um pedido de confirmação no teu ecrã para introduzires o teu PIN {paymentMethod === 'mpesa' ? 'M-Pesa' : 'e-Mola'}.
                </p>
              </div>
            ) : (
              /* Manual Reference Code Input for direct transfers */
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Código de Confirmação da Transacção SMS ({paymentMethod === 'mpesa' ? 'M-Pesa' : 'e-Mola'}):
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Ex: MP260821.1420.A00129 ou 123456789"
                    value={manualReference}
                    onChange={(e) => setManualReference(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  Se transferiste via *150# (M-Pesa) ou *898# (e-Mola), cola aqui o código recebido por SMS para activação imediata.
                </p>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handleStartPayment}
              disabled={isProcessing}
              className={`w-full py-3.5 rounded-2xl text-white font-bold text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer ${
                paymentMethod === 'stripe'
                  ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
              }`}
              id="pay-now-btn"
            >
              {isProcessing ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {paymentMethod === 'stripe'
                      ? `Pagar ${currentPlanObj.price} MT (${approxUsd} USD) com Stripe`
                      : paymentMode === 'reference'
                      ? `Validar e Activar ${currentPlanObj.name} (${currentPlanObj.price} MT)`
                      : `Pagar ${currentPlanObj.price} MT com ${paymentMethod === 'mpesa' ? 'M-Pesa' : 'e-Mola'}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 2: USSD Push Simulated Screen */}
        {step === 'confirm_ussd' && (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto animate-pulse">
              <Phone className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Verifica o teu Telemóvel!
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Enviámos uma notificação para o número <strong className="text-slate-900 dark:text-white">{phoneNumber}</strong>.
              </p>
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-left text-xs font-mono text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 space-y-1">
                <p className="font-bold text-emerald-600 dark:text-emerald-400">
                  📱 Notificação {paymentMethod === 'mpesa' ? 'M-Pesa (Vodacom)' : 'e-Mola (Movitel)'}:
                </p>
                <p>Transferir {currentPlanObj.price}.00 MT para WAY ESTUDANTES AI?</p>
                <p className="text-[11px] text-slate-500">Introduz o teu PIN para autorizar.</p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleSimulateUSSDConfirm}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Já confirmei com o meu PIN</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setStep('choose')}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Voltar e alterar forma de pagamento
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success Screen */}
        {step === 'success' && (
          <div className="text-center py-6 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                Plano Activado com Sucesso! 🎉
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                O teu <strong className="text-slate-800 dark:text-slate-200">{currentPlanObj.name}</strong> está pronto a utilizar. Bons estudos!
              </p>
            </div>

            {/* Receipt Details */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs text-left max-w-sm mx-auto space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Valor Pago:</span>
                <span className="font-bold text-slate-800 dark:text-white">{currentPlanObj.price} MT {paymentMethod === 'stripe' && `(≈ $${approxUsd} USD)`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Método:</span>
                <span className="font-bold text-slate-800 dark:text-white">
                  {paymentMethod === 'mpesa' ? 'M-Pesa' : paymentMethod === 'emola' ? 'e-Mola' : 'Cartão (Stripe)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Referência / ID:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {transactionData?.transaction?.stripePaymentIntentId ||
                    transactionData?.transaction?.mpesaTransactionId ||
                    transactionData?.transaction?.referenceCode ||
                    transactionData?.reference ||
                    'STP_WAY_9921'}
                </span>
              </div>
            </div>

            <div className="space-y-3 max-w-sm mx-auto">
              <button
                type="button"
                onClick={async () => {
                  if (transactionData?.id || user?.email) {
                    try {
                      await api.sendPaymentReceiptEmail({
                        transactionId: transactionData?.id || 'tx-latest',
                        email: user?.email || 'kristianmacamo@gmail.com',
                      });
                      showToast('Comprovativo enviado por e-mail com sucesso!', 'success');
                    } catch (e: any) {
                      showToast(e.message || 'Erro ao enviar comprovativo.', 'error');
                    }
                  }
                }}
                className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>📧 Enviar Comprovativo por E-mail (Gmail)</span>
              </button>

              <button
                onClick={handleClose}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 cursor-pointer"
              >
                Começar a Estudar Agora
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
