import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Conversation, ChatMessage, Attachment } from '../types';
import { MathRenderer } from './MathRenderer';
import { exportToPDF, exportToText } from '../utils/exportUtils';
import { localStorageChatService } from '../services/localStorageChatService';
import { generateLocalMozambicanResponse } from '../utils/localAcademicEngine';
import mammoth from 'mammoth';
import {
  Sparkles,
  Send,
  Square,
  Paperclip,
  Image as ImageIcon,
  FileText,
  FileCode,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Download,
  X,
  BookOpen,
  Camera,
  Bot,
  User as UserIcon,
  Zap,
  Clock,
  ArrowDown,
  FileDown,
  Pin,
  Upload,
  Database,
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const {
    user,
    selectedConversationId,
    setSelectedConversationId,
    showToast,
    setActivePlanModal,
    setActiveAuthModal,
  } = useAuth();

  // State Management
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isExtractingDoc, setIsExtractingDoc] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const importJsonInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load conversations from LocalStorage first, then sync with backend
  useEffect(() => {
    const userId = user?.id;
    // 1. Instant load from LocalStorage
    const stored = localStorageChatService.getStoredConversations(userId);
    setConversations(stored);

    // 2. Restore previously active conversation or default to the most recent
    const savedActiveId = selectedConversationId || localStorageChatService.getActiveConversationId(userId);
    if (savedActiveId) {
      const found = stored.find((c) => c.id === savedActiveId);
      if (found) {
        setActiveConv(found);
        setMessages(found.messages || []);
        setSelectedConversationId(found.id);
      } else if (stored.length > 0) {
        setActiveConv(stored[0]);
        setMessages(stored[0].messages || []);
        setSelectedConversationId(stored[0].id);
      }
    } else if (stored.length > 0) {
      setActiveConv(stored[0]);
      setMessages(stored[0].messages || []);
      setSelectedConversationId(stored[0].id);
    }

    // 3. Background sync with backend if user is authenticated
    if (userId) {
      api.getConversations(userId)
        .then((res) => {
          if (res.conversations && res.conversations.length > 0) {
            // Merge backend conversations into LocalStorage
            for (const serverConv of res.conversations) {
              const localConv = localStorageChatService.getConversationById(userId, serverConv.id);
              if (!localConv || (serverConv.messages && serverConv.messages.length > (localConv.messages?.length || 0))) {
                localStorageChatService.saveConversation(userId, serverConv);
              }
            }
            const updated = localStorageChatService.getStoredConversations(userId);
            setConversations(updated);
          }
        })
        .catch((err) => {
          console.log('Modo offline/local activo para histórico de conversas.');
        });
    }
  }, [user]);

  // Sync selected conversation when changed externally
  useEffect(() => {
    if (selectedConversationId && conversations.length > 0) {
      const found = conversations.find((c) => c.id === selectedConversationId);
      if (found && found.id !== activeConv?.id) {
        setActiveConv(found);
        setMessages(found.messages || []);
        localStorageChatService.setActiveConversationId(user?.id, found.id);
      }
    }
  }, [selectedConversationId, conversations]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [inputMessage]);

  // Create new conversation thread in LocalStorage
  const handleNewConversation = () => {
    const newConv = localStorageChatService.createNewConversation(user?.id);
    const updatedList = localStorageChatService.getStoredConversations(user?.id);
    setConversations(updatedList);
    setActiveConv(newConv);
    setMessages([]);
    setSelectedConversationId(newConv.id);
    setInputMessage('');
    setAttachments([]);

    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Switch between historical conversation sessions
  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversationId(conv.id);
    setActiveConv(conv);
    setMessages(conv.messages || []);
    localStorageChatService.setActiveConversationId(user?.id, conv.id);
  };

  // Delete conversation from LocalStorage and backend
  const handleDeleteConversation = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Tens a certeza que desejas apagar esta sessão do histórico local?')) return;

    localStorageChatService.deleteConversation(user?.id, id);
    const updated = localStorageChatService.getStoredConversations(user?.id);
    setConversations(updated);

    if (activeConv?.id === id || selectedConversationId === id) {
      if (updated.length > 0) {
        handleSelectConversation(updated[0]);
      } else {
        handleNewConversation();
      }
    }

    if (user?.id) {
      api.deleteConversation(id, user.id).catch(() => {});
    }

    showToast('Conversa eliminada do histórico local.', 'info');
  };

  // Toggle Pin Status of a conversation
  const handleTogglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    localStorageChatService.togglePin(user?.id, id);
    const updated = localStorageChatService.getStoredConversations(user?.id);
    setConversations(updated);
  };

  // Save renamed conversation title in LocalStorage and backend
  const handleSaveTitle = async (id: string) => {
    if (!tempTitle.trim()) {
      setEditingTitleId(null);
      return;
    }
    const updatedConv = localStorageChatService.updateTitle(user?.id, id, tempTitle.trim());
    if (updatedConv) {
      const updatedList = localStorageChatService.getStoredConversations(user?.id);
      setConversations(updatedList);
      if (activeConv?.id === id) {
        setActiveConv(updatedConv);
      }
    }

    if (user?.id) {
      api.updateConversation(id, user.id, { title: tempTitle.trim() }).catch(() => {});
    }

    setEditingTitleId(null);
    showToast('Título actualizado com sucesso!', 'success');
  };

  // Export conversations backup
  const handleExportHistory = () => {
    const jsonStr = localStorageChatService.exportAsJSON(user?.id);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `historico_conversas_way_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Histórico exportado com sucesso!', 'success');
  };

  // Import conversations backup
  const handleImportHistory = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const count = localStorageChatService.importFromJSON(user?.id, content);
        const updated = localStorageChatService.getStoredConversations(user?.id);
        setConversations(updated);
        showToast(`${count} conversas importadas com sucesso!`, 'success');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Clear all conversation history
  const handleClearAllHistory = () => {
    if (!window.confirm('Atenção: Isto irá apagar todas as conversas do histórico local. Desejas continuar?')) return;
    localStorageChatService.clearAll(user?.id);
    setConversations([]);
    handleNewConversation();
    showToast('Histórico limpo.', 'info');
  };

  // Upload Photo / PDF / Word Document
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Max size: 25MB
      if (file.size > 25 * 1024 * 1024) {
        showToast(`O ficheiro "${file.name}" excede o limite de 25MB.`, 'error');
        continue;
      }

      const isWord =
        file.name.endsWith('.docx') ||
        file.name.endsWith('.doc') ||
        file.type.includes('wordprocessingml') ||
        file.type.includes('msword');

      const isPdf = file.name.endsWith('.pdf') || file.type.includes('pdf');
      const isImage = file.type.startsWith('image/');

      if (isWord) {
        // Extract Word text using mammoth
        setIsExtractingDoc(true);
        try {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          const extracted = result.value;

          const newAtt: Attachment = {
            id: 'att-word-' + Date.now() + '-' + i,
            name: file.name,
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            size: file.size,
            extractedText: extracted,
          };

          setAttachments((prev) => [...prev, newAtt]);
          showToast(`Documento Word "${file.name}" processado com sucesso!`, 'success');
        } catch (err: any) {
          console.error('Erro ao ler Word:', err);
          showToast(`Não foi possível extrair o texto de "${file.name}".`, 'error');
        } finally {
          setIsExtractingDoc(false);
        }
      } else if (isImage || isPdf) {
        // Convert to base64 Data URL
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          const newAtt: Attachment = {
            id: 'att-img-' + Date.now() + '-' + i,
            name: file.name,
            mimeType: file.type || (isPdf ? 'application/pdf' : 'image/jpeg'),
            size: file.size,
            dataUrl,
          };
          setAttachments((prev) => [...prev, newAtt]);
          showToast(`Ficheiro "${file.name}" anexado!`, 'success');
        };
        reader.readAsDataURL(file);
      }
    }

    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleStopGenerating = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
    setMessages((prev) =>
      prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m))
    );
    showToast('Geração interrompida.', 'info');
  };

  // Send or Regenerate Message with Local Storage Persistence & Fallback
  const handleSendMessage = async (textToSend?: string, isRegenerate = false, customMessagesHistory?: ChatMessage[]) => {
    const msg = textToSend !== undefined ? textToSend : inputMessage;
    if ((!msg.trim() && attachments.length === 0 && !isRegenerate) || isGenerating) return;

    // Check usage quota if user exists
    if (user && user.dailyUsageCount >= (user.maxDailyQuota || 50)) {
      showToast('Atingiste a quota diária gratuita. Adquire um plano a partir de 65 MT para mensagens ilimitadas!', 'error');
      setActivePlanModal(true);
      return;
    }

    const currentAttachments = isRegenerate ? [] : [...attachments];
    setInputMessage('');
    setAttachments([]);
    setIsGenerating(true);

    // 1. Ensure active conversation exists in LocalStorage
    let convId = activeConv?.id || selectedConversationId;
    if (!convId) {
      const newConv = localStorageChatService.createNewConversation(
        user?.id,
        msg ? (msg.length > 35 ? msg.slice(0, 35) + '...' : msg) : 'Conversa de Estudo'
      );
      convId = newConv.id;
      setActiveConv(newConv);
      setSelectedConversationId(newConv.id);
    }

    let updatedMessages = customMessagesHistory || [...messages];

    // 2. Append User Message
    if (!isRegenerate) {
      const userMsg: ChatMessage = {
        id: 'msg-user-' + Date.now(),
        role: 'user',
        content: msg,
        attachments: currentAttachments,
        timestamp: new Date().toISOString(),
      };
      updatedMessages.push(userMsg);

      // Persist user message to LocalStorage immediately
      localStorageChatService.appendMessage(user?.id, convId, userMsg);
    }

    // 3. Create Model Placeholder Message
    const modelTempId = 'msg-model-' + Date.now();
    const placeholderMsg: ChatMessage = {
      id: modelTempId,
      role: 'model',
      content: '',
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };

    setMessages([...updatedMessages, placeholderMsg]);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    // Build prompt with document contents
    let finalPrompt = msg;
    const wordAtts = currentAttachments.filter((a) => a.extractedText);
    if (wordAtts.length > 0) {
      const docsText = wordAtts
        .map((a) => `\n\n--- Conteúdo do Documento Word (${a.name}) ---\n${a.extractedText}`)
        .join('\n');
      finalPrompt = `${msg}\n${docsText}`;
    }

    let accumulatedStream = '';

    // Smooth fallback execution helper
    const executeLocalFallback = async () => {
      const fallbackResponse = generateLocalMozambicanResponse(
        msg || 'Estudos Académicos',
        user?.institution || 'Moçambique',
        user?.course || 'Geral'
      );

      // Simulate smooth live typing for local response
      const words = fallbackResponse.split(' ');
      let currentOutput = '';

      for (let i = 0; i < words.length; i += 4) {
        const chunk = words.slice(i, i + 4).join(' ') + (i + 4 < words.length ? ' ' : '');
        currentOutput += chunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === modelTempId
              ? { ...m, content: currentOutput, isStreaming: true }
              : m
          )
        );
        await new Promise((resolve) => setTimeout(resolve, 25));
      }

      // Finalize message in state and LocalStorage
      const finalModelMsg: ChatMessage = {
        id: modelTempId,
        role: 'model',
        content: fallbackResponse,
        timestamp: new Date().toISOString(),
        isStreaming: false,
      };

      setMessages((prev) =>
        prev.map((m) => (m.id === modelTempId ? finalModelMsg : m))
      );

      localStorageChatService.appendMessage(user?.id, convId, finalModelMsg);
      const refreshedConvs = localStorageChatService.getStoredConversations(user?.id);
      setConversations(refreshedConvs);
      const current = refreshedConvs.find((c) => c.id === convId);
      if (current) setActiveConv(current);

      setIsGenerating(false);
      abortControllerRef.current = null;
    };

    try {
      await api.streamChatMessage(
        user?.id || 'guest_student',
        {
          conversationId: convId,
          message: finalPrompt,
          attachments: currentAttachments.map((a) => ({
            name: a.name,
            mimeType: a.mimeType,
            dataUrl: a.dataUrl,
            extractedText: a.extractedText,
          })),
          academicContext: {
            institution: user?.institution || 'Moçambique',
            level: user?.academicLevel || 'Ensino Superior',
            subject: user?.course || 'Geral',
          },
        },
        {
          onChunk: (chunk) => {
            accumulatedStream += chunk;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === modelTempId
                  ? { ...m, content: accumulatedStream }
                  : m
              )
            );
            // Sync to LocalStorage stream
            localStorageChatService.updateMessageContent(
              user?.id,
              convId,
              modelTempId,
              accumulatedStream,
              true
            );
          },
          onDone: (meta) => {
            if (!accumulatedStream || accumulatedStream.trim().length === 0) {
              executeLocalFallback();
              return;
            }

            const finalModelMsg: ChatMessage = {
              id: modelTempId,
              role: 'model',
              content: accumulatedStream,
              timestamp: new Date().toISOString(),
              isStreaming: false,
            };

            setMessages((prev) =>
              prev.map((m) => (m.id === modelTempId ? finalModelMsg : m))
            );

            // Persist completed message to LocalStorage
            localStorageChatService.appendMessage(
              user?.id,
              convId,
              finalModelMsg,
              meta.conversationTitle
            );

            const refreshed = localStorageChatService.getStoredConversations(user?.id);
            setConversations(refreshed);
            const found = refreshed.find((c) => c.id === convId);
            if (found) setActiveConv(found);

            setIsGenerating(false);
            abortControllerRef.current = null;
          },
          onError: () => {
            if (accumulatedStream.trim().length === 0) {
              executeLocalFallback();
            } else {
              setIsGenerating(false);
              abortControllerRef.current = null;
            }
          },
        },
        abortController.signal
      );
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setIsGenerating(false);
        abortControllerRef.current = null;
        return;
      }

      console.warn('Fluxo de rede interrompido, a accionar motor pedagógico local:', err?.message);
      // If network stream fails completely and nothing was accumulated, smoothly trigger local engine
      if (!accumulatedStream || accumulatedStream.trim().length === 0) {
        await executeLocalFallback();
      } else {
        setIsGenerating(false);
        abortControllerRef.current = null;
      }
    }
  };

  // Regenerate Response
  const handleRegenerate = (modelMsgIndex: number) => {
    if (isGenerating) return;

    // Find the last user message before this model message
    let lastUserMsg: ChatMessage | null = null;
    let historySlice: ChatMessage[] = [];

    for (let i = modelMsgIndex - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserMsg = messages[i];
        historySlice = messages.slice(0, i + 1);
        break;
      }
    }

    if (!lastUserMsg) {
      showToast('Não foi possível encontrar a pergunta original para regenerar.', 'error');
      return;
    }

    handleSendMessage(lastUserMsg.content, true, historySlice);
  };

  // Copy message text
  const handleCopyMessage = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMsgId(msgId);
    showToast('Resposta copiada para a área de transferência!', 'success');
    setTimeout(() => {
      setCopiedMsgId(null);
    }, 2000);
  };

  // Filter conversations
  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Quick suggestion prompts
  const quickPrompts = [
    {
      title: 'Fórmula Resolvente e Bhaskara',
      prompt: 'Explica a fórmula resolvente quadrática x = (-b ± √Δ) / 2a com exemplo resolvido passo a passo.',
      icon: '📐',
    },
    {
      title: 'Cálculo de IVA e Finanças MZ',
      prompt: 'Como calcular o IVA de 16% em Moçambique com fórmula, exemplo prático e lançamentos contabilísticos?',
      icon: '💰',
    },
    {
      title: 'Normas de Monografia UEM / UP',
      prompt: 'Qual a estrutura oficial exigida para a introdução e metodologia de uma monografia segundo as normas da UEM?',
      icon: '📚',
    },
    {
      title: 'Física: Movimento MRUV',
      prompt: 'Explica o Movimento Retilíneo Uniformemente Variado (MRUV) com as fórmulas de velocidade, espaço e Torricelli.',
      icon: '⚡',
    },
  ];

  return (
    <div className="h-[calc(100vh-4rem)] max-w-7xl mx-auto flex overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* 1. History Sidebar (Local Storage Powered) */}
      <aside
        className={`fixed inset-y-16 left-0 z-30 w-72 sm:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out md:relative md:inset-y-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:hidden'
        }`}
      >
        {/* Sidebar Header: New Chat Button & Search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-extrabold text-slate-900 dark:text-white leading-none">
                  Sessões Anteriores
                </h2>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Armazenamento Local
                </span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleNewConversation}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all hover:scale-101"
            id="chat-new-conversation-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Conversa com IA</span>
          </button>

          {/* Search History */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Pesquisar conversas salvas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 border-none text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Conversation List (Stored locally, switchable with 1-click) */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filteredConversations.length > 0 ? (
            filteredConversations.map((conv) => {
              const isActive = activeConv?.id === conv.id || selectedConversationId === conv.id;
              const isEditing = editingTitleId === conv.id;
              const msgCount = conv.messages?.length || 0;

              return (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv)}
                  className={`group relative flex items-center justify-between p-2.5 sm:p-3 rounded-xl cursor-pointer text-xs transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-100 font-semibold border border-emerald-500/40 shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent'
                  }`}
                  id={`chat-thread-${conv.id}`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                    <div className="relative">
                      <Bot className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                      {conv.pinned && (
                        <Pin className="w-2.5 h-2.5 text-amber-500 fill-amber-500 absolute -top-1 -right-1" />
                      )}
                    </div>

                    {isEditing ? (
                      <input
                        type="text"
                        value={tempTitle}
                        onChange={(e) => setTempTitle(e.target.value)}
                        onBlur={() => handleSaveTitle(conv.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveTitle(conv.id);
                          if (e.key === 'Escape') setEditingTitleId(null);
                        }}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        className="w-full p-1 rounded bg-white dark:bg-slate-800 border border-emerald-500 text-xs text-slate-900 dark:text-white"
                      />
                    ) : (
                      <div className="min-w-0 flex-1">
                        <p className="truncate leading-tight">{conv.title || 'Conversa sem título'}</p>
                        <p className="text-[10px] text-slate-400 font-normal mt-0.5">
                          {msgCount} {msgCount === 1 ? 'mensagem' : 'mensagens'}
                        </p>
                      </div>
                    )}
                  </div>

                  {!isEditing && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Pin Toggle */}
                      <button
                        onClick={(e) => handleTogglePin(conv.id, e)}
                        className={`p-1 rounded hover:text-amber-500 ${conv.pinned ? 'text-amber-500' : 'text-slate-400'}`}
                        title={conv.pinned ? 'Desafixar conversa' : 'Fixar no topo'}
                      >
                        <Pin className="w-3 h-3" />
                      </button>

                      {/* Edit Title */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTitleId(conv.id);
                          setTempTitle(conv.title);
                        }}
                        className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-white"
                        title="Renomear sessão"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>

                      {/* Delete Conversation */}
                      <button
                        onClick={(e) => handleDeleteConversation(conv.id, e)}
                        className="p-1 rounded text-slate-400 hover:text-rose-500"
                        title="Apagar do histórico"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 px-4 text-slate-400 text-xs">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-semibold text-slate-600 dark:text-slate-300">Sem histórico guardado</p>
              <p className="text-[10px] mt-1 text-slate-500">As tuas sessões ficam guardadas localmente no navegador.</p>
            </div>
          )}
        </div>

        {/* Sidebar Footer: Local Storage Management & Quota */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-xs space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>{conversations.length} conversas salvas</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleExportHistory}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Exportar histórico (.json)"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => importJsonInputRef.current?.click()}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                title="Importar histórico (.json)"
              >
                <Upload className="w-3.5 h-3.5" />
              </button>
              <input
                type="file"
                ref={importJsonInputRef}
                onChange={handleImportHistory}
                accept=".json,application/json"
                className="hidden"
              />
              <button
                onClick={handleClearAllHistory}
                className="p-1 rounded hover:bg-rose-100 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-500"
                title="Limpar histórico local"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {user && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 mb-1.5">
                <span>Uso Diário:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {user.dailyUsageCount} / {user.maxDailyQuota || 50}
                </span>
              </div>
              <button
                onClick={() => setActivePlanModal(true)}
                className="w-full py-1.5 px-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors border border-amber-500/20"
              >
                <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Acesso Ilimitado (65 MT)</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* 2. Main Chat Conversation Screen */}
      <main className="flex-1 flex flex-col h-full bg-white dark:bg-slate-950 overflow-hidden relative">
        {/* Top Chat Header */}
        <header className="h-14 px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Histórico de conversas"
            >
              {sidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>{activeConv?.title || 'Chat Académico Exclusivo'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-500/30">
                  Moçambique AI
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Dúvidas em tempo real, resolução didática de fórmulas e leitura de fotos, PDFs e Word.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <>
                <button
                  onClick={() => {
                    const text = messages.map((m) => `${m.role === 'user' ? 'Estudante' : 'Way IA'}:\n${m.content}`).join('\n\n');
                    exportToPDF(activeConv?.title || 'Conversa Way Estudantes AI', text, {
                      student: user?.name,
                      institution: user?.institution,
                    });
                    showToast('PDF gerado com sucesso!', 'success');
                  }}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Exportar Conversa em PDF"
                >
                  <FileDown className="w-4 h-4 text-emerald-500" />
                </button>

                <button
                  onClick={handleNewConversation}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Nova Conversa"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </header>

        {/* Message Stream Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {messages.length === 0 ? (
            /* Welcome / Empty State */
            <div className="max-w-2xl mx-auto my-auto py-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/20">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Como posso ajudar os teus estudos hoje?
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                  Podes escrever uma pergunta, carregar uma fotografia do teu caderno, anexar um documento Word (.docx) ou PDF. Todas as sessões são salvas no teu histórico local.
                </p>
              </div>

              {/* Quick Prompt Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {quickPrompts.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(qp.prompt)}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all text-left group"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      <span>{qp.icon}</span>
                      <span>{qp.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {qp.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Messages List */
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                const isCopied = copiedMsgId === msg.id;

                return (
                  <div
                    key={msg.id || index}
                    className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {/* Assistant Avatar */}
                    {!isUser && (
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shrink-0 mt-1">
                        <Sparkles className="w-4 h-4" />
                      </div>
                    )}

                    {/* Message Bubble Container */}
                    <div
                      className={`relative max-w-[88%] sm:max-w-[80%] rounded-3xl p-4 sm:p-6 transition-all ${
                        isUser
                          ? 'bg-emerald-600 text-white rounded-br-sm shadow-md shadow-emerald-600/15'
                          : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-bl-sm border border-slate-200 dark:border-slate-800 shadow-sm'
                      }`}
                    >
                      {/* Attachments rendering */}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {msg.attachments.map((att) => {
                            const isImg = att.mimeType.startsWith('image/');
                            return (
                              <div
                                key={att.id}
                                className={`flex items-center gap-2 p-2 rounded-xl text-xs border ${
                                  isUser
                                    ? 'bg-emerald-700/50 border-emerald-500/50 text-emerald-50'
                                    : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                                }`}
                              >
                                {isImg && att.dataUrl ? (
                                  <img
                                    src={att.dataUrl}
                                    alt={att.name}
                                    onClick={() => setPreviewImage(att.dataUrl!)}
                                    className="w-10 h-10 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                  />
                                ) : (
                                  <FileText className="w-4 h-4 text-emerald-400" />
                                )}
                                <div className="max-w-[140px] truncate">
                                  <p className="font-semibold truncate">{att.name}</p>
                                  <p className="text-[10px] opacity-75">
                                    {(att.size / 1024).toFixed(0)} KB
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Content Body */}
                      {isUser ? (
                        <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                          {msg.content}
                        </p>
                      ) : (
                        <div>
                          {msg.content ? (
                            <MathRenderer content={msg.content} />
                          ) : msg.isStreaming ? (
                            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-pulse py-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                              <span>O Way Estudantes AI está a estruturar a resposta...</span>
                            </div>
                          ) : null}
                        </div>
                      )}

                      {/* Message Footer Controls (For Model Responses) */}
                      {!isUser && !msg.isStreaming && msg.content && (
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span className="text-[10px]">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>

                          <div className="flex items-center gap-1 sm:gap-2">
                            {/* Copiar Resposta */}
                            <button
                              onClick={() => handleCopyMessage(msg.id, msg.content)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors text-[11px] font-medium"
                              title="Copiar resposta completa"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  <span className="text-emerald-600 font-bold">Copiado</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copiar</span>
                                </>
                              )}
                            </button>

                            {/* Regenerar Resposta */}
                            <button
                              onClick={() => handleRegenerate(index)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors text-[11px] font-medium"
                              title="Regenerar esta resposta da IA"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Regenerar</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* User Avatar */}
                    {isUser && (
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1 shadow-xs">
                        {user?.name ? user.name.charAt(0).toUpperCase() : 'E'}
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* 3. Input & Attachment Panel */}
        <div className="p-4 sm:p-6 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-3xl mx-auto space-y-3">
            {/* Attachment preview strip before sending */}
            {attachments.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {attachments.map((att) => {
                  const isImg = att.mimeType.startsWith('image/');
                  return (
                    <div
                      key={att.id}
                      className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-500/30 text-xs text-emerald-950 dark:text-emerald-200"
                    >
                      {isImg && att.dataUrl ? (
                        <img
                          src={att.dataUrl}
                          alt={att.name}
                          className="w-7 h-7 object-cover rounded-md"
                        />
                      ) : (
                        <FileText className="w-4 h-4 text-emerald-500" />
                      )}
                      <span className="font-semibold max-w-[130px] truncate">{att.name}</span>
                      <button
                        onClick={() => removeAttachment(att.id)}
                        className="p-1 rounded-full hover:bg-emerald-200/50 dark:hover:bg-emerald-900/50 text-slate-500 hover:text-rose-500 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Document Extraction Progress Indicator */}
            {isExtractingDoc && (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/20">
                <span className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <span>A extrair texto do ficheiro Word / Documento...</span>
              </div>
            )}

            {/* Main Input Box */}
            <div className="relative flex items-end gap-2 p-2 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all shadow-inner">
              {/* Attachment Actions: Photos, PDF, Word */}
              <div className="flex items-center gap-1 pl-1 pb-1">
                {/* Photo / Camera Upload */}
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  title="Carregar fotografia do caderno / exercício"
                  id="chat-upload-photo-btn"
                >
                  <Camera className="w-5 h-5" />
                </button>

                {/* PDF & Word Upload */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 hover:bg-white dark:hover:bg-slate-800 transition-colors"
                  title="Carregar documento PDF ou Word (.docx)"
                  id="chat-upload-doc-btn"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                {/* Hidden Inputs */}
                <input
                  type="file"
                  ref={photoInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  multiple
                  className="hidden"
                />
              </div>

              {/* Textarea for typing question */}
              <textarea
                ref={textareaRef}
                rows={1}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Escreve a tua pergunta, dúvida ou cola o exercício..."
                className="flex-1 max-h-36 py-2.5 px-2 bg-transparent text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
                id="chat-prompt-textarea"
              />

              {/* Send or Stop Button */}
              <div className="pb-1 pr-1">
                {isGenerating ? (
                  <button
                    type="button"
                    onClick={handleStopGenerating}
                    className="p-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20 transition-all hover:scale-105"
                    title="Interromper geração"
                    id="chat-stop-generating-btn"
                  >
                    <Square className="w-4 h-4 fill-white" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    disabled={!inputMessage.trim() && attachments.length === 0}
                    className="p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
                    title="Enviar pergunta"
                    id="chat-send-message-btn"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 px-2">
              <span>Pressiona Enter para enviar ou Shift+Enter para nova linha</span>
              <span>Suporta Fotos, PDFs, Word (.docx) & Fórmulas</span>
            </div>
          </div>
        </div>
      </main>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Pré-visualização da Imagem"
              className="max-h-[80vh] w-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};
