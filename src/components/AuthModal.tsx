import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { WayAILogo } from './WayAILogo';
import {
  X,
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Clock,
  GraduationCap,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    activeAuthModal,
    setActiveAuthModal,
    pendingVerificationEmail,
    pendingVerificationName,
    login,
    register,
    completeVerification,
    resendPendingCode,
    cancelPendingVerification,
    sendVerificationCode,
    verifyCode,
    resetPassword,
    showToast,
  } = useAuth();

  // Mode: 'login' | 'register' | 'verify' | 'forgot' | 'forgot_verify'
  const [mode, setMode] = useState<'login' | 'register' | 'verify' | 'forgot' | 'forgot_verify'>('login');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+258 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [institution, setInstitution] = useState('Universidade Eduardo Mondlane (UEM)');
  const [course, setCourse] = useState('');
  const [academicLevel, setAcademicLevel] = useState('Licenciatura');

  // 6-digit PIN boxes state
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const digitInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [resendCooldown, setResendCooldown] = useState(0);
  const [devCodeHint, setDevCodeHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Sync mode with activeAuthModal & pendingVerificationEmail
  useEffect(() => {
    if (activeAuthModal) {
      if (activeAuthModal === 'verify') {
        setMode('verify');
        if (pendingVerificationEmail && !email) {
          setEmail(pendingVerificationEmail);
        }
      } else {
        setMode(activeAuthModal);
      }
      setDigits(['', '', '', '', '', '']);
      setDevCodeHint(null);
    }
  }, [activeAuthModal, pendingVerificationEmail]);

  // Resend cooldown timer countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  if (!activeAuthModal) return null;

  const currentVerificationCode = digits.join('');

  // Handle single digit input
  const handleDigitChange = (index: number, value: string) => {
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      const newDigits = [...digits];
      newDigits[index] = '';
      setDigits(newDigits);
      return;
    }

    if (cleanVal.length > 1) {
      // Pasted multi-digit
      const pasted = cleanVal.slice(0, 6).split('');
      const newDigits = [...digits];
      pasted.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setDigits(newDigits);
      const nextFocus = Math.min(pasted.length, 5);
      digitInputRefs.current[nextFocus]?.focus();
      return;
    }

    const newDigits = [...digits];
    newDigits[index] = cleanVal;
    setDigits(newDigits);

    // Auto-focus next input
    if (index < 5 && cleanVal) {
      digitInputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      digitInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      digitInputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;
    const newDigits = [...digits];
    pasteData.split('').forEach((char, i) => {
      if (i < 6) newDigits[i] = char;
    });
    setDigits(newDigits);
    const nextFocus = Math.min(pasteData.length, 5);
    digitInputRefs.current[nextFocus]?.focus();
  };

  // 1. Handle Registration: Create account & trigger 6-digit email
  const handleStartRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      showToast('Por favor preenche todos os campos obrigatórios.', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('A palavra-passe deve ter no mínimo 6 caracteres.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('As palavras-passe não coincidem.', 'error');
      return;
    }

    setLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        course: course.trim() || 'Ensino Geral',
        institution,
        academicLevel,
      });
      setResendCooldown(60);
      setDigits(['', '', '', '', '', '']);
    } catch (err: any) {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Verification of 6-digit OTP to unlock full access
  const handleCompleteRegisterVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('').trim();
    if (code.length < 6) {
      showToast('Por favor insere o código de 6 dígitos completo.', 'error');
      return;
    }

    setLoading(true);
    try {
      await completeVerification(code);
    } catch (err: any) {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      showToast('Preenche o teu e-mail e palavra-passe.', 'error');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Forgot Password: Step 1 -> Request Recovery Code
  const handleStartForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      showToast('Insere o teu endereço de e-mail.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await sendVerificationCode(email.trim(), 'reset');
      if (res.devCode) {
        setDevCodeHint(res.devCode);
      }
      setResendCooldown(60);
      setDigits(['', '', '', '', '', '']);
      setMode('forgot_verify');
      showToast(`Código de recuperação enviado para ${email}.`, 'success');
    } catch (err: any) {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  // 5. Handle Forgot Password: Step 2 -> Reset Password with OTP
  const handleCompleteForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('').trim();
    if (code.length < 6) {
      showToast('Insere o código de 6 dígitos enviado por e-mail.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('A nova palavra-passe deve ter no mínimo 6 caracteres.', 'error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showToast('As palavras-passe não coincidem.', 'error');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim(), code, newPassword);
      setPassword('');
      setConfirmPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setDigits(['', '', '', '', '', '']);
      setDevCodeHint(null);
      setMode('login');
    } catch (err: any) {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  // Resend code handler for registration or reset
  const handleResendCode = async () => {
    if (resendCooldown > 0 || loading) return;
    setLoading(true);
    try {
      if (mode === 'verify') {
        await resendPendingCode();
        setResendCooldown(60);
      } else {
        const res = await sendVerificationCode(email, 'reset');
        if (res.devCode) {
          setDevCodeHint(res.devCode);
        }
        setResendCooldown(60);
        showToast(`Novo código de recuperação enviado para ${email}!`, 'success');
      }
    } catch (err: any) {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  const targetEmail = pendingVerificationEmail || email;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={() => setActiveAuthModal(null)}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          id="auth-modal-close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="mb-3">
            <WayAILogo variant="badge" size="lg" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            {mode === 'login' && 'Iniciar Sessão'}
            {mode === 'register' && 'Criar Conta de Estudante'}
            {mode === 'verify' && 'Validar Conta de Estudante'}
            {mode === 'forgot' && 'Recuperar Palavra-passe'}
            {mode === 'forgot_verify' && 'Redefinir Palavra-passe'}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs leading-relaxed">
            {mode === 'login' && 'Acede à tua conta de estudos no Way Estudantes AI.'}
            {mode === 'register' && 'Regista-te para desbloquear o assistente de IA acadêmica.'}
            {mode === 'verify' && `Insere o código de 6 dígitos enviado para ${targetEmail}`}
            {mode === 'forgot' && 'Introduz o teu e-mail para receberes o código de recuperação.'}
            {mode === 'forgot_verify' && `Insere o código de verificação enviado para ${targetEmail}`}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* MODE 1: LOGIN */}
        {/* ========================================================================= */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4" id="login-form">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Endereço de E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="exemplo@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Palavra-passe
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setDigits(['', '', '', '', '', '']);
                    setDevCodeHint(null);
                    setMode('forgot');
                  }}
                  className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Esqueceste a senha?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              id="auth-submit-btn"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar na Conta</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
              <p>
                Ainda não tens conta?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setDigits(['', '', '', '', '', '']);
                    setDevCodeHint(null);
                    setMode('register');
                  }}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Criar conta de estudante
                </button>
              </p>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: REGISTER FORM */}
        {/* ========================================================================= */}
        {mode === 'register' && (
          <form onSubmit={handleStartRegister} className="space-y-3.5" id="register-form">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nome Completo <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Alberto Mondlane"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Endereço de E-mail (Gmail / Institucional) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="exemplo@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Enviaremos um código de 6 dígitos para validar a tua conta.</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Telefone (Moçambique)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="+258 84 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Instituição
                </label>
                <select
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Universidade Eduardo Mondlane (UEM)">UEM</option>
                  <option value="Universidade Pedagógica de Maputo (UP)">UP</option>
                  <option value="Universidade São Tomás de Moçambique (USTM)">USTM</option>
                  <option value="UniZambeze">UniZambeze</option>
                  <option value="UniLúrio">UniLúrio</option>
                  <option value="ISCTEM">ISCTEM</option>
                  <option value="Universidade A Politécnica">A Politécnica</option>
                  <option value="ISUTC">ISUTC</option>
                  <option value="Ensino Secundário Geral (ESG)">Ensino Secundário</option>
                  <option value="Instituto Técnico-Profissional">Técnico / IFP</option>
                  <option value="Outra Instituição">Outra</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Curso / Área
                </label>
                <input
                  type="text"
                  placeholder="Ex: Economia / Direito"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Palavra-passe (mínimo 6 caracteres) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirmar Palavra-passe <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              id="auth-register-btn"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Criar Conta & Receber Código</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
              <p>
                Já possuis uma conta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Iniciar sessão
                </button>
              </p>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* MODE 3: VERIFICATION STATE (6-DIGIT OTP PENDING VALIDATION) */}
        {/* ========================================================================= */}
        {mode === 'verify' && (
          <form onSubmit={handleCompleteRegisterVerification} className="space-y-4" id="register-verify-form">
            {/* Status Alert Banner */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-center">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-2">
                <Clock className="w-3 h-3 animate-spin" />
                <span>Código Enviado via WhatsApp & E-mail</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Enviámos o código de segurança de 6 dígitos para o teu telemóvel e e-mail:
              </p>
              <p className="text-xs font-black text-emerald-700 dark:text-emerald-400 break-all mt-0.5 font-mono">
                {targetEmail}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                ⏱ <strong>Validade:</strong> 5 minutos. A validação é processada com segurança exclusivamente pelo nosso servidor.
              </p>
            </div>

            {/* 6 Digit PIN Boxes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 text-center">
                Insere o Código de 6 Dígitos
              </label>
              <div className="flex items-center justify-center gap-2" onPaste={handlePaste}>
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      digitInputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-11 h-12 text-center text-xl font-bold font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-xs"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || currentVerificationCode.length < 6}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              id="auth-verify-submit-btn"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Validar Código & Desbloquear Acesso</span>
                </>
              )}
            </button>

            {/* Resend and change email actions */}
            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={cancelPendingVerification}
                className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Trocar e-mail</span>
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || loading}
                className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50 disabled:no-underline"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>
                  {resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : 'Reenviar código'}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* MODE 4: FORGOT PASSWORD (STEP 1 - REQUEST OTP) */}
        {/* ========================================================================= */}
        {mode === 'forgot' && (
          <form onSubmit={handleStartForgotPassword} className="space-y-4" id="forgot-form">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Endereço de E-mail Registado
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="exemplo@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Enviaremos um código de 6 dígitos para recuperar a tua conta.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              id="auth-forgot-submit-btn"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Enviar Código de Recuperação</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="flex items-center justify-center gap-1 mx-auto font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao início de sessão</span>
              </button>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* MODE 5: FORGOT VERIFY (STEP 2 - ENTER OTP & NEW PASSWORD) */}
        {/* ========================================================================= */}
        {mode === 'forgot_verify' && (
          <form onSubmit={handleCompleteForgotPassword} className="space-y-3.5" id="forgot-verify-form">
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/20 text-center">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                Código de recuperação enviado para:
              </p>
              <p className="text-xs font-bold text-amber-700 dark:text-amber-400 break-all mt-0.5 font-mono">
                {email}
              </p>
            </div>

            {devCodeHint && (
              <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 text-amber-900 dark:text-amber-300 text-xs flex items-center justify-between">
                <span>Código gerado: <strong className="tracking-widest font-mono text-sm">{devCodeHint}</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    const parts = devCodeHint.slice(0, 6).split('');
                    setDigits(parts);
                  }}
                  className="text-[10px] font-bold px-2 py-0.5 bg-amber-200 dark:bg-amber-800 rounded text-amber-900 dark:text-amber-100 hover:bg-amber-300"
                >
                  Preencher
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 text-center">
                Código de 6 Dígitos <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center justify-center gap-2" onPaste={handlePaste}>
                {digits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      digitInputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleDigitChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-11 h-12 text-center text-xl font-bold font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all shadow-xs"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nova Palavra-passe <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirmar Nova Palavra-passe <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || currentVerificationCode.length < 6}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              id="auth-reset-submit-btn"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Redefinir Palavra-passe e Entrar</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-between text-xs pt-2">
              <button
                type="button"
                onClick={() => setMode('forgot')}
                className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Alterar e-mail</span>
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || loading}
                className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50 disabled:no-underline"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>
                  {resendCooldown > 0 ? `Reenviar em ${resendCooldown}s` : 'Reenviar código'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
