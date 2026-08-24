import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Conversation } from '../types';
import { WayAILogo } from './WayAILogo';
import {
  Sparkles,
  MessageSquare,
  FileText,
  Camera,
  BookOpen,
  HelpCircle,
  Clock,
  ArrowRight,
  Zap,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { user, setCurrentView, setSelectedConversationId, setActivePlanModal } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.getConversations(user.id)
      .then((res) => {
        setConversations(res.conversations || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [user]);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Estudante';

  const usagePercent = user
    ? Math.min(100, Math.round((user.dailyUsageCount / (user.maxDailyQuota || 50)) * 100))
    : 0;

  const planName = user?.planId === 'plan-mensal' ? 'Plano Mensal (300 MT)' : user?.planId === 'plan-semanal' ? 'Plano Semanal (180 MT)' : user?.planId === 'plan-diario' ? 'Plano Diário (65 MT)' : 'Plano Gratuito';

  const expiryFormatted = user?.planExpiry
    ? new Date(user.planExpiry).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'long', year: 'numeric' })
    : 'Sem data de expiração';

  const shortcuts = [
    {
      title: 'Novo Chat IA',
      desc: 'Tirar dúvidas e estudar com o Gemini 3 Flash',
      icon: MessageSquare,
      color: 'from-emerald-500 to-teal-600',
      action: () => {
        setSelectedConversationId(null);
        setCurrentView('chat');
      },
    },
    {
      title: 'Fazer Trabalho Académico',
      desc: 'Gerar monografias, normas UEM, UP e APA 7ª',
      icon: FileText,
      color: 'from-blue-500 to-indigo-600',
      action: () => setCurrentView('documents'),
    },
    {
      title: 'Resumir PDF & Documento',
      desc: 'Transformar textos longos em pontos-chave',
      icon: Layers,
      color: 'from-violet-500 to-purple-600',
      action: () => setCurrentView('tools'),
    },
    {
      title: 'Resolver Exercício Passo a Passo',
      desc: 'Matemática, contabilidade, física e economia',
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-600',
      action: () => setCurrentView('tools'),
    },
    {
      title: 'Criar Teste de Preparação',
      desc: 'Gerar simulação de exame com chave de correcção',
      icon: BookOpen,
      color: 'from-rose-500 to-pink-600',
      action: () => setCurrentView('tools'),
    },
    {
      title: 'Analisar Imagem / Foto',
      desc: 'Fotografar quadro, caderno ou enunciado',
      icon: Camera,
      color: 'from-teal-500 to-emerald-600',
      action: () => {
        setSelectedConversationId(null);
        setCurrentView('chat');
      },
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/50 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>WAY AI — Moçambique 🇲🇿</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Olá, {firstName}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            Como posso ajudar nos teus estudos hoje? Pergunta qualquer matéria, gera o teu trabalho universitário ou analisa exercícios com fotografias.
          </p>
        </div>

        <div className="relative z-10 shrink-0 hidden sm:block">
          <WayAILogo variant="badge" size="xl" className="hover:scale-105 transition-transform" />
        </div>
      </div>

      {/* Subscription & Usage Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Card 1: Plan Status */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Plano Actual</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
              Activo
            </span>
          </div>
          <p className="text-base font-extrabold text-slate-900 dark:text-white">
            {planName}
          </p>
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
            <span>Expira em:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{expiryFormatted}</span>
          </div>
          <button
            onClick={() => setActivePlanModal(true)}
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1"
          >
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
            Renovar / Mudar com M-Pesa
          </button>
        </div>

        {/* Card 2: Daily Quota Usage */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Utilização Diária</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{usagePercent}%</span>
          </div>
          <p className="text-base font-extrabold text-slate-900 dark:text-white">
            {user?.dailyUsageCount || 0} <span className="text-xs text-slate-400 font-normal">/ {user?.maxDailyQuota || 50} mensagens</span>
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                usagePercent > 85 ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${usagePercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {usagePercent >= 100
              ? 'Limite diário atingido. Faz upgrade de plano para continuar.'
              : 'O limite renova-se automaticamente todos os dias às 00:00.'}
          </p>
        </div>

        {/* Card 3: Academic Profile Info */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Perfil Académico</span>
            <button
              onClick={() => setCurrentView('profile')}
              className="text-emerald-600 dark:text-emerald-400 hover:underline text-[11px]"
            >
              Editar
            </button>
          </div>
          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
            {user?.institution || 'Instituição Moçambicana'}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            Curso: <span className="font-medium text-slate-700 dark:text-slate-300">{user?.course || 'Geral'}</span> ({user?.academicLevel || 'Licenciatura'})
          </p>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Normas UEM / UP Habilitadas</span>
          </div>
        </div>
      </div>

      {/* Fast Shortcuts Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
          Atalhos Rápidos de Estudo
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shortcuts.map((s, idx) => {
            const Icon = s.icon;
            return (
              <button
                key={idx}
                onClick={s.action}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-lg hover:border-emerald-500/50 transition-all text-left flex items-start gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${s.color} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {s.desc}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all mt-1" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            <span>Conversas & Pesquisas Recentes</span>
          </h2>
          <button
            onClick={() => {
              setSelectedConversationId(null);
              setCurrentView('chat');
            }}
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>Ver todas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {conversations.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
            <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ainda não tens nenhuma conversa iniciada.
            </p>
            <button
              onClick={() => {
                setSelectedConversationId(null);
                setCurrentView('chat');
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20"
            >
              Iniciar Primeira Conversa
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {conversations.slice(0, 4).map((c) => (
              <div
                key={c.id}
                onClick={() => {
                  setSelectedConversationId(c.id);
                  setCurrentView('chat');
                }}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="space-y-1 pr-4">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {c.title}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {new Date(c.updatedAt).toLocaleDateString('pt-MZ', {
                      day: '2-digit',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
