import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Plan, PaymentTransaction } from '../types';
import { api } from '../services/api';

export type AppView =
  | 'landing'
  | 'dashboard'
  | 'chat'
  | 'documents'
  | 'tools'
  | 'plans'
  | 'profile'
  | 'admin'
  | 'help'
  | 'terms'
  | 'privacy';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AuthContextType {
  user: User | null;
  currentView: AppView;
  darkMode: boolean;
  selectedConversationId: string | null;
  activePlanModal: boolean;
  activeAuthModal: 'login' | 'register' | 'verify' | 'forgot' | null;
  pendingVerificationEmail: string | null;
  pendingVerificationName: string | null;
  toasts: Toast[];
  setCurrentView: (view: AppView) => void;
  setSelectedConversationId: (id: string | null) => void;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  setActivePlanModal: (open: boolean) => void;
  setActiveAuthModal: (modal: 'login' | 'register' | 'verify' | 'forgot' | null) => void;
  setPendingVerificationEmail: (email: string | null, name?: string | null) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  login: (email: string, pass: string) => Promise<void>;
  loginAsDemo?: (type: 'student' | 'admin') => Promise<void>;
  register: (data: any) => Promise<void>;
  completeVerification: (code: string) => Promise<void>;
  resendPendingCode: () => Promise<void>;
  cancelPendingVerification: () => void;
  sendVerificationCode: (email: string, type?: 'register' | 'reset', name?: string) => Promise<{ success: boolean; message: string; devCode?: string }>;
  verifyCode: (email: string, code: string, type?: 'register' | 'reset') => Promise<{ valid: boolean; message: string }>;
  resetPassword: (email: string, code: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateUserProfile: (data: Partial<User> & { password?: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('way_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    const saved = localStorage.getItem('way_user');
    return saved ? 'dashboard' : 'landing';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('way_dark_mode');
    return saved ? saved === 'true' : false;
  });

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [activePlanModal, setActivePlanModal] = useState<boolean>(false);
  const [activeAuthModal, setActiveAuthModal] = useState<'login' | 'register' | 'verify' | 'forgot' | null>(() => {
    const savedPending = localStorage.getItem('way_pending_email');
    return savedPending ? 'verify' : null;
  });

  const [pendingVerificationEmail, setPendingEmailState] = useState<string | null>(() => {
    return localStorage.getItem('way_pending_email');
  });

  const [pendingVerificationName, setPendingNameState] = useState<string | null>(() => {
    return localStorage.getItem('way_pending_name');
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  const setPendingVerificationEmail = (email: string | null, name?: string | null) => {
    setPendingEmailState(email);
    if (email) {
      localStorage.setItem('way_pending_email', email);
    } else {
      localStorage.removeItem('way_pending_email');
    }

    if (name) {
      setPendingNameState(name);
      localStorage.setItem('way_pending_name', name);
    } else if (email === null) {
      setPendingNameState(null);
      localStorage.removeItem('way_pending_name');
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('way_dark_mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('way_dark_mode', 'false');
    }
  }, [darkMode]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('way_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('way_user');
    }
  }, [user]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = 'toast-' + Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const login = async (email: string, pass: string) => {
    try {
      const res = await api.login(email, pass);
      if (res.pendingVerification && res.email) {
        setPendingVerificationEmail(res.email, res.name);
        setActiveAuthModal('verify');
        showToast(res.message || 'A tua conta aguarda validação do código de 6 dígitos.', 'info');
        return;
      }
      if (res.user) {
        setUser(res.user);
        setPendingVerificationEmail(null);
        setActiveAuthModal(null);
        setCurrentView('dashboard');
        showToast(`Bem-vindo(a) de volta, ${res.user.name.split(' ')[0]}!`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Erro ao entrar.', 'error');
      throw err;
    }
  };

  const loginAsDemo = async (type: 'student' | 'admin') => {
    if (type === 'admin') {
      await login('cristianonumerique@gmail.com', 'admin123');
    } else {
      await login('helena.estudante@uem.mz', 'estudante123');
    }
  };

  const register = async (data: any) => {
    try {
      const res = await api.register(data);
      if (res.pendingVerification && res.email) {
        setPendingVerificationEmail(res.email, data.name || res.name);
        setActiveAuthModal('verify');
        showToast(
          res.message || `Código de 6 dígitos enviado para ${res.email}. Valida o teu e-mail para ter acesso total.`,
          'info'
        );
        return;
      }

      if (res.user) {
        setUser(res.user);
        setPendingVerificationEmail(null);
        setActiveAuthModal(null);
        setCurrentView('dashboard');
        showToast(`Conta criada com sucesso! Bem-vindo(a) ao Way Estudantes AI.`, 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Erro ao criar conta.', 'error');
      throw err;
    }
  };

  const completeVerification = async (code: string) => {
    if (!pendingVerificationEmail) {
      showToast('Nenhum e-mail pendente de validação encontrado.', 'error');
      return;
    }

    try {
      const res = await api.verifyRegistrationCode(pendingVerificationEmail, code);
      if (res.user) {
        setUser(res.user);
        setPendingVerificationEmail(null);
        setActiveAuthModal(null);
        setCurrentView('dashboard');
        showToast('Conta validada com sucesso! Bem-vindo(a) à plataforma.', 'success');
      }
    } catch (err: any) {
      showToast(err.message || 'Código de verificação incorrecto ou expirado.', 'error');
      throw err;
    }
  };

  const resendPendingCode = async () => {
    if (!pendingVerificationEmail) {
      showToast('Nenhum e-mail pendente definido.', 'error');
      return;
    }

    try {
      const res = await api.resendVerificationCode(pendingVerificationEmail, 'register', pendingVerificationName || undefined);
      showToast(res.message || 'Novo código de 6 dígitos enviado para a tua caixa de e-mail.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Erro ao reenviar código.', 'error');
      throw err;
    }
  };

  const cancelPendingVerification = () => {
    setPendingVerificationEmail(null);
    setActiveAuthModal('register');
  };

  const sendVerificationCode = async (email: string, type: 'register' | 'reset' = 'register', name?: string) => {
    try {
      const res = await api.sendVerificationCode(email, type, name);
      return res;
    } catch (err: any) {
      showToast(err.message || 'Erro ao enviar código.', 'error');
      throw err;
    }
  };

  const verifyCode = async (email: string, code: string, type: 'register' | 'reset' = 'register') => {
    try {
      const res = await api.verifyCode(email, code, type);
      return res;
    } catch (err: any) {
      showToast(err.message || 'Código incorrecto ou expirado.', 'error');
      throw err;
    }
  };

  const resetPassword = async (email: string, code: string, newPass: string) => {
    try {
      const res = await api.resetPassword(email, code, newPass);
      showToast('Palavra-passe alterada com sucesso! Podes agora entrar.', 'success');
      return res;
    } catch (err: any) {
      showToast(err.message || 'Erro ao redefinir a palavra-passe.', 'error');
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setPendingVerificationEmail(null);
    setCurrentView('landing');
    setSelectedConversationId(null);
    showToast('Sessão terminada com segurança.', 'info');
  };

  const updateUserProfile = async (data: Partial<User> & { password?: string }) => {
    if (!user) return;
    try {
      const res = await api.updateProfile(user.id, data);
      setUser(res.user);
      showToast('Perfil guardado com sucesso.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Erro ao actualizar perfil.', 'error');
      throw err;
    }
  };

  const refreshUser = async () => {
    if (!user) return;
    try {
      const res = await api.getMe(user.id);
      if (res.user) {
        setUser(res.user);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        currentView,
        darkMode,
        selectedConversationId,
        activePlanModal,
        activeAuthModal,
        pendingVerificationEmail,
        pendingVerificationName,
        toasts,
        setCurrentView,
        setSelectedConversationId,
        setDarkMode,
        setActivePlanModal,
        setActiveAuthModal,
        setPendingVerificationEmail,
        showToast,
        removeToast,
        login,
        loginAsDemo,
        register,
        completeVerification,
        resendPendingCode,
        cancelPendingVerification,
        sendVerificationCode,
        verifyCode,
        resetPassword,
        logout,
        updateUserProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
