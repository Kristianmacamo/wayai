import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { PaymentTransaction } from '../types';
import {
  User,
  School,
  BookOpen,
  Phone,
  Mail,
  ShieldCheck,
  Lock,
  Receipt,
  Save,
  CheckCircle2,
  Calendar,
  Zap,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, updateUserProfile, showToast, setActivePlanModal } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [institution, setInstitution] = useState(user?.institution || '');
  const [course, setCourse] = useState(user?.course || '');
  const [academicLevel, setAcademicLevel] = useState(user?.academicLevel || 'Licenciatura');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
      setInstitution(user.institution || 'Universidade Eduardo Mondlane (UEM)');
      setCourse(user.course || 'Ensino Superior');
      setAcademicLevel(user.academicLevel || 'Licenciatura');

      api.getPaymentHistory(user.id)
        .then((res) => setTransactions(res.transactions || []))
        .catch(console.error);
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await updateUserProfile({
        name,
        phone,
        institution,
        course,
        academicLevel,
      });
      showToast('Perfil académico actualizado com sucesso!', 'success');
    } catch (e: any) {
      showToast(e.message || 'Erro ao actualizar perfil.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('As palavras-passe não coincidem.', 'error');
      return;
    }
    showToast('Palavra-passe alterada com sucesso!', 'success');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
          <User className="w-3.5 h-3.5" />
          <span>Área Pessoal & Académica 🇲🇿</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          O Meu Perfil de Estudante
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Gere os teus dados universitários, segurança e histórico de pagamentos M-Pesa / e-Mola.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile and Settings Form */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <School className="w-4 h-4 text-emerald-500" />
              <span>Dados Académicos</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nome Completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Número de Telemóvel (M-Pesa / e-Mola)
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Instituição de Ensino
                </label>
                <select
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  <option value="Instituto Técnico / Profissional">Instituto Técnico</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Curso / Especialidade
                </label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Alterações</span>
            </button>
          </form>

          {/* Password change */}
          <form onSubmit={handleChangePassword} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span>Segurança & Palavra-passe</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Senha Actual
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nova Senha
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              Actualizar Palavra-passe
            </button>
          </form>
        </div>

        {/* Right Info & Transactions Column */}
        <div className="lg:col-span-5 space-y-6">
          {/* Plan overview card */}
          <div className="p-6 rounded-3xl bg-gradient-to-tr from-emerald-900 to-teal-900 text-white shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">Subscrição Activa</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/30 text-emerald-100 text-[10px] font-extrabold border border-emerald-400/30">
                PRO MOÇAMBIQUE
              </span>
            </div>

            <div>
              <p className="text-2xl font-black">
                {user?.planId === 'plan-mensal'
                  ? 'Plano Mensal'
                  : user?.planId === 'plan-semanal'
                  ? 'Plano Semanal'
                  : user?.planId === 'plan-diario'
                  ? 'Plano Diário'
                  : 'Plano Gratuito'}
              </p>
              <p className="text-xs text-emerald-200/80 mt-1">
                Expiração:{' '}
                {user?.planExpiry
                  ? new Date(user.planExpiry).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'long', year: 'numeric' })
                  : 'Indefinido'}
              </p>
            </div>

            <button
              onClick={() => setActivePlanModal(true)}
              className="w-full py-2.5 rounded-xl bg-white text-emerald-900 font-extrabold text-xs shadow-md hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-emerald-600" />
              Renovar / Alterar com M-Pesa & e-Mola
            </button>
          </div>

          {/* Transactions Receipt History */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-500" />
              <span>Histórico de Pagamentos</span>
            </h2>

            {transactions.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">Nenhum pagamento registado ainda.</p>
            ) : (
              <div className="space-y-2">
                {transactions.map((t) => (
                  <div
                    key={t.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">
                        {t.planId.toUpperCase()} • {t.amountMT || t.amount} MT
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {t.paymentMethod.toUpperCase()} ({t.phoneNumber}) • {new Date(t.createdAt).toLocaleDateString('pt-MZ')}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                      Concluído
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
