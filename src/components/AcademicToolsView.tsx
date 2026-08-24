import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { exportToPDF, exportToDocx, exportToText } from '../utils/exportUtils';
import { MathRenderer } from './MathRenderer';
import {
  Wrench,
  Sparkles,
  BookOpen,
  Layers,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  Copy,
  Check,
  FileDown,
  Download,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

export const AcademicToolsView: React.FC = () => {
  const { user, showToast, setActivePlanModal } = useAuth();

  const [activeTab, setActiveTab] = useState<'explain' | 'summarize' | 'solve' | 'exam' | 'proofread'>('explain');
  const [inputText, setInputText] = useState('');
  const [extraParam, setExtraParam] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [outputResult, setOutputResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const tools = [
    {
      id: 'explain',
      label: 'Explicar Matéria',
      icon: BookOpen,
      desc: 'Explicações didáticas e acessíveis com analogias e exemplos moçambicanos.',
      inputPlaceholder: 'Ex: Como funciona o sistema fiscal e os impostos (IRPS, IRPC, IVA) em Moçambique?',
      paramLabel: 'Nível de Profundidade',
      paramOptions: ['Simples / Didático', 'Intermédio (Ensino Médio/Secundário)', 'Avançado (Universitário / Pós-Graduação)'],
    },
    {
      id: 'summarize',
      label: 'Resumidor de Texto & PDF',
      icon: Layers,
      desc: 'Sintetiza capítulos de livros, leis, artigos e documentos em pontos-chave essenciais.',
      inputPlaceholder: 'Cola aqui o texto longo, artigo ou apontamentos para resumir...',
      paramLabel: 'Formato do Resumo',
      paramOptions: ['Resumo em Tópicos / Bullet points', 'Resumo Executivo (1 página)', 'Fichamento Bibliográfico Completo'],
    },
    {
      id: 'solve',
      label: 'Resolvedor Passo a Passo',
      icon: TrendingUp,
      desc: 'Resolução detalhada de problemas de Matemática, Física, Contabilidade, Finanças e Economia.',
      inputPlaceholder: 'Ex: Uma empresa em Maputo compra mercadorias por 120.000 MT com IVA de 16%. Calcula o imposto dedutível e os lançamentos a débito e crédito.',
      paramLabel: 'Área da Disciplina',
      paramOptions: ['Contabilidade e Auditoria', 'Matemática e Cálculo', 'Física / Química', 'Micro e Macroeconomia (MZN)'],
    },
    {
      id: 'exam',
      label: 'Criar Teste de Preparação',
      icon: HelpCircle,
      desc: 'Gera uma simulação de exame/frequência com perguntas de escolha múltipla e chave de correcção comentada.',
      inputPlaceholder: 'Ex: Teste sobre Direito Comercial Moçambicano: Sociedades por Quotas e Anónimas.',
      paramLabel: 'Número de Questões',
      paramOptions: ['5 Questões com Chave Comentada', '10 Questões (Mista: Escolha Múltipla + Desenvolvimento)', 'Simulação Completa de Exame (15 perguntas)'],
    },
    {
      id: 'proofread',
      label: 'Corretor e Revisor ABNT/UEM',
      icon: FileCheck,
      desc: 'Revisão gramatical em Português de Moçambique e adequação de citações e referências.',
      inputPlaceholder: 'Cola aqui o parágrafo ou secção do teu trabalho para rever...',
      paramLabel: 'Estilo de Revisão',
      paramOptions: ['Correcção Gramatical e Clareza Académica', 'Adequação às Normas APA 7ª / UEM', 'Melhoria de Vocabulário Científico'],
    },
  ];

  const currentTool = tools.find((t) => t.id === activeTab)!;

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) {
      showToast('Por favor, introduz o texto ou questão.', 'error');
      return;
    }

    if (!user) {
      showToast('Inicia sessão para utilizar as ferramentas académicas.', 'error');
      return;
    }

    setIsProcessing(true);
    setOutputResult(null);

    try {
      const res = await api.runAcademicTool(
        user.id,
        activeTab as any,
        inputText,
        {
          preference: extraParam || currentTool.paramOptions[0],
          institution: user.institution || 'UEM / UP',
          course: user.course || 'Ensino Superior',
        }
      );

      setOutputResult(res.result);
      showToast('Processamento concluído com sucesso!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Erro ao processar.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (!outputResult) return;
    navigator.clipboard.writeText(outputResult);
    setCopied(true);
    showToast('Copiado para a área de transferência!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
          <Wrench className="w-3.5 h-3.5" />
          <span>Caixa de Ferramentas Académicas 🇲🇿</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Ferramentas Específicas de Aprendizagem
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Acelera os teus estudos com ferramentas desenhadas para tarefas académicas pontuais.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id as any);
                setOutputResult(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Working Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <currentTool.icon className="w-4 h-4 text-emerald-500" />
                <span>{currentTool.label}</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {currentTool.desc}
              </p>
            </div>

            <form onSubmit={handleProcess} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Conteúdo / Questão / Texto *
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder={currentTool.inputPlaceholder}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {currentTool.paramLabel}
                </label>
                <select
                  value={extraParam || currentTool.paramOptions[0]}
                  onChange={(e) => setExtraParam(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {currentTool.paramOptions.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>A Processar com Gemini 3...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Executar Ferramenta</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Output Result Column */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col min-h-[480px]">
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Resultado da Ferramenta
              </span>

              {outputResult && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      exportToPDF(currentTool.label, outputResult, {
                        institution: user?.institution,
                        student: user?.name,
                      });
                      showToast('PDF descarregado!', 'success');
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 text-xs flex items-center gap-1 font-semibold"
                    title="Exportar PDF"
                  >
                    <FileDown className="w-3.5 h-3.5 text-emerald-500" />
                    <span>PDF</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                    title="Copiar"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>

            <div className="p-6 flex-1 overflow-y-auto max-h-[600px]">
              {isProcessing ? (
                <div className="flex flex-col items-center justify-center h-full py-20 space-y-3 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    O Way Estudantes AI está a resolver e formatar a tua solicitação...
                  </p>
                </div>
              ) : outputResult ? (
                <div className="max-w-none text-xs sm:text-sm leading-relaxed space-y-3">
                  <MathRenderer content={outputResult} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-20 text-center space-y-2 text-slate-400">
                  <currentTool.icon className="w-10 h-10 opacity-30" />
                  <p className="text-xs font-medium">
                    Introduz a tua solicitação à esquerda e clica em Executar.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
