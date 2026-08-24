import { GoogleGenAI } from '@google/genai';
import { generateMozambiqueAcademicResponse, AcademicContext } from './mozAcademicEngine.js';

let aiInstance: GoogleGenAI | null = null;

export function getGenAIClient(): GoogleGenAI {
  const currentKey = process.env.GEMINI_API_KEY;
  if (!currentKey) {
    throw new Error('Chave da API Gemini não configurada no servidor (GEMINI_API_KEY).');
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: currentKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

// Ordered list of active supported models to try in case of 503 high demand or 429 rate limits
const MODEL_CASCADE = [
  'gemini-3.7-flash',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
];

/**
 * Ensures contents structure passed to Gemini API has non-empty parts, starts with user,
 * and strictly alternates between user and model roles.
 */
function sanitizeContents(contents: any): any[] {
  if (!Array.isArray(contents)) {
    return [{ role: 'user', parts: [{ text: typeof contents === 'string' ? contents : 'Explica este tema didaticamente.' }] }];
  }

  const rawCleaned: { role: 'user' | 'model'; parts: any[] }[] = [];

  for (const item of contents) {
    if (!item || typeof item !== 'object') continue;
    const role: 'user' | 'model' = item.role === 'model' ? 'model' : 'user';
    const rawParts = Array.isArray(item.parts) ? item.parts : [];
    const validParts: any[] = [];

    for (const part of rawParts) {
      if (!part) continue;
      if (typeof part.text === 'string' && part.text.trim().length > 0) {
        validParts.push({ text: part.text });
      } else if (part.inlineData && part.inlineData.data && part.inlineData.mimeType) {
        validParts.push(part);
      }
    }

    if (validParts.length > 0) {
      rawCleaned.push({ role, parts: validParts });
    }
  }

  if (rawCleaned.length === 0) {
    return [{ role: 'user', parts: [{ text: 'Olá! Ajuda-me nos meus estudos académicos em Moçambique.' }] }];
  }

  // 1. Remove leading 'model' messages if any
  while (rawCleaned.length > 0 && rawCleaned[0].role !== 'user') {
    rawCleaned.shift();
  }

  if (rawCleaned.length === 0) {
    return [{ role: 'user', parts: [{ text: 'Olá! Ajuda-me nos meus estudos académicos em Moçambique.' }] }];
  }

  // 2. Merge consecutive turns with the same role so that roles strictly alternate
  const merged: { role: 'user' | 'model'; parts: any[] }[] = [];
  for (const turn of rawCleaned) {
    if (merged.length === 0) {
      merged.push({ role: turn.role, parts: [...turn.parts] });
    } else {
      const prev = merged[merged.length - 1];
      if (prev.role === turn.role) {
        prev.parts.push(...turn.parts);
      } else {
        merged.push({ role: turn.role, parts: [...turn.parts] });
      }
    }
  }

  // 3. Ensure the last turn is from user
  if (merged[merged.length - 1].role !== 'user') {
    merged.push({ role: 'user', parts: [{ text: 'Por favor, continua com a explicação detalhada.' }] });
  }

  return merged;
}

export const MOZAMBIQUE_SYSTEM_INSTRUCTION = `Tu és o "Way Estudantes AI", o assistente académico inteligente de referência desenvolvido especialmente para estudantes de Moçambique.

### MISSÃO E OBJETIVO:
- **Foco Principal:** Ajudar diretamente o estudante a tirar dúvidas, responder a perguntas com clareza, resolver problemas passo a passo e explicar matérias de forma natural e acessível.
- **Estilo de Resposta:** Responde de forma direta, clara, acolhedora e focada no que o estudante perguntou. Não forces templates ou secções rígidas. Se o estudante faz uma pergunta direta ou tem uma dúvida, responde diretamente à dúvida com objetividade e rigor didático.
- **Ética:** O sistema tem finalidade educativa. Não apoiar fraudes, invasões ou conteúdos ilícitos.

### ÁREAS DE CONHECIMENTO COBERTAS:
1. **História** (Moçambique, África e História Mundial)
2. **Geografia** (Moçambique, África e Geografia Física/Económica Mundial)
3. **Matemática** (Álgebra, Cálculo, Estatística, Geometria, Funções)
4. **Português** (Gramática, Redação Académica, Literatura Moçambicana e Lusófona)
5. **Ciências** (Ciências Naturais, Ambiente, Biodiversidade)
6. **Biologia** (Genética, Fisiologia, Saúde Pública em Moçambique)
7. **Física** (Mecânica, Termodinâmica, Eletromagnetismo, Óptica)
8. **Química** (Química Geral, Orgânica, Estequiometria, Soluções)
9. **Gestão** (Estratégia, Recursos Humanos, PMEs, Gestão Financeira, Tesouraria)
10. **Contabilidade** (PGC-NIRF de Moçambique, Balanço, Lançamentos Débito/Crédito)
11. **Economia** (Micro/Macroeconomia, Inflação, Metical, Banco de Moçambique, SADC)
12. **Informática** (Algoritmos, Programação, SQL, Redes, Inteligência Artificial)
13. **Conhecimento Geral** (Cidadania, Atualidades, Raciocínio Lógico)
14. **Conhecimento de Moçambique** (Províncias, Recursos, Constituição, Heróis, Símbolos)
15. **Conhecimento Mundial** (Geopolítica, Organizações Internacionais ONU/UA/SADC)
16. **Cultura Moçambicana** (Línguas Nacionais, Timbila Chopi, Danças Tradicionais, Literatura)
17. **Educação Inclusiva** (Adaptações Curriculares, NEE, Acessibilidade)
18. **Metodologia de Investigação** (Normas UEM, UP, APA 7ª Edição, Monografias)

### TRABALHO ACADÉMICO POR PÁGINAS:
Quando solicitado especificamente um trabalho académico no gerador de trabalhos (para 3, 6, 12 ou 18 páginas), organiza o documento de forma completa e estruturada em secções formais (Capa, Introdução, Desenvolvimento, Aplicação prática, Exercícios/Exemplos, Respostas/Análise, Resumo, Conclusão, Referências bibliográficas).

### REGRAS CRÍTICAS DE FORMATAÇÃO DE FÓRMULAS E MATEMÁTICA:
1. **NUNCA UTILIZES CÓDIGO LATEX OU CIFRÕES**:
   - É ESTRITAMENTE PROIBIDO escrever símbolos LaTeX como $, $$, \\Delta, \\delta, \\frac, \\sqrt, \\cdot, \\times, \\pm, \\sum, \\int.
   - Apresenta sempre as fórmulas em formato matemático legível com caracteres Unicode normais.
   - Exemplos correctos:
     * x² − 6x + 9 = 0
     * Δ = b² − 4ac
     * x = (-b ± √Δ) / 2a
     * f'(x) = 3x² + 2x − 5
     * IVA = Valor Base × 16%

2. **FÓRMULAS EM CAIXAS PRÓPRIAS**:
   - Coloca cada fórmula matemática principal dentro de um bloco de código com a tag "math", por exemplo:
   \`\`\`math
   Δ = b² − 4ac
   \`\`\`
   \`\`\`math
   x = (-b ± √Δ) / 2a
   \`\`\`

3. **SEPARAÇÃO DE CONTEÚDO**:
   - Separa as secções exclusivamente com espaçamento vertical (linhas em branco).
   - NUNCA uses linhas horizontais (como "---", "***" ou "<hr>") para dividir o conteúdo.`;

/**
 * Execute a generateContent call with automatic retry and model cascade for resilience against 503/429 spikes.
 */
export async function generateContentWithResilience(
  contents: any,
  systemInstruction: string = MOZAMBIQUE_SYSTEM_INSTRUCTION,
  fallbackPrompt?: string,
  fallbackAttachments?: any[],
  fallbackContext?: AcademicContext
): Promise<string> {
  const cleanContents = sanitizeContents(contents);

  if (!process.env.GEMINI_API_KEY) {
    return generateMozambiqueAcademicResponse(fallbackPrompt || '', fallbackAttachments, fallbackContext);
  }

  const client = getGenAIClient();

  for (const model of MODEL_CASCADE) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await client.models.generateContent({
          model,
          contents: cleanContents,
          config: {
            systemInstruction,
          },
        });
        if (response && response.text) {
          return response.text;
        }
      } catch (err: any) {
        const isUnavailable =
          err?.status === 503 ||
          err?.code === 503 ||
          err?.message?.includes('503') ||
          err?.message?.includes('UNAVAILABLE') ||
          err?.message?.includes('high demand') ||
          err?.status === 429 ||
          err?.code === 429;

        if (isUnavailable && attempt === 0) {
          // Short backoff before retry
          await new Promise((resolve) => setTimeout(resolve, 600));
          continue;
        }
        // If still failing with this model, proceed to next model in cascade
        break;
      }
    }
  }

  // If all models in cascade fail or are unavailable, smoothly fallback to pedagogical engine
  return generateMozambiqueAcademicResponse(fallbackPrompt || '', fallbackAttachments, fallbackContext);
}

/**
 * Stream content with resilience: tries models in cascade, falls back to smooth streaming of the pedagogical engine if needed.
 */
export async function streamContentWithResilience(
  contents: any,
  onChunk: (chunkText: string) => Promise<void> | void,
  fallbackPrompt?: string,
  fallbackAttachments?: any[],
  fallbackContext?: AcademicContext,
  systemInstruction: string = MOZAMBIQUE_SYSTEM_INSTRUCTION
): Promise<string> {
  let fullGeneratedText = '';
  const cleanContents = sanitizeContents(contents);

  if (process.env.GEMINI_API_KEY) {
    try {
      const client = getGenAIClient();

      for (const model of MODEL_CASCADE) {
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const streamResponse = await client.models.generateContentStream({
              model,
              contents: cleanContents,
              config: {
                systemInstruction,
              },
            });

            let receivedAny = false;
            for await (const chunk of streamResponse) {
              const text = chunk.text || '';
              if (text && text.length > 0) {
                receivedAny = true;
                fullGeneratedText += text;
                await onChunk(text);
              }
            }

            if (receivedAny && fullGeneratedText.trim().length > 0) {
              return fullGeneratedText;
            }
          } catch (err: any) {
            const isUnavailable =
              err?.status === 503 ||
              err?.code === 503 ||
              err?.message?.includes('503') ||
              err?.message?.includes('UNAVAILABLE') ||
              err?.message?.includes('high demand') ||
              err?.status === 429 ||
              err?.code === 429 ||
              err?.status === 500;

            // If we haven't sent any chunks yet, retry once with backoff or switch model
            if (fullGeneratedText.length === 0) {
              if (isUnavailable && attempt === 0) {
                await new Promise((resolve) => setTimeout(resolve, 500));
                continue;
              }
              // Move to next model in cascade
              break;
            } else {
              // Some chunks were already streamed to the client; return current text
              return fullGeneratedText;
            }
          }
        }
      }
    } catch (clientErr: any) {
      // Handled by downstream fallback engine
    }
  }

  // Smooth fallback through Mozambican academic pedagogical engine if nothing was emitted yet
  if (fullGeneratedText.length === 0) {
    const fallbackText = generateMozambiqueAcademicResponse(
      fallbackPrompt || '',
      fallbackAttachments,
      fallbackContext
    );

    // Split text into coherent chunks for natural real-time streaming cadence
    const words = fallbackText.split(' ');
    fullGeneratedText = '';

    for (let i = 0; i < words.length; i += 3) {
      const piece = words.slice(i, i + 3).join(' ') + (i + 3 < words.length ? ' ' : '');
      if (piece) {
        fullGeneratedText += piece;
        await onChunk(piece);
        // Realistic typing speed interval
        await new Promise((resolve) => setTimeout(resolve, 20));
      }
    }
  }

  // Guarantee non-empty output
  if (!fullGeneratedText || fullGeneratedText.trim().length === 0) {
    const defaultMsg = 'Olá! Estou pronto para te ajudar com os teus estudos e trabalhos académicos em Moçambique. Como posso auxiliar-te hoje?';
    fullGeneratedText = defaultMsg;
    await onChunk(defaultMsg);
  }

  return fullGeneratedText;
}
