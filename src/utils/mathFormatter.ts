/**
 * Utility to clean mathematical text and eliminate all raw LaTeX artifacts ($ \Delta \frac \sqrt \cdot etc.)
 * Converts them into crystal-clear, human-readable Unicode mathematical expressions.
 */

// Mapping of Greek letters and common math symbols
const LATEX_SYMBOL_MAP: Record<string, string> = {
  '\\Delta': 'Δ',
  '\\delta': 'δ',
  '\\pi': 'π',
  '\\Pi': 'Π',
  '\\theta': 'θ',
  '\\Theta': 'Θ',
  '\\alpha': 'α',
  '\\beta': 'β',
  '\\gamma': 'γ',
  '\\Gamma': 'Γ',
  '\\lambda': 'λ',
  '\\Lambda': 'Λ',
  '\\mu': 'μ',
  '\\sigma': 'σ',
  '\\Sigma': '∑',
  '\\omega': 'ω',
  '\\Omega': 'Ω',
  '\\phi': 'φ',
  '\\Phi': 'Φ',
  '\\epsilon': 'ε',
  '\\rho': 'ρ',
  '\\tau': 'τ',
  '\\cdot': ' · ',
  '\\times': ' × ',
  '\\pm': '±',
  '\\mp': '∓',
  '\\le': '≤',
  '\\leq': '≤',
  '\\ge': '≥',
  '\\geq': '≥',
  '\\neq': '≠',
  '\\approx': '≈',
  '\\equiv': '≡',
  '\\infty': '∞',
  '\\sum': '∑',
  '\\int': '∫',
  '\\iint': '∬',
  '\\iiint': '∭',
  '\\oint': '∮',
  '\\partial': '∂',
  '\\nabla': '∇',
  '\\in': '∈',
  '\\notin': '∉',
  '\\subset': '⊂',
  '\\subseteq': '⊆',
  '\\cup': '∪',
  '\\cap': '∩',
  '\\to': '→',
  '\\rightarrow': '→',
  '\\leftarrow': '←',
  '\\Rightarrow': '⇒',
  '\\Leftarrow': '⇐',
  '\\Leftrightarrow': '⇔',
  '\\forall': '∀',
  '\\exists': '∃',
  '\\empty': '∅',
  '\\emptyset': '∅',
  '\\circ': '°',
  '\\angle': '∠',
  '\\perp': '⊥',
};

// Superscript digits mapping
const SUPERSCRIPT_MAP: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '+': '⁺',
  '-': '⁻',
  '=': '⁼',
  '(': '⁽',
  ')': '⁾',
  'n': 'ⁿ',
  'x': 'ˣ',
  'y': 'ʸ',
  'i': 'ⁱ',
  't': 'ᵗ',
};

// Subscript digits mapping
const SUBSCRIPT_MAP: Record<string, string> = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
  '+': '₊',
  '-': '₋',
  '=': '₌',
  '(': '₍',
  ')': '₎',
  'a': 'ₐ',
  'e': 'ₑ',
  'o': 'ₒ',
  'x': 'ₓ',
  'i': 'ᵢ',
  'j': 'ⱼ',
  'k': 'ₖ',
  'n': 'ₙ',
  'm': 'ₘ',
  'p': 'ₚ',
  't': 'ₜ',
};

/**
 * Replaces superscript like ^2, ^{2}, ^{n+1} into Unicode superscripts
 */
function replaceSuperscripts(str: string): string {
  // Replace ^{...}
  let res = str.replace(/\^{([^}]+)}/g, (_, p1) => {
    return p1
      .split('')
      .map((ch: string) => SUPERSCRIPT_MAP[ch] || ch)
      .join('');
  });

  // Replace ^0 through ^9, ^n, ^x, ^2, ^3
  res = res.replace(/\^([0-9nxyt+-])/g, (_, ch) => {
    return SUPERSCRIPT_MAP[ch] || ch;
  });

  return res;
}

/**
 * Replaces subscript like _1, _{1}, _{max} into Unicode subscripts
 */
function replaceSubscripts(str: string): string {
  // Replace _{...}
  let res = str.replace(/_{([^}]+)}/g, (_, p1) => {
    return p1
      .split('')
      .map((ch: string) => SUBSCRIPT_MAP[ch] || ch)
      .join('');
  });

  // Replace _0 through _9, _i, _n
  res = res.replace(/_([0-9aeoxijkmtnp+-])/g, (_, ch) => {
    return SUBSCRIPT_MAP[ch] || ch;
  });

  return res;
}

/**
 * Replaces \frac{numerator}{denominator} with (numerator) / (denominator) or numerator / denominator
 */
function replaceFractions(str: string): string {
  let result = str;
  // Match \frac{a}{b}
  const fracRegex = /\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g;
  while (fracRegex.test(result)) {
    result = result.replace(fracRegex, (match, num, den) => {
      const cleanNum = cleanMathString(num).trim();
      const cleanDen = cleanMathString(den).trim();
      const needsParenNum = cleanNum.includes('+') || cleanNum.includes('−') || cleanNum.includes('-');
      const needsParenDen = cleanDen.includes('+') || cleanDen.includes('−') || cleanDen.includes('-') || cleanDen.includes('·') || cleanDen.includes('×') || cleanDen.includes(' ');
      
      const numPart = needsParenNum ? `(${cleanNum})` : cleanNum;
      const denPart = needsParenDen ? `(${cleanDen})` : cleanDen;
      return `${numPart} / ${denPart}`;
    });
  }

  // Also catch shorthand like \frac a b or \frac1 2
  result = result.replace(/\\frac\s*([a-zA-Z0-9])\s*([a-zA-Z0-9])/g, '$1 / $2');
  return result;
}

/**
 * Replaces \sqrt[n]{x} and \sqrt{x}
 */
function replaceSquareRoots(str: string): string {
  let result = str;
  // Match \sqrt[n]{x}
  result = result.replace(/\\sqrt\s*\[([^\]]+)\]\s*\{([^{}]+)\}/g, (match, n, inner) => {
    const cleanN = replaceSuperscripts(`^${n.trim()}`);
    const cleanInner = cleanMathString(inner).trim();
    return `${cleanN}√(${cleanInner})`;
  });

  // Match \sqrt{x}
  const sqrtRegex = /\\sqrt\s*\{([^{}]+)\}/g;
  while (sqrtRegex.test(result)) {
    result = result.replace(sqrtRegex, (match, inner) => {
      const cleanInner = cleanMathString(inner).trim();
      if (/^[a-zA-Z0-9Δδπθ]+$/.test(cleanInner)) {
        return `√${cleanInner}`;
      }
      return `√(${cleanInner})`;
    });
  }

  // Match bare \sqrt x
  result = result.replace(/\\sqrt\s*([a-zA-Z0-9Δδ])/g, '√$1');
  return result;
}

/**
 * Core cleaner: transforms any mathematical snippet from LaTeX into clean Unicode.
 */
export function cleanMathString(mathStr: string): string {
  if (!mathStr) return '';

  let clean = mathStr;

  // 1. Remove LaTeX formatting commands like \text{...}, \mathbf{...}, \mathrm{...}, \quad, \qquad, \left, \right
  clean = clean.replace(/\\text\s*\{([^}]*)\}/g, '$1');
  clean = clean.replace(/\\mathbf\s*\{([^}]*)\}/g, '$1');
  clean = clean.replace(/\\mathrm\s*\{([^}]*)\}/g, '$1');
  clean = clean.replace(/\\mathit\s*\{([^}]*)\}/g, '$1');
  clean = clean.replace(/\\left\s*([(\[{|])/g, '$1');
  clean = clean.replace(/\\right\s*([)\]}|])/g, '$1');
  clean = clean.replace(/\\left\./g, '');
  clean = clean.replace(/\\right\./g, '');
  clean = clean.replace(/\\quad/g, '  ');
  clean = clean.replace(/\\qquad/g, '    ');
  clean = clean.replace(/\\[,;:!]/g, ' ');

  // 2. Process Fractions and Square Roots
  clean = replaceFractions(clean);
  clean = replaceSquareRoots(clean);

  // 3. Process Greek symbols & operators
  for (const [tex, unicode] of Object.entries(LATEX_SYMBOL_MAP)) {
    clean = clean.split(tex).join(unicode);
  }

  // 4. Process superscripts and subscripts
  clean = replaceSuperscripts(clean);
  clean = replaceSubscripts(clean);

  // 5. Replace any remaining LaTeX backslash commands if simple
  clean = clean.replace(/\\([a-zA-Z]+)/g, '$1');

  // 6. Clean up minus sign formatting: replace hyphen with minus symbol when surrounded by numbers/letters
  clean = clean.replace(/(\d|[a-zA-ZΔδπ])\s*-\s*(\d|[a-zA-ZΔδπ])/g, '$1 − $2');

  // 7. Strip any remaining curly braces that were LaTeX groupings
  clean = clean.replace(/[{}]/g, '');

  return clean.trim();
}

/**
 * Formats a full text response:
 * - Cleans math expressions inside $$ ... $$, $ ... $, and \[ ... \]
 * - Removes horizontal lines (---, ***, ___) to ensure pure whitespace separation
 * - Converts raw formulas into dedicated ```math ... ``` boxes
 */
export function formatAcademicAndMathContent(rawContent: string): string {
  if (!rawContent) return '';

  let text = rawContent;

  // 1. Remove horizontal rules (---, ***, ___) replacing them with clean spacing (no divider lines as requested)
  text = text.replace(/^[ \t]*[-*_]{3,}[ \t]*$/gm, '\n');

  // 2. Clean block math: $$ formula $$ or \[ formula \]
  text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, formula) => {
    const cleaned = cleanMathString(formula);
    return `\n\n\`\`\`math\n${cleaned}\n\`\`\`\n\n`;
  });

  text = text.replace(/\\\[([\s\S]*?)\\\]/g, (match, formula) => {
    const cleaned = cleanMathString(formula);
    return `\n\n\`\`\`math\n${cleaned}\n\`\`\`\n\n`;
  });

  // 3. Clean inline math: $ formula $ or \( formula \)
  text = text.replace(/\$([^\$\n]+?)\$/g, (match, formula) => {
    return cleanMathString(formula);
  });

  text = text.replace(/\\\(([\s\S]*?)\\\)/g, (match, formula) => {
    return cleanMathString(formula);
  });

  // 4. Clean any standalone LaTeX leftovers that might still be in raw text (e.g. \Delta, \frac, \sqrt, \cdot)
  for (const [tex, unicode] of Object.entries(LATEX_SYMBOL_MAP)) {
    text = text.split(tex).join(unicode);
  }
  text = replaceFractions(text);
  text = replaceSquareRoots(text);
  text = replaceSuperscripts(text);
  text = replaceSubscripts(text);

  // Strip any stray single $ symbols that might be used as delimiters
  text = text.replace(/(^|\s)\$([a-zA-Z0-9\s+=−\-*/()^._]+)\$(\s|$|[.,;:])/g, '$1$2$3');

  // 5. Ensure clean, spaced sections without redundant empty lines
  text = text.replace(/\n{4,}/g, '\n\n\n');

  return text;
}
