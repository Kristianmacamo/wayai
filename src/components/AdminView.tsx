import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { AdminStats, User, Transaction, PlanConfig } from '../types';
import {
  ShieldCheck,
  Users,
  MessageSquare,
  CreditCard,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Search,
  Lock,
  Unlock,
  Settings,
  Bell,
  RefreshCw,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const { user, showToast } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [transactionsList, setTransactionsList] = useState<Transaction[]>([]);
  const [plansConfig, setPlansConfig] = useState<PlanConfig[]>([]);
  const [systemAlert, setSystemAlert] = useState('Serviço operacional e sem interrupções em Moçambique.');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'payments' | 'plans' | 'gemini'>('overview');
  const [userSearch, setUserSearch] = useState('');

  const isSuperAdmin =
    user?.role === 'super_admin' ||
    user?.role === 'admin' ||
    user?.email.toLowerCase() === 'kristianmacamo@gmail.com' ||
    user?.email.toLowerCase() === 'cristianonumerique@gmail.com';

  useEffect(() => {
    if (!user || !isSuperAdmin) return;
    loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getAdminStats(user.id);
      setStats(data.stats);
      setUsersList(data.users || []);
      setTransactionsList(data.transactions || []);
      setPlansConfig(data.plans || []);
    } catch (e: any) {
      showToast(e.message || 'Erro ao carregar dados de administração.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUserPlan = async (targetUserId: string, planId: string) => {
    if (!user) return;
    try {
      await api.updateAdminUser(user.id, targetUserId, { planId });
      showToast('Plano de utilizador actualizado!', 'success');
      loadAdminData();
    } catch (e: any) {
      showToast(e.message || 'Erro ao actualizar.', 'error');
    }
  };

  const handleUpdateUserQuota = async (targetUserId: string, maxDailyQuota: number) => {
    if (!user) return;
    try {
      await api.updateAdminUser(user.id, targetUserId, { maxDailyQuota });
      showToast('Limite diário actualizado!', 'success');
      loadAdminData();
    } catch (e: any) {
      showToast(e.message || 'Erro ao actualizar quota.', 'error');
    }
  };

  const handleToggleUserBlock = async (targetUserId: string, currentRole: string) => {
    if (!user) return;
    const newRole = currentRole === 'blocked' ? 'student' : 'blocked';
    try {
      await api.updateAdminUser(user.id, targetUserId, { role: newRole as any });
      showToast(`Estado de utilizador alterado para ${newRole}.`, 'info');
      loadAdminData();
    } catch (e: any) {
      showToast(e.message || 'Erro ao alterar estado.', 'error');
    }
  };

  const handleSavePlanPrice = async (planId: string, newPrice: number) => {
    if (!user) return;
    try {
      await api.updatePlanConfig(user.id, planId, { price: newPrice });
      showToast('Preço do plano actualizado com sucesso!', 'success');
      loadAdminData();
    } catch (e: any) {
      showToast(e.message || 'Erro ao actualizar preço.', 'error');
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-xl font-bold text-rose-900 dark:text-rose-200">Acesso Restrito ao Super Administrador</h2>
        <p className="text-xs text-rose-700 dark:text-rose-300">
          Esta secção é reservada exclusivamente para a administração do Way Estudantes AI (<strong>cristianonumerique@gmail.com</strong>).
        </p>
      </div>
    );
  }

  const filteredUsers = usersList.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.institution.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-xs font-bold mb-2 border border-amber-300/40">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Super Administrador: cristianonumerique@gmail.com 🇲🇿</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Painel Central de Controlo do Way AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gestão integral de utilizadores moçambicanos, faturação M-Pesa/e-Mola e monitorização do modelo Gemini.
          </p>
        </div>

        <button
          onClick={loadAdminData}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors self-start"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar Dados</span>
        </button>
      </div>

      {/* Tabs Selector */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { id: 'overview', label: 'Visão Geral & Métricas', icon: Activity },
          { id: 'users', label: 'Gestão de Estudantes', icon: Users },
          { id: 'payments', label: 'Faturação & M-Pesa / e-Mola', icon: CreditCard },
          { id: 'plans', label: 'Tabela de Preços (MT)', icon: Zap },
          { id: 'gemini', label: 'Monitor Gemini 3', icon: ShieldCheck },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-6">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">Total de Estudantes</span>
                <Users className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalUsers}</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">UEM, UP, USTM e mais</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">Planos Activos</span>
                <Zap className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.activeSubscribers}</p>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Subscrições pagas válidas</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">Comissão Plataforma (10%)</span>
                <CreditCard className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {(stats.totalCommissionMT ?? Math.round(stats.totalRevenueMT * 0.10 * 10) / 10).toLocaleString()} MT
              </p>
              <p className="text-[11px] text-slate-400">Comissão de 10% retida</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold">Faturação Total Bruta</span>
                <CreditCard className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {stats.totalRevenueMT.toLocaleString()} MT
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                Líquido: {(stats.totalNetRevenueMT ?? Math.round(stats.totalRevenueMT * 0.90 * 10) / 10).toLocaleString()} MT
              </p>
            </div>
          </div>

          {/* System Notification Broadcast */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Aviso Global para Estudantes</span>
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={systemAlert}
                onChange={(e) => setSystemAlert(e.target.value)}
                className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
              <button
                onClick={() => showToast('Aviso global transmitido a todos os utilizadores!', 'success')}
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Publicar Alerta
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Users Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Pesquisar por nome, email ou faculdade..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <span className="text-xs text-slate-400">{filteredUsers.length} estudantes encontrados</span>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5">Estudante</th>
                    <th className="p-3.5">Instituição / Curso</th>
                    <th className="p-3.5">Plano Actual</th>
                    <th className="p-3.5">Uso / Limite Diário</th>
                    <th className="p-3.5 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400">{u.phone}</p>
                      </td>
                      <td className="p-3.5">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{u.institution}</p>
                        <p className="text-[11px] text-slate-400">{u.course} ({u.academicLevel})</p>
                      </td>
                      <td className="p-3.5">
                        <select
                          value={u.planId || ''}
                          onChange={(e) => handleUpdateUserPlan(u.id, e.target.value)}
                          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold"
                        >
                          <option value="">Plano Grátis</option>
                          <option value="plan-diario">Plano Diário</option>
                          <option value="plan-semanal">Plano Semanal</option>
                          <option value="plan-mensal">Plano Mensal</option>
                        </select>
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">{u.dailyUsageCount} /</span>
                          <input
                            type="number"
                            defaultValue={u.maxDailyQuota}
                            onBlur={(e) => handleUpdateUserQuota(u.id, parseInt(e.target.value, 10))}
                            className="w-16 p-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                          />
                        </div>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleToggleUserBlock(u.id, u.role)}
                          className={`p-1.5 rounded-lg text-xs font-bold ${
                            u.role === 'blocked'
                              ? 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                          }`}
                          title={u.role === 'blocked' ? 'Desbloquear estudante' : 'Bloquear acesso'}
                        >
                          {u.role === 'blocked' ? <Lock className="w-3.5 h-3.5 inline" /> : <Unlock className="w-3.5 h-3.5 inline" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Payments Management */}
      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* M-Pesa Integration Status & Sandbox Tester */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-sm font-black text-white">
                    Vodacom M-Pesa Mozambique (C2B SingleStage IPG)
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Host: <code className="text-amber-400">api.sandbox.vm.co.mz:18352</code> | Shortcode:{' '}
                  <code className="text-emerald-400">171717</code> | Autenticação RSA Bearer Token
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                API Handler Online & Activo
              </span>
            </div>

            {/* Test Simulation Controls */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Simulador de Cenários da API M-Pesa (Teste de Actualização de Subscrição)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await api.simulateMpesaScenario({
                        scenario: 'success',
                        phoneNumber: '258844772002',
                        amount: 65,
                        planId: 'plan-diario',
                        userId: user?.id,
                      });
                      showToast('Simulação INS-0 executada: Subscrição activada com sucesso!', 'success');
                      loadAdminData();
                    } catch (e: any) {
                      showToast(e.message || 'Erro na simulação.', 'error');
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  🟢 INS-0: Sucesso (Activar Plano)
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await api.simulateMpesaScenario({
                        scenario: 'insufficient_funds',
                        phoneNumber: '258844779999',
                        amount: 195,
                        planId: 'plan-semanal',
                        userId: user?.id,
                      });
                      showToast('Simulação INS-2006: Saldo Insuficiente M-Pesa registada.', 'error');
                      loadAdminData();
                    } catch (e: any) {
                      showToast(e.message || 'Erro na simulação.', 'error');
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  🔴 INS-2006: Saldo Insuficiente
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await api.simulateMpesaScenario({
                        scenario: 'user_cancelled',
                        phoneNumber: '258844770000',
                        amount: 650,
                        planId: 'plan-mensal',
                        userId: user?.id,
                      });
                      showToast('Simulação INS-2051: Cancelado pelo utilizador no telemóvel.', 'info');
                      loadAdminData();
                    } catch (e: any) {
                      showToast(e.message || 'Erro na simulação.', 'error');
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  🟡 INS-2051: Rejeitado no PIN
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await api.simulateMpesaScenario({
                        scenario: 'timeout',
                        phoneNumber: '258844778888',
                        amount: 65,
                        planId: 'plan-diario',
                        userId: user?.id,
                      });
                      showToast('Simulação INS-9: Timeout de resposta excedido.', 'info');
                      loadAdminData();
                    } catch (e: any) {
                      showToast(e.message || 'Erro na simulação.', 'error');
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  ⏱️ INS-9: Timeout de Rede
                </button>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Registo Global de Transações M-Pesa & e-Mola
          </h3>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3.5">Referência / M-Pesa ID</th>
                  <th className="p-3.5">Estudante</th>
                  <th className="p-3.5">Plano</th>
                  <th className="p-3.5">Método / Telefone</th>
                  <th className="p-3.5">Valor Bruto</th>
                  <th className="p-3.5">Comissão (10%)</th>
                  <th className="p-3.5">Valor Líquido</th>
                  <th className="p-3.5">Data</th>
                  <th className="p-3.5">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactionsList.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {tx.mpesaTransactionId || tx.referenceCode || tx.reference}
                      {tx.responseCode && (
                        <span className="block text-[10px] text-slate-400 font-normal">
                          Código: {tx.responseCode}
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-medium text-slate-900 dark:text-white">{tx.userName}</td>
                    <td className="p-3.5 uppercase">{tx.planId}</td>
                    <td className="p-3.5 font-medium">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tx.paymentMethod === 'mpesa' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                        {tx.paymentMethod.toUpperCase()}
                      </span>{' '}
                      {tx.phoneNumber}
                    </td>
                    <td className="p-3.5 font-black text-slate-900 dark:text-white">{tx.amountMT || tx.amount} MT</td>
                    <td className="p-3.5 font-bold text-amber-600 dark:text-amber-400">
                      {tx.commissionMT || Math.round((tx.amountMT || tx.amount || 0) * 0.10 * 10) / 10} MT
                    </td>
                    <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400">
                      {tx.netAmountMT || Math.round((tx.amountMT || tx.amount || 0) * 0.90 * 10) / 10} MT
                    </td>
                    <td className="p-3.5 text-slate-400">{new Date(tx.createdAt).toLocaleString('pt-MZ')}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        tx.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tx.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {tx.status === 'completed' ? 'Concluído' : tx.status === 'pending' ? 'Pendente' : 'Falhado'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Plans Pricing */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Configuração de Preços e Limites de Quota dos Planos (Moçambique)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {plansConfig.map((p) => (
              <div key={p.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{p.name}</h4>
                <p className="text-xs text-slate-400">Duração: {p.durationDays} dias</p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Preço em Meticais (MT):
                  </label>
                  <input
                    type="number"
                    defaultValue={p.price}
                    onBlur={(e) => handleSavePlanPrice(p.id, parseFloat(e.target.value))}
                    className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold"
                  />
                </div>

                <div className="pt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Activo para M-Pesa & e-Mola</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Gemini Monitor */}
      {activeTab === 'gemini' && stats && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span>Estado da Infraestrutura de IA Gemini</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-400">Modelo Activo</p>
              <p className="text-base font-black text-slate-900 dark:text-white">{stats.geminiModel}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-400">Estado de Conectividade</p>
              <p className="text-base font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{stats.geminiHealth}</span>
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-400">Latência Média</p>
              <p className="text-base font-black text-slate-900 dark:text-white">{stats.geminiLatencyMs} ms</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
