import React from 'react';
import { useAuth } from '../context/AuthContext';
import { WayAILogo } from './WayAILogo';
import { Sparkles, ShieldCheck, Mail, Phone, Heart, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView } = useAuth();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <WayAILogo variant="compact" size="sm" onClick={() => setCurrentView('landing')} />
            <p className="text-xs text-slate-400 leading-relaxed">
              A plataforma de inteligência artificial de referência em Moçambique, adaptada ao currículo nacional, normas da UEM, UP e do ensino moçambicano.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>100% Adaptado a Moçambique</span>
            </div>
          </div>

          {/* Academic Tools */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Ferramentas Académicas</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentView('chat')} className="hover:text-emerald-400 transition-colors">
                  Chat IA com Gemini 3
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('documents')} className="hover:text-emerald-400 transition-colors">
                  Gerador de Monografias & Trabalhos
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('tools')} className="hover:text-emerald-400 transition-colors">
                  Resolução de Exercícios Passo a Passo
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('tools')} className="hover:text-emerald-400 transition-colors">
                  Simulador de Testes e Frequências
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('tools')} className="hover:text-emerald-400 transition-colors">
                  Revisor Ortográfico e Normas UEM/APA
                </button>
              </li>
            </ul>
          </div>

          {/* Institutional & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Suporte & Legal</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setCurrentView('plans')} className="hover:text-emerald-400 transition-colors">
                  Planos (Diário, Semanal, Mensal)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('help')} className="hover:text-emerald-400 transition-colors">
                  Perguntas Frequentes (FAQ)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('help')} className="hover:text-emerald-400 transition-colors">
                  Contactar Suporte Técnico
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('terms')} className="hover:text-emerald-400 transition-colors">
                  Termos e Condições
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentView('privacy')} className="hover:text-emerald-400 transition-colors">
                  Política de Privacidade de Dados
                </button>
              </li>
            </ul>
          </div>

          {/* Payment & Mozambique Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Pagamentos em Moçambique</h4>
            <p className="text-xs text-slate-400 mb-3">
              Activação instantânea através das carteiras móveis nacionais:
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2.5 py-1 rounded bg-red-950/80 text-red-300 border border-red-800/60 text-xs font-bold">
                M-Pesa (Vodacom)
              </span>
              <span className="px-2.5 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60 text-xs font-bold">
                e-Mola (Movitel)
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-medium">
                Metical (MT / MZN)
              </span>
            </div>

            <div className="text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>cristianonumerique@gmail.com</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+258 84 / 86 (Moçambique)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} Way Estudantes AI. Todos os direitos reservados.</span>
          </div>

          <div className="flex items-center gap-1 text-slate-400">
            <span>Desenvolvido com</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>para o futuro académico de Moçambique.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
