import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { HelpCircle, Mail, Phone, MessageSquare, Send, CheckCircle2, ChevronDown, Sparkles, Loader2 } from 'lucide-react';

export const HelpSupportView: React.FC = () => {
  const { user, showToast } = useAuth();

  const [faqOpen, setFaqOpen] = useState<number | null>(0);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketPhone, setTicketPhone] = useState('');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const faqs = [
    {
      q: 'Como pagar um plano usando o M-Pesa ou e-Mola?',
      a: 'Acede ao menu "Planos & M-Pesa", escolhe o teu plano pretendido (Diário 65 MT, Semanal 180 MT ou Mensal 300 MT), introduz o teu número de telemóvel da Vodacom ou Movitel e clica em Pagar. Em poucos segundos receberás uma notificação no ecrã para digitares o teu PIN e o teu acesso será activado imediatamente.',
    },
    {
      q: 'O que devo fazer se o pagamento for debitado mas o plano não activar?',
      a: 'Normalmente a confirmação é instantânea. Se houver atraso na rede da operadora, aguarda 1 a 2 minutos e atualiza a página. Se persistir, envia uma mensagem através do formulário abaixo com o teu número e a referência da SMS do M-Pesa/e-Mola para resolução imediata pela equipa do Way AI.',
    },
    {
      q: 'Os trabalhos gerados são aceites pelos professores na UEM e UP?',
      a: 'Sim, o Way Estudantes AI estrutura os trabalhos seguindo rigorosamente as normas de monografias e relatórios exigidas nas universidades de Moçambique, incluindo capa, folha de rosto, índice, metodologia e referências APA 7ª Edição. Recomendamos que uses o conteúdo como base sólida para a tua pesquisa e faças a leitura crítica.',
    },
    {
      q: 'Como posso enviar fotos de testes ou do quadro da sala de aula?',
      a: 'No Chat IA, clica no ícone de clipe/anexo e escolhe a fotografia guardada no teu telemóvel ou computador. Em seguida, escreve a tua dúvida (por exemplo: "Resolve o exercício número 3 passo a passo") e clica em enviar.',
    },
    {
      q: 'Como posso falar diretamente com a administração?',
      a: 'Podes contactar diretamente a administração através do e-mail kristianmacamo@gmail.com ou preenchendo o formulário de suporte ao lado.',
    },
  ];

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) {
      showToast('Por favor, preenche o assunto e a mensagem.', 'error');
      return;
    }
    setIsSending(true);
    try {
      await api.sendSupportEmail({
        name: user?.name || 'Estudante Way AI',
        email: user?.email || 'estudante@wayestudantes.mz',
        phone: ticketPhone || user?.phone || '',
        subject: ticketSubject,
        message: ticketMessage,
      });
      setTicketSubmitted(true);
      showToast('Mensagem enviada com sucesso para o suporte!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Erro ao enviar mensagem.', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Suporte ao Estudante Moçambicano 🇲🇿</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Central de Ajuda e Suporte
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Encontra respostas rápidas para as tuas dúvidas ou envia uma mensagem para a nossa equipa.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left FAQs Column */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Perguntas Frequentes (FAQ)
          </h2>

          <div className="space-y-3">
            {faqs.map((f, i) => {
              const isOpen = faqOpen === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : i)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <span>{f.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Contact Form Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-500" />
              <span>Contactar Suporte Técnico</span>
            </h2>

            {ticketSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  A tua mensagem foi enviada com sucesso!
                </p>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                  A nossa equipa técnica entrará em contacto através do teu e-mail ({user?.email || 'registado'}).
                </p>
                <button
                  onClick={() => {
                    setTicketSubmitted(false);
                    setTicketSubject('');
                    setTicketMessage('');
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
                >
                  Enviar Outra Mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Assunto
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dúvida sobre ativação M-Pesa"
                    value={ticketSubject}
                    onChange={(e) => setTicketSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contacto Telefónico (M-Pesa / e-Mola)
                  </label>
                  <input
                    type="tel"
                    placeholder="Ex: 841234567 / 861234567"
                    value={ticketPhone}
                    onChange={(e) => setTicketPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Descrição Detalhada
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Descreve o teu problema ou dúvida..."
                    value={ticketMessage}
                    onChange={(e) => setTicketMessage(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>A enviar mensagem...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Pedido de Ajuda</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Direct Contacts Info */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500" />
                <span>kristianmacamo@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500" />
                <span>Maputo • Moçambique (+258)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
