import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { WayAILogo } from './WayAILogo';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  FileText,
  Camera,
  CheckCircle2,
  Zap,
  ShieldCheck,
  GraduationCap,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  CreditCard,
  School,
  Star,
} from 'lucide-react';
import { motion } from 'motion/react';

export const LandingView: React.FC = () => {
  const { user, setCurrentView, setActiveAuthModal, setActivePlanModal } = useAuth();

  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [demoQuery, setDemoQuery] = useState('');
  const [demoResponse, setDemoResponse] = useState<string | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);

  const samplePrompts = [
    'Como estruturar uma monografia segundo as normas da UEM?',
    'Explica a inflação e a política monetária do Banco de Moçambique.',
    'Resolve este exercício de microeconomia com Meticais (MT).',
    'Cria um resumo sobre a História da Luta de Libertação Nacional.',
  ];

  const handleRunDemo = (queryText: string) => {
    setDemoQuery(queryText);
    setDemoLoading(true);
    setDemoResponse(null);

    setTimeout(() => {
      setDemoLoading(false);
      if (queryText.includes('monografia') || queryText.includes('UEM')) {
        setDemoResponse(
          `**Estrutura Académica Recomendada (Normas UEM / UP):**\n1. **Elementos Pré-Textuais**: Capa oficial, Folha de Rosto, Declaração de Honra, Dedicatória, Agradecimentos, Resumo com palavras-chave, Índice Geral.\n2. **Introdução**: Contextualização em Moçambique, Problematização com pergunta central, Hipóteses, Objectivo Geral e Específicos, Justificativa e Delimitação.\n3. **Fundamentação Teórica**: Revisão bibliográfica com citações no padrão Autor (Ano).\n4. **Metodologia**: Abordagem mista ou qualitativa, técnicas de recolha (inquéritos/entrevistas nas instituições moçambicanas).\n5. **Análise dos Resultados & Conclusões**.\n6. **Referências Bibliográficas** (Normas APA 7ª Edição).`
        );
      } else if (queryText.includes('Banco de Moçambique') || queryText.includes('inflação')) {
        setDemoResponse(
          `**Política Monetária e Inflação em Moçambique:**\nO **Banco de Moçambique (BM)** utiliza a **Taxa MIMO** (Mercado Interbancário Monetário) como principal taxa de juro de política monetária para ancorar as expectativas de inflação medida pelo IPC (Índice de Preços no Consumidor calculado pelo INE). Quando a inflação sobe devido a choques na taxa de câmbio do Metical (MZN) ou combustíveis importados, o BM ajusta as taxas diretoras e as reservas obrigatórias dos bancos comerciais (como BIM, BCI e Standard Bank).`
        );
      } else {
        setDemoResponse(
          `**Resposta Didática do Way Estudantes AI:**\nExcelente pergunta académica! Para obteres o desenvolvimento completo passo a passo com referências bibliográficas, cálculos em Meticais (MT) e exportação em PDF/Word, clica em **Experimentar Chat** agora!`
        );
      }
    }, 900);
  };

  const faqs = [
    {
      q: 'O que é o Way Estudantes AI e como ajuda nos meus estudos em Moçambique?',
      a: 'O Way Estudantes AI é a primeira plataforma de inteligência artificial adaptada à realidade educativa moçambicana. Permite tirar dúvidas, resolver exercícios passo a passo, estruturar monografias e relatórios segundo normas da UEM/UP, analisar imagens de testes e resumir PDFs em poucos segundos.',
    },
    {
      q: 'Como funcionam os pagamentos com M-Pesa e e-Mola?',
      a: 'Os pagamentos são processados instantaneamente através de carteiras móveis nacionais (M-Pesa da Vodacom e e-Mola da Movitel). Ao escolheres um plano (65 MT/dia, 180 MT/semana ou 300 MT/mês), recebes a confirmação no teu telemóvel e o acesso à IA é activado de imediato.',
    },
    {
      q: 'Posso enviar fotografias dos exercícios do meu caderno ou do quadro?',
      a: 'Sim! A nossa inteligência artificial multimodal interpreta fotos de apontamentos manuscritos, equações no quadro e enunciados de testes, explicando detalhadamente a resolução passo a passo.',
    },
    {
      q: 'Os trabalhos gerados seguem as normas das universidades moçambicanas?',
      a: 'Sim. O nosso gerador académico foi programado especificamente para seguir os padrões exigidos na UEM, UP, USTM, UniZambeze, ISCTEM e demais faculdades de Moçambique, incluindo capa, folha de rosto, índice, citações e referências APA 7ª Edição.',
    },
    {
      q: 'Como posso exportar os meus trabalhos?',
      a: 'Podes exportar diretamente para ficheiros Microsoft Word (.docx) ou PDF formatados profissionalmente com apenas um clique.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 bg-gradient-to-b from-emerald-50/70 via-white to-transparent dark:from-emerald-950/20 dark:via-slate-950 dark:to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Brand Logo Showcase */}
            <div className="flex justify-center mb-2">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg shadow-cyan-500/10">
                <WayAILogo variant="badge" size="sm" />
                <div className="text-left">
                  <div className="text-xs font-black tracking-wider text-slate-900 dark:text-white uppercase flex items-center gap-1.5">
                    <span>WAY AI</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-extrabold">MZ 🇲🇿</span>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Plataforma Oficial de IA Académica</span>
                </div>
              </div>
            </div>

            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-950/80 border border-cyan-200 dark:border-cyan-800/50 text-cyan-900 dark:text-cyan-200 text-xs font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>O 1º SaaS de Inteligência Artificial para Estudantes de Moçambique</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
              A tua inteligência artificial para{' '}
              <span className="bg-gradient-to-r from-cyan-600 via-teal-500 to-blue-600 bg-clip-text text-transparent">
                estudar melhor.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              Estuda, pesquisa, cria trabalhos e aprende com uma IA preparada para a realidade dos estudantes de Moçambique.
              Respostas didáticas, resolução passo a passo e normas UEM/UP.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
              <button
                onClick={() => (user ? setCurrentView('chat') : setActiveAuthModal('register'))}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-105"
                id="hero-cta-start-free"
              >
                <span>Começar Gratuitamente</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCurrentView('chat')}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center gap-2.5 transition-all"
                id="hero-cta-try-chat"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Experimentar Way Estudantes AI</span>
              </button>
            </div>

            {/* Badges / Guarantees */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Sem necessidade de cartão internacional</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>M-Pesa & e-Mola a partir de 65 MT</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Normas UEM / UP / APA 7ª</span>
              </div>
            </div>
          </div>

          {/* Interactive Live Demo Card */}
          <div className="mt-12 max-w-4xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 sm:p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2">
                  Demonstração Rápida de Conhecimento Moçambicano 🇲🇿
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md">
                Gemini 3 Flash Conectado
              </span>
            </div>

            {/* Quick prompt pills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleRunDemo(p)}
                  className="text-xs text-left px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-transparent hover:border-emerald-300 dark:hover:border-emerald-700"
                >
                  💡 {p}
                </button>
              ))}
            </div>

            {/* Input simulation */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Digita uma dúvida sobre matérias de Moçambique..."
                value={demoQuery}
                onChange={(e) => setDemoQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && demoQuery && handleRunDemo(demoQuery)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => demoQuery && handleRunDemo(demoQuery)}
                disabled={demoLoading || !demoQuery}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs disabled:opacity-50 transition-colors"
              >
                {demoLoading ? 'A processar...' : 'Perguntar'}
              </button>
            </div>

            {/* Output area */}
            {demoResponse && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed font-sans"
              >
                {demoResponse}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* University Support Carousel Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">
          Compatível com o Regulamento Académico das Principais Instituições de Moçambique
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 opacity-85">
          {[
            'UEM (Universidade Eduardo Mondlane)',
            'UP (Universidade Pedagógica)',
            'USTM (Universidade São Tomás)',
            'UniZambeze',
            'UniLúrio',
            'ISCTEM',
            'A Politécnica',
            'ISUTC',
            'Institutos Técnicos (IFP/IICM)',
            'Ensino Secundário Geral (ESG)',
          ].map((uni, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-xs"
            >
              <School className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{uni}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Tudo o que precisas para ser o melhor da tua turma.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Ferramentas desenhadas à medida para os desafios reais dos estudantes em Moçambique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Gerador de Monografias & Trabalhos
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Cria estruturas completas de trabalhos de investigação, monografias e relatórios de estágio com capa, índice, introdução, metodologia e referências segundo normas da UEM/UP.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Visão IA para Fotos de Testes & Cadernos
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Tira uma fotografia ao exercício no quadro, ao teste ou aos apontamentos e a inteligência artificial analisa a imagem resolvendo o problema passo a passo.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              M-Pesa & e-Mola 100% Integrados
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Sem precisar de cartão de crédito internacional. Paga facilmente com o teu telemóvel Vodacom (84/85) ou Movitel (86/87) com planos a partir de 65 MT.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>Preços Acessíveis aos Estudantes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Planos flexíveis para cada momento do semestre.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Escolhe o plano ideal para ti e activa na hora via M-Pesa ou e-Mola.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Plano Diário */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Plano Diário</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Ideal para terminar aquele trabalho urgente para amanhã.
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white">65 MT</span>
                <span className="text-xs text-slate-400">/ 24 horas</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Acesso completo ao Gemini 3</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Gerador de Trabalhos Académicos</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Exportação em DOCX e PDF</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Upload de imagens e PDFs</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => (user ? setActivePlanModal(true) : setActiveAuthModal('register'))}
              className="mt-6 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition-colors"
            >
              Escolher Diário (65 MT)
            </button>
          </div>

          {/* Plano Semanal (Popular) */}
          <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-2xl flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold tracking-wider uppercase shadow-md">
              Mais Popular 🔥
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Plano Semanal</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Perfeito para semanas de frequências, testes e pesquisas intensivas.
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">180 MT</span>
                <span className="text-xs text-slate-400">/ 7 dias</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Tudo do Plano Diário</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Resolução passo a passo de exercícios</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Simulador de Testes com Chave</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Alta velocidade de resposta</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => (user ? setActivePlanModal(true) : setActiveAuthModal('register'))}
              className="mt-6 w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all hover:scale-102"
            >
              Escolher Semanal (180 MT)
            </button>
          </div>

          {/* Plano Mensal */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Plano Mensal</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                O melhor custo-benefício (apenas 10 MT/dia para o mês inteiro).
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 dark:text-white">300 MT</span>
                <span className="text-xs text-slate-400">/ 30 dias</span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-slate-100 dark:border-slate-800">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Acesso contínuo sem limites diários</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Geração ilimitada de Monografias</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Revisão ortográfica e ABNT</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Suporte prioritário via WhatsApp</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => (user ? setActivePlanModal(true) : setActiveAuthModal('register'))}
              className="mt-6 w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition-colors"
            >
              Escolher Mensal (300 MT)
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            O que dizem os estudantes em Moçambique
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Centenas de estudantes em Maputo, Beira, Nampula e Tete já utilizam o Way Estudantes AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Helena Mondlane',
              course: 'Contabilidade e Auditoria',
              institution: 'Universidade Pedagógica (UP - Maputo)',
              comment:
                'O Way Estudantes AI salvou-me na época de exames! Consegui resolver exercícios de contabilidade com exemplos reais de empresas moçambicanas e pagar com o meu M-Pesa facilmente.',
            },
            {
              name: 'Armando Cossa',
              course: 'Engenharia Informática',
              institution: 'Universidade Eduardo Mondlane (UEM)',
              comment:
                'A precisão nas normas de monografia da UEM é impressionante. Gerou a estrutura com introdução, problematização e referências APA 7ª sem erros.',
            },
            {
              name: 'Tânia Macuácua',
              course: 'Direito & Relações Internacionais',
              institution: 'Universidade São Tomás (USTM)',
              comment:
                'Poder tirar fotografia aos apontamentos do quadro e receber a explicação em português claro e acolhedor mudou a minha rotina de estudos.',
            },
          ].map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 italic leading-relaxed">
                "{t.comment}"
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">{t.course}</p>
                <p className="text-[10px] text-slate-400">{t.institution}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Tudo o que precisas de saber sobre o funcionamento do Way Estudantes AI.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = faqOpen === i;
            return (
              <div
                key={i}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <button
                  onClick={() => setFaqOpen(isOpen ? null : i)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span>{f.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Final Banner CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 text-white p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Pronto para transformar a tua vida académica em Moçambique?
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-normal">
              Cria a tua conta hoje mesmo e tem ao teu lado o assistente de inteligência artificial mais preparado do país.
            </p>
            <div className="pt-2">
              <button
                onClick={() => (user ? setCurrentView('chat') : setActiveAuthModal('register'))}
                className="px-8 py-4 rounded-2xl bg-white text-emerald-900 font-extrabold text-sm shadow-xl hover:bg-emerald-50 transition-all hover:scale-105"
              >
                Começar Agora Gratuitamente 🇲🇿
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
