import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, Calculator, Sparkles } from 'lucide-react';
import { formatAcademicAndMathContent } from '../utils/mathFormatter';

interface MathRendererProps {
  content: string;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);

  // Pre-clean content from LaTeX and math noise
  const processedContent = formatAcademicAndMathContent(content);

  const handleCopyFormula = (formulaText: string) => {
    navigator.clipboard.writeText(formulaText);
    setCopiedFormula(formulaText);
    setTimeout(() => {
      setCopiedFormula(null);
    }, 2000);
  };

  return (
    <div className={`academic-math-content space-y-4 text-slate-800 dark:text-slate-100 leading-relaxed ${className}`}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Eliminate horizontal rules (<hr />) completely as requested
          hr: () => <div className="h-6" />,

          // Custom Headings with clean vertical spacing
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-6 mb-3 pt-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-5 mb-2.5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 mt-4 mb-2">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 mt-3 mb-1.5">
              {children}
            </h4>
          ),

          // Custom Paragraphs
          p: ({ children }) => (
            <p className="text-sm sm:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed my-2.5">
              {children}
            </p>
          ),

          // Custom Lists with generous spacing
          ul: ({ children }) => (
            <ul className="space-y-1.5 my-3 pl-5 list-disc text-sm text-slate-700 dark:text-slate-300 marker:text-emerald-500">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1.5 my-3 pl-5 list-decimal text-sm text-slate-700 dark:text-slate-300 marker:text-emerald-600 dark:marker:text-emerald-400 font-medium">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="pl-1 leading-relaxed text-sm text-slate-700 dark:text-slate-300">{children}</li>
          ),

          // Blockquote for notes and highlights
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-emerald-500 pl-4 py-2 my-4 rounded-r-xl bg-emerald-50/50 dark:bg-emerald-950/30 text-slate-700 dark:text-slate-300 italic text-sm">
              {children}
            </blockquote>
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-xs sm:text-sm text-left border-collapse">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-700">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900/50">{children}</tbody>
          ),
          tr: ({ children }) => <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/40">{children}</tr>,
          th: ({ children }) => <th className="px-3.5 py-2.5 font-semibold text-slate-900 dark:text-slate-100">{children}</th>,
          td: ({ children }) => <td className="px-3.5 py-2 text-slate-700 dark:text-slate-300">{children}</td>,

          // Custom Code / Formula Box Rendering
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            const lang = match ? match[1] : '';
            const codeString = String(children).replace(/\n$/, '');

            // Dedicated Mathematical Formula Box
            if (lang === 'math' || lang === 'formula') {
              const isCopied = copiedFormula === codeString;
              return (
                <div className="group relative my-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50/70 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/30 dark:to-emerald-950/40 border-2 border-emerald-500/30 dark:border-emerald-500/40 shadow-sm transition-all hover:border-emerald-500/60">
                  <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
                      <Calculator className="w-3.5 h-3.5" />
                      <span>Fórmula Matemática</span>
                    </div>
                    <button
                      onClick={() => handleCopyFormula(codeString)}
                      className="p-1 rounded-lg text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200/60 dark:hover:bg-emerald-900/60 transition-colors text-xs flex items-center gap-1 font-medium"
                      title="Copiar fórmula"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-[11px] font-bold">Copiado</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-center text-base sm:text-lg font-bold text-slate-900 dark:text-emerald-100 tracking-wide overflow-x-auto py-1 px-2 select-all">
                    {codeString}
                  </div>
                </div>
              );
            }

            // Inline code
            if (inline) {
              return (
                <code
                  className="px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 font-mono text-xs font-semibold"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // General multi-line code block
            return (
              <div className="my-3 rounded-xl overflow-hidden bg-slate-900 text-slate-100 text-xs sm:text-sm font-mono border border-slate-800">
                <div className="px-4 py-2 bg-slate-950 text-slate-400 text-[11px] font-bold flex justify-between items-center border-b border-slate-800">
                  <span>{lang || 'código'}</span>
                  <button
                    onClick={() => handleCopyFormula(codeString)}
                    className="hover:text-white transition-colors"
                  >
                    {copiedFormula === codeString ? 'Copiado!' : 'Copiar'}
                  </button>
                </div>
                <div className="p-4 overflow-x-auto">{codeString}</div>
              </div>
            );
          },
        }}
      >
        {processedContent}
      </Markdown>
    </div>
  );
};
