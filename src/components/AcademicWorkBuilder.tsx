import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AcademicWorkData } from '../types';
import { exportToPDF, exportToDocx, exportToText } from '../utils/exportUtils';
import { MathRenderer } from './MathRenderer';
import {
  KNOWLEDGE_AREAS,
  ACADEMIC_WORK_PAGES_OPTIONS,
  ACADEMIC_WORK_SECTIONS,
  PLATFORM_MISSION,
  PLATFORM_LIMITATIONS,
} from '../data/knowledgeAreas';
import {
  FileText,
  Sparkles,
  Download,
  FileDown,
  Edit3,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Copy,
  Check,
  Layers,
  HelpCircle,
  Award,
  ShieldAlert,
  Info,
} from 'lucide-react';

export const AcademicWorkBuilder: React.FC = () => {
  const { user, showToast, setActivePlanModal } = useAuth();

  const [formData, setFormData] = useState<AcademicWorkData>({
    theme: '',
    subject: 'Metodologia de Investigação Científica',
    course: user?.course || 'Gestão e Administração de Empresas',
    description: 'Trabalho de investigação aprofundado com análise teórica, aplicação prática em Moçambique, exercícios comentados e normas APA 7ª.',
    institution: user?.institution || 'Universidade Eduardo Mondlane (UEM)',
    studentName: user?.name || 'Estudante',
    supervisorName: 'Docente Orientador',
    pagesCount: 6,
    workType: 'Trabalho de Investigação',
    standard: 'Normas UEM / UP',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedKnowledgeArea, setSelectedKnowledgeArea] = useState<string>('gestao');

  const sampleThemes = [
    {
      area: 'gestao',
      theme: 'O impacto da Gestão de Caixa e Liquidez na Sustentabilidade das PMEs em Maputo',
      course: 'Gestão e Contabilidade',
    },
    {
      area: 'economia',
      theme: 'A Exploração do Gás Natural na Bacia do Rovuma e o Desenvolvimento Socioeconómico em Moçambique',
      course: 'Economia e Finanças',
    },
    {
      area: 'informatica',
      theme: 'Adoção de Sistemas de Informação e Inteligência Artificial nas Universidades Moçambicanas',
      course: 'Informática e Engenharia de Software',
    },
    {
      area: 'cultura-mocambicana',
      theme: 'Preservação da Timbila Chopi como Património Imaterial da Humanidade e Identidade Nacional',
      course: 'Ciências Sociais e Antropologia Cultural',
    },
    {
      area: 'educacao-inclusiva',
      theme: 'Desafios e Estratégias Pedagógicas da Educação Inclusiva para Alunos com NEE nas Escolas de Moçambique',
      course: 'Ciências da Educação e Pedagogia',
    },
    {
      area: 'geografia',
      theme: 'Potencial Agropecuário e Energético da Bacia Hidrográfica do Zambeze no Centro de Moçambique',
      course: 'Geografia e Meio Ambiente',
    },
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.theme.trim()) {
      showToast('Por favor, informa o tema do trabalho.', 'error');
      return;
    }

    if (!user) {
      showToast('Inicia sessão para gerar trabalhos académicos.', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await api.generateAcademicWork(user.id, formData);
      setGeneratedText(res.content);
      showToast(`Trabalho de ${formData.pagesCount} páginas gerado com sucesso!`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Erro ao gerar trabalho académico.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    showToast('Trabalho copiado para a área de transferência!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportPDF = () => {
    if (!generatedText) return;
    exportToPDF(formData.theme, generatedText, {
      institution: formData.institution,
      course: formData.course,
      student: formData.studentName,
    });
    showToast('Documento PDF gerado e descarregado!', 'success');
  };

  const handleExportDocx = async () => {
    if (!generatedText) return;
    await exportToDocx(formData.theme, generatedText, {
      institution: formData.institution,
      course: formData.course,
      student: formData.studentName,
    });
    showToast('Ficheiro Word (.docx) gerado com sucesso!', 'success');
  };

  const handleSelectSample = (sample: typeof sampleThemes[0]) => {
    setFormData((prev) => ({
      ...prev,
      theme: sample.theme,
      course: sample.course,
      subject: sample.course,
    }));
    setSelectedKnowledgeArea(sample.area);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Funcionalidade Especial</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Trabalho Académico por Páginas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Cria trabalhos académicos completos e rigorosos organizados automaticamente em 9 secções normatizadas, adaptadas a 3, 6, 12 ou 18 páginas de densidade teórica.
          </p>
        </div>

        {generatedText && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/20 flex items-center gap-1.5 transition-all"
              id="export-pdf-btn"
            >
              <FileDown className="w-4 h-4" />
              <span>Exportar PDF</span>
            </button>

            <button
              onClick={handleExportDocx}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-all"
              id="export-docx-btn"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Word (.docx)</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              title="Copiar texto do trabalho"
              id="copy-work-btn"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* 9-Part Automatic Structure Indicator */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 text-white border border-slate-800 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-300">
              Estrutura Automática do Trabalho (9 Secções Rigorosas)
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Formatação oficial UEM, UP e APA 7ª Edição
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2 text-center">
          {ACADEMIC_WORK_SECTIONS.map((sec, idx) => (
            <div
              key={sec.id}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 transition-colors"
            >
              <span className="block text-[10px] font-black text-cyan-400 mb-0.5">
                0{idx + 1}
              </span>
              <span className="text-[11px] font-medium text-slate-200 leading-tight line-clamp-2">
                {sec.title.split('. ')[1]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleGenerate} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>Dados Essenciais do Estudante</span>
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                4 Passos
              </span>
            </div>

            {/* Quick Themes from Mozambican Realities */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Sugestões Rápidas por Áreas de Conhecimento:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {sampleThemes.map((st, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(st)}
                    className="text-[11px] text-left px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-transparent hover:border-emerald-300 flex items-center gap-1"
                  >
                    <span>💡</span>
                    <span className="truncate max-w-[200px]">{st.theme}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 1. Tema do Trabalho */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                1. Tema do Trabalho *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Ex: O impacto da Gestão de Caixa e Liquidez na Sustentabilidade das PMEs em Maputo"
                value={formData.theme}
                onChange={(e) => setFormData({ ...formData, theme: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                id="work-theme-input"
              />
            </div>

            {/* 2. Curso ou Disciplina */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                2. Curso ou Disciplina *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Gestão Financeira / Contabilidade / História de Moçambique"
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value, subject: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                id="work-course-input"
              />
            </div>

            {/* 3. Descrição do Trabalho */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                3. Descrição do Trabalho (Objectivos e Orientações) *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Ex: Incluir exemplos práticos da economia moçambicana, fundamentação teórica sólida e exercícios com análise crítica."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value, customInstructions: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                id="work-desc-input"
              />
            </div>

            {/* 4. Número de Páginas Desejadas (Cards Selecionáveis) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center justify-between">
                <span>4. Número de Páginas Desejadas *</span>
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {formData.pagesCount} páginas selecionadas
                </span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {ACADEMIC_WORK_PAGES_OPTIONS.map((num) => {
                  const isSelected = formData.pagesCount === num;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setFormData({ ...formData, pagesCount: num })}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/30 font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <span className="text-base sm:text-lg font-black">{num}</span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold">
                        Páginas
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary Academic Details (Accordion/Grid) */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Instituição de Ensino
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Normas Académicas
                  </label>
                  <select
                    value={formData.standard}
                    onChange={(e) => setFormData({ ...formData, standard: e.target.value as any })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="Normas UEM / UP">Normas UEM / UP</option>
                    <option value="Normas APA 7ª Edição">Normas APA 7ª Edição</option>
                    <option value="Normas ABNT">Normas ABNT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Nome do Estudante
                  </label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Docente Orientador
                  </label>
                  <input
                    type="text"
                    value={formData.supervisorName}
                    onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              id="generate-work-submit-btn"
            >
              {isGenerating ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>A Gerar {formData.pagesCount} Páginas em 9 Secções...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar Trabalho ({formData.pagesCount} Páginas)</span>
                </>
              )}
            </button>
          </form>

          {/* Ethics and Mission Box */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-300 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Compromisso e Finalidade Educativa</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-400">
              {PLATFORM_LIMITATIONS}
            </p>
          </div>
        </div>

        {/* Right Output / Preview Column */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col min-h-[600px]">
            {/* Toolbar */}
            <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  Visualização do Documento
                </span>
                {generatedText && (
                  <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                    {formData.pagesCount} Páginas • {formData.standard}
                  </span>
                )}
              </div>

              {generatedText && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                      isEditing
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Visualizar Formatado' : 'Editar Markdown'}</span>
                  </button>
                </div>
              )}
            </div>

            {/* Document Content Area */}
            <div className="p-6 flex-1 overflow-y-auto max-h-[750px]">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full py-24 space-y-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-pulse">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    A construir a estrutura completa ({formData.pagesCount} páginas)...
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm">
                    A organizar Capa, Introdução, Desenvolvimento, Aplicação Prática, Exercícios, Análise e Referências Bibliográficas.
                  </p>
                </div>
              ) : generatedText ? (
                isEditing ? (
                  <textarea
                    value={generatedText}
                    onChange={(e) => setGeneratedText(e.target.value)}
                    className="w-full h-full min-h-[550px] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-y"
                  />
                ) : (
                  <div className="max-w-none text-xs sm:text-sm leading-relaxed space-y-4 font-sans">
                    <MathRenderer content={generatedText} />
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-24 text-center space-y-4 text-slate-400">
                  <BookOpen className="w-14 h-14 opacity-30" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Nenhum trabalho gerado ainda.
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-sm mx-auto">
                      Preenche o formulário à esquerda informando o tema, disciplina, descrição e número de páginas (3, 6, 12 ou 18) e clica em "Gerar Trabalho".
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-900">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>9 Secções automáticas prontas para exportar em PDF ou Word</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
