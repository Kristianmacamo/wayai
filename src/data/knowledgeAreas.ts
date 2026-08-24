export interface KnowledgeArea {
  id: string;
  name: string;
  icon: string;
  badgeColor: string;
  description: string;
  sampleQuestion: string;
  sampleFormula: {
    question: string;
    explanation: string;
    application: string;
    exercise: string;
    response: string;
    summary: string;
  };
}

export const KNOWLEDGE_AREAS: KnowledgeArea[] = [
  {
    id: 'historia',
    name: 'História',
    icon: '🏛️',
    badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    description: 'História de Moçambique, África e História Mundial contemporânea.',
    sampleQuestion: 'Qual foi o impacto dos Acordos de Lusaka na independência de Moçambique?',
    sampleFormula: {
      question: 'O que foram os Acordos de Lusaka e qual a sua relevância histórica?',
      explanation: 'Os Acordos de Lusaka foram assinados a 7 de Setembro de 1974 entre a FRELIMO e o Estado Português, estabelecendo o cessar-fogo e a criação de um Governo de Transição que culminou com a Proclamação da Independência Nacional a 25 de Junho de 1975.',
      application: 'Permite compreender a transição de soberania, a cidadania e a formação do Estado moçambicano.',
      exercise: 'Identifica duas cláusulas fundamentais consagradas nos Acordos de Lusaka.',
      response: '1. Reconhecimento formal da FRELIMO como única e legítima representante do povo moçambicano; 2. Fixação da data da Independência Nacional para 25 de Junho de 1975.',
      summary: 'Os Acordos de Lusaka formalizaram o fim de 10 anos de Luta Armada de Libertação Nacional e abriram caminho para a República Popular de Moçambique.',
    },
  },
  {
    id: 'geografia',
    name: 'Geografia',
    icon: '🌍',
    badgeColor: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    description: 'Geografia física, económica, bacias hidrográficas, clima e ordenamento do território em Moçambique e no mundo.',
    sampleQuestion: 'Quais são as principais bacias hidrográficas de Moçambique e o seu potencial agropecuário?',
    sampleFormula: {
      question: 'Qual é a importância da Bacia Hidrográfica do Zambeze para Moçambique?',
      explanation: 'A Bacia do Zambeze é a maior bacia hidrográfica do país, atravessando as províncias de Tete, Sofala, Manica e Zambézia, abrigando o Empreendimento Hidroeléctrico de Cahora Bassa (HCB).',
      application: 'Geração de energia hidroelétrica para Moçambique e para a região da SADC, além de irrigação agrícola no vale.',
      exercise: 'Menciona dois afluentes principais do rio Zambeze em território moçambicano.',
      response: 'Os rios Luenha e Chire.',
      summary: 'O Zambeze é a espinha dorsal energética e de regadio do centro de Moçambique.',
    },
  },
  {
    id: 'matematica',
    name: 'Matemática',
    icon: '📐',
    badgeColor: 'bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-300 border-blue-300 dark:border-blue-800',
    description: 'Álgebra, Análise Matemática, Geometria, Estatística, Probabilidade e Funções.',
    sampleQuestion: 'Como resolver uma equação quadrática pela fórmula resolvente e discriminante Delta?',
    sampleFormula: {
      question: 'Como calcular as raízes da equação 2x² − 8x + 6 = 0?',
      explanation: 'Identificam-se os coeficientes a=2, b=-8, c=6. Calcula-se Δ = b² − 4ac e aplica-se x = (-b ± √Δ) / 2a.',
      application: 'Modelação de trajetórias, cálculo de lucro máximo e minimização de custos nas empresas.',
      exercise: 'Calcula o discriminante Δ para 2x² − 8x + 6 = 0.',
      response: 'Δ = (-8)² − 4(2)(6) = 64 − 48 = 16. As raízes são x₁ = 3 e x₂ = 1.',
      summary: 'Como Δ > 0, a equação tem duas soluções reais distintas: S = {1, 3}.',
    },
  },
  {
    id: 'portugues',
    name: 'Português',
    icon: '✍️',
    badgeColor: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
    description: 'Gramática, sintaxe, redação académica, textos expositivo-argumentativos e literatura moçambicana.',
    sampleQuestion: 'Quais são as características fundamentais de um texto expositivo-explicativo?',
    sampleFormula: {
      question: 'O que caracteriza a estrutura de um texto expositivo-argumentativo?',
      explanation: 'O texto expositivo-argumentativo visa convencer o leitor sobre uma tese através de argumentos válidos, articulados por conectores discursivos lógicos e uma conclusão consistente.',
      application: 'Elaboração de ensaios, justificativas de projetos de pesquisa e debates académicos.',
      exercise: 'Distingue tese de argumento com um exemplo.',
      response: 'Tese: A leitura precoce melhora o rendimento escolar. Argumento: Estudos comprovam que crianças que leem desenvolvem 40% mais vocabulário.',
      summary: 'A clareza dos articuladores e a coerência entre tese e argumentos garantem o rigor textual.',
    },
  },
  {
    id: 'ciencias',
    name: 'Ciências',
    icon: '🔬',
    badgeColor: 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300 border-teal-300 dark:border-teal-800',
    description: 'Ciências Naturais, ecologia, biodiversidade e sustentabilidade ambiental.',
    sampleQuestion: 'Como funciona o ciclo da água e o impacto das alterações climáticas em Moçambique?',
    sampleFormula: {
      question: 'Qual é o processo da fotossíntese nas plantas?',
      explanation: 'A fotossíntese é o processo biológico pelo qual plantas autotróficas convertem dióxido de carbono (CO₂) e água (H₂O) em glicose (C₆H₁₂O₆) e oxigénio (O₂) utilizando a luz solar captada pela clorofila.',
      application: 'Produção de alimentos na agricultura moçambicana e manutenção do oxigénio atmosférico.',
      exercise: 'Qual é a molécula de gás libertada para a atmosfera durante a fase clara da fotossíntese?',
      response: 'O oxigénio (O₂), resultante da fotólise da água.',
      summary: 'A fotossíntese é a base primária da cadeia trófica de todos os ecossistemas.',
    },
  },
  {
    id: 'biologia',
    name: 'Biologia',
    icon: '🧬',
    badgeColor: 'bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-300 border-green-300 dark:border-green-800',
    description: 'Citologia, genética mendeliana, fisiologia humana, saúde pública (malária, cólera, nutrição).',
    sampleQuestion: 'Como se transmitem e previnem as doenças endémicas como a malária em Moçambique?',
    sampleFormula: {
      question: 'Qual é o mecanismo de hereditariedade da Primeira Lei de Mendel?',
      explanation: 'A 1ª Lei de Mendel (Lei da Segregação dos Factores) postula que cada característica hereditária é determinada por dois alelos que se separam durante a formação dos gâmetas.',
      application: 'Melhoramento genético de sementes de milho e feijão resistentes a pragas nas machambas.',
      exercise: 'Num cruzamento Aa × Aa, qual a proporção fenotípica esperada com dominância completa?',
      response: 'Proporção 3:1 (75% fenótipo dominante, 25% fenótipo recessivo).',
      summary: 'A segregação independente dos alelos permite prever probabilidades genéticas rigorosas.',
    },
  },
  {
    id: 'fisica',
    name: 'Física',
    icon: '⚡',
    badgeColor: 'bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300 border-sky-300 dark:border-sky-800',
    description: 'Mecânica clássica, termodinâmica, electromagnetismo, óptica e ondas.',
    sampleQuestion: 'Como aplicar a 2ª Lei de Newton e a conservação de energia mecânica?',
    sampleFormula: {
      question: 'O que afirma a Segunda Lei de Newton (Princípio Fundamental da Dinâmica)?',
      explanation: 'A força resultante que actua sobre um corpo é directamente proporcional ao produto da sua massa pela aceleração adquirida (F = m · a).',
      application: 'Engenharia civil, transporte ferroviário dos CFM e segurança automóvel nas estradas nacionais.',
      exercise: 'Um camião de 4.000 kg acelera a 2,5 m/s². Qual a força resultante aplicada?',
      response: 'F = 4.000 kg × 2,5 m/s² = 10.000 N (Newtons).',
      summary: 'A aceleração é proporcional à força e inversamente proporcional à massa.',
    },
  },
  {
    id: 'quimica',
    name: 'Química',
    icon: '🧪',
    badgeColor: 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    description: 'Química Geral, estequiometria, equilíbrio químico, termoquímica e química orgânica.',
    sampleQuestion: 'Como acertar reacções de oxirredução e calcular concentrações molares?',
    sampleFormula: {
      question: 'Como calcular a concentração molar de uma solução?',
      explanation: 'A concentração molar (M) é a razão entre o número de moles de soluto (n) e o volume da solução em litros (V), onde n = massa / massa molar.',
      application: 'Controlo de qualidade em laboratórios de água potável e indústrias farmacêuticas.',
      exercise: 'Calcula a molaridade de 40g de NaOH (M=40 g/mol) dissolvidos em 2 litros de água.',
      response: 'n = 40g / (40 g/mol) = 1 mol. Concentração M = 1 mol / 2 L = 0,5 mol/L.',
      summary: 'A concentração de 0,5 M expressa a quantidade de matéria por unidade de volume.',
    },
  },
  {
    id: 'gestao',
    name: 'Gestão',
    icon: '💼',
    badgeColor: 'bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-300 border-violet-300 dark:border-violet-800',
    description: 'Gestão estratégica, recursos humanos, planeamento operacional, liderança e PMEs.',
    sampleQuestion: 'O que é a análise SWOT (FOFA) e como aplicá-la numa empresa moçambicana?',
    sampleFormula: {
      question: 'O que é a Gestão de Caixa e qual a sua importância nas empresas?',
      explanation: 'Gestão de caixa é o planeamento, controlo e acompanhamento de todas as entradas e saídas de dinheiro (fluxo de caixa) de uma organização para assegurar a sua liquidez e solvabilidade.',
      application: 'Uma PME em Maputo utiliza a gestão de caixa diária para honrar salários, pagar a fornecedores e evitar endividamentos desnecessários.',
      exercise: 'Indica a consequência de uma empresa com lucros contabilísticos mas com fluxo de caixa negativo.',
      response: 'Crise de liquidez técnica, impossibilidade de cumprir compromissos imediatos (default operacional).',
      summary: 'A liquidez garante a sobrevivência operacional diária, enquanto o lucro assegura a rentabilidade a longo prazo.',
    },
  },
  {
    id: 'contabilidade',
    name: 'Contabilidade',
    icon: '📊',
    badgeColor: 'bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800',
    description: 'Plano Geral de Contabilidade (PGC-NIRF), lançamentos a débito e crédito, balanço e demonstração de resultados.',
    sampleQuestion: 'Como efectuar o lançamento contabilístico de compras a prazo com IVA de 16%?',
    sampleFormula: {
      question: 'Qual é a Equação Fundamental da Contabilidade?',
      explanation: 'O Activo de uma entidade é sempre igual à soma do Passivo com o Capital Próprio (Activo = Passivo + Capital Próprio).',
      application: 'Elaboração do Balanço Patrimonial anual de acordo com o PGC-NIRF em Moçambique.',
      exercise: 'Se uma empresa tem Activo de 500.000 MT e Passivo de 180.000 MT, qual é o seu Capital Próprio?',
      response: 'Capital Próprio = 500.000 MT − 180.000 MT = 320.000 MT.',
      summary: 'Todos os recursos económicos (Activo) são financiados por terceiros (Passivo) ou pelos sócios (Capital Próprio).',
    },
  },
  {
    id: 'economia',
    name: 'Economia',
    icon: '📈',
    badgeColor: 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-800',
    description: 'Microeconomia, Macroeconomia, inflação, taxas de juro (MIMO do Banco de Moçambique), PIB e comércio externo.',
    sampleQuestion: 'Como a política monetária do Banco de Moçambique influencia a taxa de inflação e o Metical?',
    sampleFormula: {
      question: 'Como se calcula o Produto Interno Bruto (PIB) pela óptica da despesa?',
      explanation: 'O PIB pela óptica da despesa é calculado por PIB = Consumo Privado (C) + Investimento (I) + Gastos Públicos (G) + Exportações Líquidas (X − M).',
      application: 'Avaliação do crescimento económico nacional face à exploração de gás natural e agricultura.',
      exercise: 'Se C=200, I=50, G=70, X=80, M=100 (em milhões de MT), calcula o PIB.',
      response: 'PIB = 200 + 50 + 70 + (80 − 100) = 320 − 20 = 300 milhões de MT.',
      summary: 'O PIB mede o valor de mercado de todos os bens e serviços finais produzidos no país num período.',
    },
  },
  {
    id: 'informatica',
    name: 'Informática',
    icon: '💻',
    badgeColor: 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 border-purple-300 dark:border-purple-800',
    description: 'Algoritmos, programação, bases de dados SQL, redes de computadores e inteligência artificial.',
    sampleQuestion: 'Como construir uma consulta SQL com JOIN para cruzar tabelas de estudantes e notas?',
    sampleFormula: {
      question: 'O que é uma chave primária (Primary Key) numa Base de Dados Relacional?',
      explanation: 'A Chave Primária é um atributo ou conjunto de atributos que identifica de forma única e inequívoca cada registo numa tabela, impedindo duplicados e valores nulos.',
      application: 'Sistemas de gestão académica de universidades como o SIGA da UEM ou e-SISTAFE do Ministério das Finanças.',
      exercise: 'Dá um exemplo de atributo ideal para chave primária num sistema de estudantes.',
      response: 'O Número de Matrícula do Estudante ou o Número de BI/NUIT.',
      summary: 'A integridade referencial depende de chaves primárias bem definidas.',
    },
  },
  {
    id: 'conhecimento-geral',
    name: 'Conhecimento Geral',
    icon: '🧠',
    badgeColor: 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700',
    description: 'Cultura geral, raciocínio lógico, atualidades, cidadania e preparação para entrevistas de emprego.',
    sampleQuestion: 'Quais os pilares fundamentais da cidadania activa e do estado de direito?',
    sampleFormula: {
      question: 'Qual a diferença entre ética e moral?',
      explanation: 'Moral refere-se ao conjunto de regras, costumes e valores adquiridos por uma sociedade ou grupo cultural; Ética é a reflexão filosófica e crítica sobre os princípios que fundamentam essas regras morais.',
      application: 'Conduta profissional nas instituições públicas e privadas em Moçambique.',
      exercise: 'Apresenta um dilema ético comum no ambiente universitário.',
      response: 'O plágio académico vs. a honestidade intelectual na redação de trabalhos.',
      summary: 'A ética orienta a conduta com base na integridade e respeito pelo colectivo.',
    },
  },
  {
    id: 'conhecimento-mocambique',
    name: 'Conhecimento de Moçambique',
    icon: '🇲🇿',
    badgeColor: 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
    description: 'Constituição da República, divisões administrativas, símbolos nacionais, heróis nacionais e recursos naturais.',
    sampleQuestion: 'Quais são as 11 províncias de Moçambique, suas capitais e divisões regionais (Norte, Centro, Sul)?',
    sampleFormula: {
      question: 'Quais são as três regiões geopolíticas de Moçambique e suas províncias?',
      explanation: 'Norte (Niassa, Cabo Delgado, Nampula); Centro (Zambézia, Tete, Manica, Sofala); Sul (Inhambane, Gaza, Província de Maputo e Cidade de Maputo - capital do país).',
      application: 'Planeamento territorial, exames de admissão e concurso público de ingresso.',
      exercise: 'Qual é a província mais populosa de Moçambique segundo o INE?',
      response: 'Nampula (seguida de perto pela província da Zambézia).',
      summary: 'Moçambique tem 11 províncias distribuídas estrategicamente pelas 3 grandes regiões.',
    },
  },
  {
    id: 'conhecimento-mundial',
    name: 'Conhecimento Mundial',
    icon: '🌐',
    badgeColor: 'bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300 border-teal-300 dark:border-teal-800',
    description: 'Geopolítica internacional, Nações Unidas (ONU), União Africana (UA), SADC e economia global.',
    sampleQuestion: 'Qual é o papel da SADC na cooperação económica e na segurança regional na África Austral?',
    sampleFormula: {
      question: 'O que é a SADC (Comunidade de Desenvolvimento da África Austral)?',
      explanation: 'A SADC é uma organização regional composta por 16 Estados-membros que visa promover o crescimento económico, a paz, a segurança e a integração socioeconómica na África Austral.',
      application: 'Livre circulação de bens e energia (Corredores de Maputo, Beira e Nacala).',
      exercise: 'Qual é a sede oficial da SADC?',
      response: 'Gaborone, capital do Botswana.',
      summary: 'Moçambique é membro fundador estratégico da SADC devido à sua saída para o Oceano Índico.',
    },
  },
  {
    id: 'cultura-mocambicana',
    name: 'Cultura Moçambicana',
    icon: '🥁',
    badgeColor: 'bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-300 border-orange-300 dark:border-orange-800',
    description: 'Línguas nacionais moçambicanas, danças tradicionais (Timbila Chopi, Tufo, Makwaela), literatura de José Craveirinha e Mia Couto.',
    sampleQuestion: 'Qual a relevância da Timbila Chopi como Património Imaterial da Humanidade pela UNESCO?',
    sampleFormula: {
      question: 'O que é a Timbila Chopi e qual a sua consagração cultural?',
      explanation: 'A Timbila é um instrumento musical tradicional xilofónico do povo Chopi (Província de Inhambane), reconhecida pela UNESCO como Obra-Prima do Património Oral e Imaterial da Humanidade em 2005.',
      application: 'Preservação da identidade cultural, etnomusicologia e turismo cultural em Moçambique.',
      exercise: 'De que madeira nobre é tradicionalmente construída a Timbila Chopi?',
      response: 'Da madeira da árvore M`bila (sneezewood).',
      summary: 'A Timbila representa a mestria e sofisticação da expressão artística tradicional moçambicana.',
    },
  },
  {
    id: 'educacao-inclusiva',
    name: 'Educação Inclusiva',
    icon: '🤝',
    badgeColor: 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-300 border-rose-300 dark:border-rose-800',
    description: 'Pedagogia inclusiva, adaptações curriculares, Língua de Sinais de Moçambique e equidade de género no ensino.',
    sampleQuestion: 'Como implementar estratégias de educação inclusiva para alunos com Necessidades Educativas Especiais (NEE)?',
    sampleFormula: {
      question: 'O que significa Educação Inclusiva no contexto escolar?',
      explanation: 'Educação Inclusiva é o processo de reestruturação das políticas, culturas e práticas escolares para atender à diversidade de todos os estudantes, independentemente de condições físicas, intelectuais, sociais ou linguísticas.',
      application: 'Adaptação de salas de aula, material em Braille e formação de professores nas escolas primárias e secundárias.',
      exercise: 'Indica uma barreira comum enfrentada por estudantes com deficiência visual e uma solução inclusiva.',
      response: 'Barreira: Ausência de manuais em formato acessível. Solução: Disponibilização de leitores de ecrã e livros em Braille.',
      summary: 'A educação inclusiva é um direito humano inalienável que valoriza a diversidade como força educativa.',
    },
  },
  {
    id: 'metodologia-investigacao',
    name: 'Metodologia de Investigação',
    icon: '📚',
    badgeColor: 'bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800',
    description: 'Normas APA 7ª Edição, Normas da UEM / UP, formulação de hipóteses, amostragem e escrita científica.',
    sampleQuestion: 'Como estruturar uma introdução científica completa com contextualização, problema, hipóteses e objetivos?',
    sampleFormula: {
      question: 'Como formular uma Pergunta de Partida (Problema de Pesquisa) rigorosa?',
      explanation: 'A pergunta de partida deve ser clara, precisa, exequível e pertinente, estabelecendo uma relação entre duas ou mais variáveis num contexto espacial e temporal delimitado.',
      application: 'Início de monografias, dissertações de mestrado e artigos científicos em Moçambique.',
      exercise: 'Identifica o erro na seguinte pergunta: "Por que as empresas falham?"',
      response: 'É demasiado ampla e vaga; deve ser delimitada (ex: "Quais os factores financeiros que determinaram a insolvência das microempresas de restauração em Maputo entre 2021 e 2023?").',
      summary: 'A formulação correcta do problema é o alicerce de todo o trabalho científico.',
    },
  },
];

export const PLATFORM_MISSION =
  'Way Estudantes AI pretende ser o assistente académico inteligente dos estudantes de Moçambique, oferecendo explicações claras, exercícios práticos, aplicações reais e conhecimento adaptado à realidade moçambicana.';

export const PLATFORM_PURPOSES = [
  'Tirar dúvidas académicas em tempo real',
  'Explicar conteúdos didaticamente passo a passo',
  'Resolver exercícios e problemas analíticos',
  'Criar resumos executivos e fichamentos',
  'Apoiar trabalhos académicos completos por páginas',
  'Preparar para testes, frequências e exames de admissão',
  'Ensinar conhecimentos de Moçambique e do mundo',
];

export const PLATFORM_LIMITATIONS =
  'O objetivo principal da plataforma é estritamente educativo. O sistema não deve ser utilizado para atividades ilegais, fraude, invasão de contas ou conteúdos inadequados.';

export const EDUCATIONAL_FORMULA = {
  title: 'Fórmula Pedagógica do Chat AI',
  steps: [
    { name: 'Pergunta', desc: 'A questão ou tema académico formulado pelo estudante.' },
    { name: 'Explicação', desc: 'Conceito teórico claro e didático com vocabulário acessível.' },
    { name: 'Aplicação', desc: 'Como o conceito é utilizado na vida real, empresas e contexto moçambicano.' },
    { name: 'Exercício', desc: 'Pequena atividade prática ou problema de fixação.' },
    { name: 'Resposta', desc: 'Resolução comentada passo a passo com critérios claros.' },
    { name: 'Resumo', desc: 'Principais pontos e conclusões essenciais aprendidas.' },
  ],
};

export const ACADEMIC_WORK_PAGES_OPTIONS = [3, 6, 12, 18] as const;

export const ACADEMIC_WORK_SECTIONS = [
  { id: 'capa', title: '1. Capa e Identificação Institucional' },
  { id: 'introducao', title: '2. Introdução (Problema, Hipóteses e Objectivos)' },
  { id: 'desenvolvimento', title: '3. Desenvolvimento e Fundamentação Teórica' },
  { id: 'aplicacao', title: '4. Aplicação Prática e Estudo de Caso' },
  { id: 'exercicios', title: '5. Exercícios ou Exemplos Práticos' },
  { id: 'respostas', title: '6. Respostas e Análise Crítica' },
  { id: 'resumo', title: '7. Resumo Executivo do Trabalho' },
  { id: 'conclusao', title: '8. Conclusão e Recomendações' },
  { id: 'referencias', title: '9. Referências Bibliográficas (APA 7ª / UEM / UP)' },
];
