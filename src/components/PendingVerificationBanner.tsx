import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Clock, ArrowRight, ShieldAlert, X } from 'lucide-react';

export const PendingVerificationBanner: React.FC = () => {
  const { pendingVerificationEmail, setActiveAuthModal, cancelPendingVerification } = useAuth();

  if (!pendingVerificationEmail) return null;

  return (
    <div className="bg-gradient-to-r from-amber-500 via-emerald-600 to-teal-600 text-white px-4 py-2.5 shadow-md relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-medium">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <span className="font-bold">Registo Pendente: </span>
            <span>Código de 6 dígitos enviado para </span>
            <strong className="underline underline-offset-2">{pendingVerificationEmail}</strong>.
            <span className="hidden md:inline text-white/90 ml-1">
              Valida a conta para ter acesso total ao Gemini 3 e Ferramentas Acadêmicas.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveAuthModal('verify')}
            className="px-3.5 py-1 rounded-full bg-white text-emerald-900 font-bold text-xs hover:bg-emerald-50 transition-all shadow-xs flex items-center gap-1"
            id="banner-validate-now-btn"
          >
            <span>Inserir Código</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={cancelPendingVerification}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Cancelar e trocar de e-mail"
            aria-label="Fechar banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
