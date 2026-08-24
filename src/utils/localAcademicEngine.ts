/**
 * Local Mozambican Academic Intelligence Fallback Engine
 * Provides instant, zero-latency academic responses for students in Mozambique
 * when offline, previewing, or experiencing server network latency.
 * Directly answers questions, clarifies doubts, and explains concepts with academic rigor.
 * STRICTLY uses clean Unicode math inside dedicated formula boxes (```math ... ```)
 * without raw LaTeX symbols or dividing lines.
 */

export function generateLocalMozambicanResponse(prompt: string, institution: string = 'Moçambique', course: string = 'Geral'): string {
  const p = prompt.toLowerCase().trim();

  // 1. Gestão de Caixa / Tesouraria / Fluxo de Caixa
  if (p.includes('gestão de caixa') || p.includes('fluxo de caixa') || p.includes('caixa') || p.includes('tesouraria')) {
    return `# Gestão de Caixa e Tesouraria Empresarial

A **gestão de caixa** é o processo contínuo de planeamento, controlo e reconciliação dos fluxos financeiros (entradas e saídas de liquidez) de uma organização.

### Objetivos e Importância:
- **Garantia de Solvabilidade:** Assegurar que a empresa disponha sempre de saldo suficiente para liquidar compromissos imediatos (salários, fornecedores, impostos e contas correntes).
- **Prevenção de Custos Financeiros:** Evitar a utilização de descobertos bancários e empréstimos de curto prazo com juros onerosos.
- **Conciliação Diária:** Em Moçambique, a integração diária de recebimentos via POS, M-Pesa, E-Mola e transferências bancárias com as faturas a pagar permite manter a tesouraria equilibrada.`;
  }

  // 2. Bhaskara / Equação Quadrática / Fórmula Resolvente / Discriminante Delta
  if (
    p.includes('baskara') ||
    p.includes('bhaskara') ||
    p.includes('quadrática') ||
    p.includes('quadratica') ||
    p.includes('resolvente') ||
    p.includes('delta') ||
    p.includes('x²') ||
    p.includes('x^2') ||
    p.includes('segundo grau')
  ) {
    return `# Fórmula Resolvente e Equações Quadráticas

Para determinar as raízes reais de uma equação quadrática ax² + bx + c = 0 (onde a ≠ 0):

### 1. Discriminante Delta (Δ)
\`\`\`math
Δ = b² − 4ac
\`\`\`
- **Δ > 0:** Duas raízes reais distintas (x₁ ≠ x₂)
- **Δ = 0:** Uma raiz real dupla (x₁ = x₂)
- **Δ < 0:** Sem soluções no conjunto dos números reais (R)

### 2. Fórmula Resolvente
\`\`\`math
x = (-b ± √Δ) / 2a
\`\`\`

### Exemplo: x² − 5x + 6 = 0
- a = 1, b = −5, c = 6
- Δ = (−5)² − 4(1)(6) = 25 − 24 = 1
- Com √1 = 1:
\`\`\`math
x = (5 ± 1) / 2
\`\`\`
- x₁ = (5 + 1) / 2 = 3
- x₂ = (5 − 1) / 2 = 2
- **Solução:** S = { 2, 3 }`;
  }

  // 3. Cálculo de IVA / Finanças / Contabilidade em Moçambique
  if (
    p.includes('iva') ||
    p.includes('imposto') ||
    p.includes('irps') ||
    p.includes('irpc') ||
    p.includes('factura') ||
    p.includes('fatura') ||
    p.includes('contabilidade') ||
    p.includes('metical')
  ) {
    return `# Cálculo do IVA (16%) em Moçambique

O **Imposto sobre o Valor Acrescentado (IVA)** em Moçambique é regulado pela Autoridade Tributária de Moçambique (AT) com a taxa geral de **16%**.

### Fórmulas de Cálculo:
\`\`\`math
Valor do IVA = Valor Base × 0,16
\`\`\`
\`\`\`math
Total a Facturar = Valor Base × 1,16
\`\`\`

### Exemplo Prático:
Para uma prestação de serviços no valor de 45.000 MT:
- IVA (16%): 45.000 MT × 0,16 = 7.200 MT
- Total Facturado: 45.000 MT + 7.200 MT = 52.200 MT

**Lançamento no PGC-NIRF:**
- **Débito:** Conta 4.1.1 (Clientes) = 52.200 MT
- **Crédito:** Conta 7.1.1 (Vendas/Serviços) = 45.000 MT
- **Crédito:** Conta 4.4.3 (Estado - IVA Liquidado) = 7.200 MT`;
  }

  // 4. Monografia / Metodologia de Investigação Científica / Normas UEM & UP / APA 7
  if (
    p.includes('monografia') ||
    p.includes('metodologia') ||
    p.includes('normas') ||
    p.includes('uem') ||
    p.includes('up') ||
    p.includes('apa') ||
    p.includes('abnt') ||
    p.includes('tema') ||
    p.includes('objectivo')
  ) {
    return `# Normas Metodológicas e Estrutura de Monografia (${institution})

A elaboração de trabalhos de investigação científica e monografias em Moçambique obedece a uma estrutura padronizada:

### Estrutura Formal:
1. **Elementos Pré-textuais:** Capa, Folha de Rosto, Ficha de Aprovação, Resumo em Português (com palavras-chave), Abstract em Inglês e Índice Geral.
2. **Elementos Textuais:**
   - **Introdução:** Contextualização, Problema de Pesquisa, Hipóteses, Objetivos (Geral e Específicos) e Justificativa.
   - **Revisão da Literatura:** Enquadramento teórico e estado da arte.
   - **Metodologia:** Tipo de pesquisa, população/amostra, técnicas e instrumentos de recolha de dados.
   - **Apresentação e Discussão dos Resultados:** Análise crítica dos dados obtidos.
3. **Elementos Pós-textuais:** Conclusões, Recomendações e Referências Bibliográficas (APA 7ª Edição ou Normas UEM/UP).`;
  }

  // 5. Física / Mecânica / MRUV
  if (
    p.includes('física') ||
    p.includes('fisica') ||
    p.includes('velocidade') ||
    p.includes('aceleração') ||
    p.includes('newton')
  ) {
    return `# Movimento Retilíneo Uniformemente Variado (MRUV)

No **MRUV**, a aceleração é constante e diferente de zero, fazendo com que a velocidade varie de maneira uniforme ao longo do tempo.

### Equações Fundamentais:
\`\`\`math
v = v₀ + a · t
\`\`\`
\`\`\`math
s = s₀ + v₀ · t + (1/2) · a · t²
\`\`\`
\`\`\`math
v² = v₀² + 2 · a · Δs
\`\`\`

### Exemplo Resolvido:
Um veículo parte do repouso (v₀ = 0 m/s) com aceleração constante de 2 m/s² durante 10 segundos:
- **Velocidade final:** v = 0 + (2 × 10) = 20 m/s (72 km/h)
- **Distância percorrida:** Δs = 0 × 10 + (1/2) × 2 × (10)² = 100 metros`;
  }

  // 6. Resposta Geral Pedagógica
  return `# Resposta Académica (${course} — ${institution})

Olá! Aqui está a resposta e o esclarecimento para a tua dúvida:

${prompt}

### Explicação e Conceitos Centrais:
Com base no currículo académico de ${institution}, o domínio desta matéria exige a compreensão dos conceitos fundamentais e a sua aplicação prática na resolução de exercícios e casos reais.

Se precisares de passos adicionais ou de um exemplo específico, diz-me para detalharmos!`;
}
