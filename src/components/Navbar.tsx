import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { WayAILogo } from './WayAILogo';
import {
  Sparkles,
  MessageSquare,
  FileText,
  Wrench,
  CreditCard,
  ShieldCheck,
  Moon,
  Sun,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  HelpCircle,
  Zap,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    currentView,
    setCurrentView,
    darkMode,
    setDarkMode,
    setActiveAuthModal,
    setActivePlanModal,
    logout,
  } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isSuperAdmin =
    user?.role === 'super_admin' ||
    user?.email.toLowerCase() === 'cristianonumerique@gmail.com' ||
    user?.email.toLowerCase() === 'kristianmacamo@gmail.com';

  const navItems = [
    { id: 'dashboard', label: 'Painel', icon: Sparkles, authRequired: true },
    { id: 'chat', label: 'Chat IA', icon: MessageSquare },
    { id: 'documents', label: 'Gerar Trabalho', icon: FileText },
    { id: 'tools', label: 'Ferramentas', icon: Wrench },
    { id: 'plans', label: 'Planos & M-Pesa', icon: CreditCard },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {/* Brand Logo */}
            <WayAILogo
              variant="navbar"
              onClick={() => {
                setCurrentView(user ? 'dashboard' : 'landing');
                setMobileMenuOpen(false);
              }}
              className="group"
            />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              if (item.authRequired && !user) return null;
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    if (item.id === 'plans') {
                      setActivePlanModal(true);
                    } else {
                      setCurrentView(item.id as any);
                    }
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}

            {/* Admin Panel button if Super Admin */}
            {isSuperAdmin && (
              <button
                id="nav-link-admin"
                onClick={() => setCurrentView('admin')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  currentView === 'admin'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:hover:bg-amber-900 border border-amber-400/40'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Super Admin
              </button>
            )}
          </nav>

          {/* Actions & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={darkMode ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
              id="theme-toggle-btn"
            >
              {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 transition-all text-left"
                  id="user-profile-menu-button"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-[120px]">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                      {user.role === 'super_admin' ? 'Super Admin' : user.planId ? 'Plano Activo' : 'Grátis'}
                    </p>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-lg">
                        <span>Uso Diário:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {user.dailyUsageCount} / {user.maxDailyQuota}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setCurrentView('profile');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        Meu Perfil Académico
                      </button>

                      <button
                        onClick={() => {
                          setActivePlanModal(true);
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Zap className="w-4 h-4 text-emerald-500" />
                        Planos & Pagamentos M-Pesa
                      </button>

                      {isSuperAdmin && (
                        <button
                          onClick={() => {
                            setCurrentView('admin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 font-semibold transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Painel Super Admin
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setCurrentView('help');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <HelpCircle className="w-4 h-4 text-slate-400" />
                        Ajuda e Suporte MZ
                      </button>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Terminar Sessão
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveAuthModal('login')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  id="navbar-login-btn"
                >
                  Iniciar Sessão
                </button>
                <button
                  onClick={() => setActiveAuthModal('register')}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-102"
                  id="navbar-register-btn"
                >
                  Criar Conta
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              id="mobile-menu-toggle"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-2 pb-6 space-y-1">
          {navItems.map((item) => {
            if (item.authRequired && !user) return null;
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'plans') {
                    setActivePlanModal(true);
                  } else {
                    setCurrentView(item.id as any);
                  }
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                {item.label}
              </button>
            );
          })}

          {isSuperAdmin && (
            <button
              onClick={() => {
                setCurrentView('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40"
            >
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              Painel Super Admin
            </button>
          )}

          <button
            onClick={() => {
              setCurrentView('help');
              setMobileMenuOpen(false);
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200"
          >
            <HelpCircle className="w-5 h-5 text-slate-400" />
            Ajuda e Suporte
          </button>
        </div>
      )}
    </header>
  );
};
