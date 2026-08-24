import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  MessageSquare,
  FileText,
  Wrench,
  User,
  Zap,
  Home,
} from 'lucide-react';

export const RudderNav: React.FC = () => {
  const {
    user,
    currentView,
    setCurrentView,
    setActivePlanModal,
    setActiveAuthModal,
  } = useAuth();

  const rudderItems = [
    {
      id: user ? 'dashboard' : 'landing',
      label: user ? 'Painel' : 'Início',
      icon: user ? Sparkles : Home,
      view: (user ? 'dashboard' : 'landing') as any,
    },
    {
      id: 'chat',
      label: 'Chat IA',
      icon: MessageSquare,
      view: 'chat' as any,
    },
    {
      id: 'documents',
      label: 'Trabalhos',
      icon: FileText,
      view: 'documents' as any,
    },
    {
      id: 'tools',
      label: 'Ferramentas',
      icon: Wrench,
      view: 'tools' as any,
    },
  ];

  return (
    <nav
      id="app-rudder-nav"
      aria-label="Leme de Navegação Rápida"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 sm:gap-2 px-3 py-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 shadow-2xl shadow-slate-950/20 transition-all max-w-[96vw]"
    >
      {/* Navigation Buttons */}
      {rudderItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.view;

        return (
          <button
            key={item.id}
            id={`rudder-item-${item.id}`}
            onClick={() => setCurrentView(item.view)}
            className={`relative flex flex-col items-center justify-center px-3 sm:px-4 py-1.5 rounded-xl transition-all duration-200 ${
              isActive
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105 font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 font-medium'
            }`}
            title={item.label}
          >
            <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
            <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight leading-none whitespace-nowrap">
              {item.label}
            </span>

            {/* Active Glow Dot */}
            {isActive && (
              <span className="absolute -top-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>
        );
      })}

      <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-0.5 sm:mx-1" />

      {/* Planos M-Pesa Shortcut */}
      <button
        onClick={() => setActivePlanModal(true)}
        className="flex flex-col items-center justify-center px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-amber-500/15 dark:bg-amber-400/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25 transition-colors border border-amber-500/25 font-bold"
        title="Planos e Pagamentos M-Pesa (a partir de 65 MT)"
        id="rudder-plans-btn"
      >
        <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-500 text-amber-500" />
        <span className="text-[10px] sm:text-[11px] mt-0.5 leading-none whitespace-nowrap">65 MT</span>
      </button>

      {/* Profile / Auth Shortcut */}
      {user ? (
        <button
          onClick={() => setCurrentView('profile')}
          id="rudder-profile-btn"
          className={`flex flex-col items-center justify-center px-2.5 sm:px-3 py-1.5 rounded-xl transition-all ${
            currentView === 'profile'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105 font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/70 font-medium'
          }`}
          title="Meu Perfil"
        >
          <User className={`w-4 h-4 sm:w-5 sm:h-5 ${currentView === 'profile' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
          <span className="text-[10px] sm:text-[11px] mt-0.5 leading-none whitespace-nowrap">Perfil</span>
        </button>
      ) : (
        <button
          onClick={() => setActiveAuthModal('login')}
          id="rudder-login-btn"
          className="flex flex-col items-center justify-center px-2.5 sm:px-3 py-1.5 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-colors font-semibold"
          title="Entrar ou Registar"
        >
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-[10px] sm:text-[11px] mt-0.5 leading-none whitespace-nowrap">Entrar</span>
        </button>
      )}
    </nav>
  );
};
