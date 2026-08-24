import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, BookOpen, FileText, ArrowLeft } from 'lucide-react';

export const TermsPrivacyView: React.FC<{ type: 'terms' | 'privacy' }> = ({ type }) => {
  const { setCurrentView } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <button
        onClick={() => setCurrentView('landing')}
        className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar à página inicial</span>
      </button>

      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-slate-800 dark:text-slate-200">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            {type === 'terms' ? <FileText className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              {type === 'terms' ? 'Termos e Condições de Utilização' : 'Política de Privacidade e Protecção de Dados'}
            </h1>
            <p className="text-xs text-slate-400">Way Estudantes AI • República de Moçambique</p>
          </div>
        </div>

        {type === 'terms' ? (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-950 dark:text-white">1. Objecto e Âmbito</h2>
              <p>
                A plataforma <strong>Way Estudantes AI</strong> foi concebida como uma ferramenta pedagógica e auxiliar de estudos, orientada para os estudantes do ensino primário, secundário, técnico-profissional e superior em Moçambique.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-950 dark:text-white">2. Ética Académica e Responsabilidade do Estudante</h2>
              <p>
                O Way Estudantes AI visa fornecer explicações, roteiros de pesquisa, resolução didática de exercícios e apoio na estruturação metodológica (Normas UEM, UP e APA 7ª). É da inteira responsabilidade do estudante fazer a leitura crítica, validação de fontes e personalização dos trabalhos. O plágio e a fraude académica são expressamente desaconselhados.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-950 dark:text-white">3. Planos e Pagamentos Móveis (M-Pesa e e-Mola)</h2>
              <p>
                Os pagamentos efetuados através de M-Pesa (Vodacom) e e-Mola (Movitel) em Meticais (MT) garantem o acesso ao serviço pelo período subscrito (Diário 24h, Semanal 7 dias, Mensal 30 dias). Não existem renovações automáticas involuntárias; o utilizador tem controlo total sobre quando deseja recarregar.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-950 dark:text-white">4. Disponibilidade do Serviço</h2>
              <p>
                Empregamos todos os esforços para manter a plataforma online 24/7 com alta velocidade através da tecnologia Google Gemini 3. Manutenções programadas serão comunicadas previamente no painel de avisos.
              </p>
            </section>
          </div>
        ) : (
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-950 dark:text-white">1. Protecção da Privacidade do Estudante</h2>
              <p>
                Respeitamos a privacidade e a segurança dos dados de todos os estudantes e docentes moçambicanos. As tuas conversas, trabalhos gerados e documentos carregados pertencem exclusivamente a ti.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-950 dark:text-white">2. Segurança de Chaves e APIs</h2>
              <p>
                Todas as operações de Inteligência Artificial com o modelo Google Gemini são processadas de forma segura no servidor (backend Express/Node.js). Nenhuma chave de API ou credencial sensível é exposta no navegador do cliente.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-950 dark:text-white">3. Tratamento de Números de Telefone</h2>
              <p>
                Os números de telemóvel fornecidos para pagamento M-Pesa ou e-Mola são utilizados única e exclusivamente para a transação e confirmação de faturação via gateway seguro, nunca sendo partilhados com terceiros para fins comerciais.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-bold text-slate-950 dark:text-white">4. Contacto do Responsável de Privacidade</h2>
              <p>
                Para quaisquer pedidos de esclarecimento ou eliminação de dados, contacta o administrador em: <strong>kristianmacamo@gmail.com</strong>.
              </p>
            </section>
          </div>
        )}
      </div>
    </div>
  );
};
