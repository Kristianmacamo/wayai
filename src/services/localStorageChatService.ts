import { Conversation, ChatMessage } from '../types';

const STORAGE_PREFIX = 'way_conversations_';
const ACTIVE_CONV_PREFIX = 'way_active_conv_';

/**
 * Seed historical sessions if storage is empty, providing students with immediate
 * educational examples (Bhaskara formula with Unicode boxes, Mozambican VAT / IVA calculations, and Academic Thesis structure).
 */
const SEED_CONVERSATIONS: Omit<Conversation, 'userId'>[] = [
  {
    id: 'conv-seed-math-bhaskara',
    title: 'Fórmula Resolvente e Bhaskara (Equação Quadrática)',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    pinned: true,
    messages: [
      {
        id: 'msg-seed-1',
        role: 'user',
        content: 'Como resolver uma equação quadrática usando a fórmula resolvente de Bhaskara?',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: 'msg-seed-2',
        role: 'model',
        content: `# Resolução e Análise da Fórmula Resolvente (Equação Quadrática)

### Introdução
No estudo da Álgebra e Análise Matemática no currículo nacional de Moçambique, a equação do segundo grau ax² + bx + c = 0 é a base para o cálculo de raízes, estudo de parábolas e optimização.

### Explicação
Para encontrar as raízes reais de uma equação quadrática completa da forma ax² + bx + c = 0 (com a ≠ 0), calculamos primeiro o valor do discriminante Delta (Δ). O sinal de Δ determina o número de raízes reais:
- Se Δ > 0: A equação possui duas soluções reais distintas (x₁ ≠ x₂);
- Se Δ = 0: A equação possui uma solução real dupla (x₁ = x₂);
- Se Δ < 0: A equação não possui soluções no conjunto dos números reais (R).

### Fórmula
\`\`\`math
Δ = b² − 4ac
\`\`\`

\`\`\`math
x = (-b ± √Δ) / 2a
\`\`\`

### Descrição das variáveis
- a: Coeficiente do termo quadrático (x²), com a ≠ 0
- b: Coeficiente do termo linear (x)
- c: Termo independente constante
- Δ: Discriminante da equação do 2º grau
- x: Raízes ou zeros da função quadrática

### Exemplo resolvido
**Problema**: Resolve a equação x² − 5x + 6 = 0.

**Passo 1**: Identificar os coeficientes:
- a = 1
- b = −5
- c = 6

**Passo 2**: Calcular o discriminante Delta (Δ):
\`\`\`math
Δ = (−5)² − 4(1)(6) = 25 − 24 = 1
\`\`\`

Como Δ = 1 > 0, existem duas raízes reais distintas. A raiz quadrada é √1 = 1.

**Passo 3**: Aplicar a fórmula resolvente:
\`\`\`math
x₁ = (5 + 1) / (2 × 1) = 6 / 2 = 3
\`\`\`
\`\`\`math
x₂ = (5 − 1) / (2 × 1) = 4 / 2 = 2
\`\`\`

Conjunto Solução: S = { 2, 3 }

### Exercício
Determina no teu caderno as raízes da seguinte equação quadrática:
\`\`\`math
2x² − 8x + 8 = 0
\`\`\`

### Resposta
1. Coeficientes: a = 2, b = −8, c = 8
2. Cálculo de Δ:
\`\`\`math
Δ = (−8)² − 4(2)(8) = 64 − 64 = 0
\`\`\`
3. Como Δ = 0, temos raiz dupla:
\`\`\`math
x = (−(−8) ± √0) / (2 × 2) = 8 / 4 = 2
\`\`\`
Conjunto Solução: S = { 2 }

### Resumo
- O discriminante Δ = b² − 4ac indica a quantidade e natureza das raízes.
- Se o termo a for positivo (a > 0), a concavidade da parábola é voltada para cima; se for negativo (a < 0), é voltada para baixo.`,
        timestamp: new Date(Date.now() - 3600000 * 5 + 3000).toISOString(),
      },
    ],
  },
  {
    id: 'conv-seed-iva-finance',
    title: 'Cálculo de IVA e Lançamentos PGC-NIRF',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    messages: [
      {
        id: 'msg-seed-3',
        role: 'user',
        content: 'Como calcular o IVA de 16% em Moçambique e registar no PGC-NIRF?',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      },
      {
        id: 'msg-seed-4',
        role: 'model',
        content: `# Cálculo do IVA (Imposto sobre o Valor Acrescentado) em Moçambique

### Introdução
O Imposto sobre o Valor Acrescentado (IVA) em Moçambique é regulamentado pelo Código do IVA sob administração da Autoridade Tributária de Moçambique (AT). A taxa geral em vigor para transmissões de bens e prestações de serviços é de 16%.

### Explicação
O IVA incide sobre a despesa do consumidor final. As empresas facturam o IVA aos clientes (IVA Liquidado) e deduzem o IVA suportado nas compras aos fornecedores (IVA Dedutível), entregando a diferença ao Estado moçambicano mensalmente.

### Fórmula
\`\`\`math
Valor do IVA = Valor Base × 0,16
\`\`\`

\`\`\`math
Total a Pagar = Valor Base × 1,16
\`\`\`

\`\`\`math
IVA a Entregar à AT = IVA Liquidado − IVA Dedutível
\`\`\`

### Descrição das variáveis
- Valor Base: Preço líquido das mercadorias ou serviços em Meticais (MT)
- 0,16: Taxa legal de 16% do IVA em Moçambique
- Total a Pagar: Montante bruto facturado ao cliente final (MT)
- IVA Liquidado: Imposto cobrado nas vendas efectuadas
- IVA Dedutível: Imposto suportado nas aquisições e matérias-primas

### Exemplo resolvido
**Caso Prático**: Uma empresa de fornecimento de computadores na Cidade de Maputo emite uma factura com o valor líquido de 45.000 MT.

**Passo 1**: Calcular o imposto IVA:
\`\`\`math
Valor do IVA = 45.000 MT × 0,16 = 7.200 MT
\`\`\`

**Passo 2**: Calcular o total facturado:
\`\`\`math
Total Factura = 45.000 MT + 7.200 MT = 52.200 MT
\`\`\`

### Resumo
- A taxa de IVA em Moçambique é de 16%.
- O imposto não constitui custo para a empresa intermediária sujeita ao regime normal.`,
        timestamp: new Date(Date.now() - 3600000 * 24 + 4000).toISOString(),
      },
    ],
  },
];

function getSafeUserId(userId?: string): string {
  return userId && userId.trim() ? userId.trim() : 'guest_student';
}

export const localStorageChatService = {
  /**
   * Retrieve all conversations stored for the given user from LocalStorage
   */
  getStoredConversations(userId?: string): Conversation[] {
    const safeId = getSafeUserId(userId);
    const key = STORAGE_PREFIX + safeId;

    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        // Seed default educational conversations
        const seeded = SEED_CONVERSATIONS.map((c) => ({
          ...c,
          userId: safeId,
        })) as Conversation[];
        localStorage.setItem(key, JSON.stringify(seeded));
        return seeded;
      }

      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (err) {
      console.warn('Erro ao carregar conversas do LocalStorage:', err);
    }

    return [];
  },

  /**
   * Save or update an entire conversation in LocalStorage
   */
  saveConversation(userId: string | undefined, conversation: Conversation): Conversation {
    const safeId = getSafeUserId(userId);
    const key = STORAGE_PREFIX + safeId;
    const conversations = this.getStoredConversations(safeId);

    const existingIndex = conversations.findIndex((c) => c.id === conversation.id);
    const updatedConv: Conversation = {
      ...conversation,
      userId: safeId,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      conversations[existingIndex] = updatedConv;
    } else {
      conversations.unshift(updatedConv);
    }

    // Sort: pinned first, then by updatedAt descending
    conversations.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

    try {
      localStorage.setItem(key, JSON.stringify(conversations));
    } catch (e) {
      console.error('Erro ao guardar conversa no LocalStorage:', e);
    }

    return updatedConv;
  },

  /**
   * Get a single conversation by ID
   */
  getConversationById(userId: string | undefined, conversationId: string): Conversation | null {
    const conversations = this.getStoredConversations(userId);
    return conversations.find((c) => c.id === conversationId) || null;
  },

  /**
   * Create a new empty conversation session
   */
  createNewConversation(userId?: string, initialTitle?: string): Conversation {
    const safeId = getSafeUserId(userId);
    const newConv: Conversation = {
      id: 'conv-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      userId: safeId,
      title: initialTitle || 'Nova Conversa de Estudo',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false,
    };

    this.saveConversation(safeId, newConv);
    this.setActiveConversationId(safeId, newConv.id);
    return newConv;
  },

  /**
   * Append a message (user or model) to a specific conversation thread
   */
  appendMessage(
    userId: string | undefined,
    conversationId: string,
    message: ChatMessage,
    customTitle?: string
  ): Conversation {
    const safeId = getSafeUserId(userId);
    let conv = this.getConversationById(safeId, conversationId);

    if (!conv) {
      conv = {
        id: conversationId,
        userId: safeId,
        title: customTitle || (message.content ? message.content.slice(0, 35) + '...' : 'Conversa de Estudo'),
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    // Replace if message with same ID already exists (e.g. streaming update), or append
    const msgIndex = conv.messages.findIndex((m) => m.id === message.id);
    if (msgIndex >= 0) {
      conv.messages[msgIndex] = message;
    } else {
      conv.messages.push(message);
    }

    if (customTitle && conv.title === 'Nova Conversa de Estudo') {
      conv.title = customTitle;
    } else if (conv.messages.length === 1 && message.role === 'user' && message.content) {
      conv.title = message.content.slice(0, 38) + (message.content.length > 38 ? '...' : '');
    }

    conv.updatedAt = new Date().toISOString();
    return this.saveConversation(safeId, conv);
  },

  /**
   * Update message streaming content in real-time
   */
  updateMessageContent(
    userId: string | undefined,
    conversationId: string,
    messageId: string,
    newContent: string,
    isStreaming: boolean = false
  ): Conversation | null {
    const safeId = getSafeUserId(userId);
    const conv = this.getConversationById(safeId, conversationId);
    if (!conv) return null;

    const msg = conv.messages.find((m) => m.id === messageId);
    if (msg) {
      msg.content = newContent;
      msg.isStreaming = isStreaming;
      conv.updatedAt = new Date().toISOString();
      return this.saveConversation(safeId, conv);
    }

    return conv;
  },

  /**
   * Delete a conversation thread
   */
  deleteConversation(userId: string | undefined, conversationId: string): boolean {
    const safeId = getSafeUserId(userId);
    const key = STORAGE_PREFIX + safeId;
    const conversations = this.getStoredConversations(safeId);

    const filtered = conversations.filter((c) => c.id !== conversationId);
    try {
      localStorage.setItem(key, JSON.stringify(filtered));

      // If active conversation was deleted, clear active state
      if (this.getActiveConversationId(safeId) === conversationId) {
        const nextActive = filtered.length > 0 ? filtered[0].id : null;
        this.setActiveConversationId(safeId, nextActive);
      }
      return true;
    } catch (e) {
      console.error('Erro ao eliminar conversa do LocalStorage:', e);
      return false;
    }
  },

  /**
   * Update conversation title
   */
  updateTitle(userId: string | undefined, conversationId: string, newTitle: string): Conversation | null {
    const safeId = getSafeUserId(userId);
    const conv = this.getConversationById(safeId, conversationId);
    if (!conv) return null;

    conv.title = newTitle.trim() || 'Sem Título';
    conv.updatedAt = new Date().toISOString();
    return this.saveConversation(safeId, conv);
  },

  /**
   * Toggle pinned status of conversation
   */
  togglePin(userId: string | undefined, conversationId: string): Conversation | null {
    const safeId = getSafeUserId(userId);
    const conv = this.getConversationById(safeId, conversationId);
    if (!conv) return null;

    conv.pinned = !conv.pinned;
    conv.updatedAt = new Date().toISOString();
    return this.saveConversation(safeId, conv);
  },

  /**
   * Get active conversation ID
   */
  getActiveConversationId(userId?: string): string | null {
    const safeId = getSafeUserId(userId);
    return localStorage.getItem(ACTIVE_CONV_PREFIX + safeId);
  },

  /**
   * Set active conversation ID
   */
  setActiveConversationId(userId: string | undefined, conversationId: string | null): void {
    const safeId = getSafeUserId(userId);
    if (conversationId) {
      localStorage.setItem(ACTIVE_CONV_PREFIX + safeId, conversationId);
    } else {
      localStorage.removeItem(ACTIVE_CONV_PREFIX + safeId);
    }
  },

  /**
   * Clear all conversations for user
   */
  clearAll(userId?: string): void {
    const safeId = getSafeUserId(userId);
    localStorage.removeItem(STORAGE_PREFIX + safeId);
    localStorage.removeItem(ACTIVE_CONV_PREFIX + safeId);
  },

  /**
   * Export all conversations as JSON string
   */
  exportAsJSON(userId?: string): string {
    const conversations = this.getStoredConversations(userId);
    return JSON.stringify(conversations, null, 2);
  },

  /**
   * Import conversations from JSON string
   */
  importFromJSON(userId: string | undefined, jsonString: string): number {
    const safeId = getSafeUserId(userId);
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) return 0;

      const existing = this.getStoredConversations(safeId);
      const existingIds = new Set(existing.map((c) => c.id));
      let importedCount = 0;

      for (const item of parsed) {
        if (item && item.id && Array.isArray(item.messages)) {
          if (!existingIds.has(item.id)) {
            existing.unshift({
              ...item,
              userId: safeId,
            });
            importedCount++;
          }
        }
      }

      localStorage.setItem(STORAGE_PREFIX + safeId, JSON.stringify(existing));
      return importedCount;
    } catch (e) {
      console.error('Erro ao importar JSON:', e);
      return 0;
    }
  },
};
