// src/utils/smartSearch.ts
import type { Recipe } from "../types";

/**
 * Normaliza texto:
 * - minúsculas
 * - remove acentos
 */
function normalize(str: string): string {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Converte plural -> singular de forma simples (heurística)
 */
function toSingular(word: string): string {
  if (word.endsWith("es")) return word.slice(0, -2);
  if (word.endsWith("s")) return word.slice(0, -1);
  return word;
}

/**
 * Converte singular -> plural de forma simples (heurística)
 */
function toPlural(word: string): string {
  if (word.endsWith("s")) return word;
  if (word.endsWith("r") || word.endsWith("z") || word.endsWith("n")) {
    return word + "es";
  }
  return word + "s";
}

/**
 * Mapa de sinónimos (já normalizados em PT)
 */
const synonymMap: Record<string, string[]> = {
  // massas
  massa: [
    "esparguete",
    "espaguete",
    "espargete",
    "macarrao",
    "macarrão",
    "penne",
    "fusilli",
    "tagliatelle",
    "massa esparguete",
    "massa (esparguete)",
    "massa (penne)",
    "massa (fusilli)",
  ],
  esparguete: ["massa", "espaguete", "espargete", "macarrão", "macarrao"],
  espaguete: ["massa", "esparguete", "espargete", "macarrão", "macarrao"],
  espargete: ["massa", "esparguete", "espaguete", "macarrão", "macarrao"],

  // carne
  carne: ["frango", "porco", "vaca", "bife", "peru", "vitela"],
  frango: ["carne"],
  porco: ["carne"],
  vaca: ["carne", "bovino"],
  bife: ["carne"],
  peru: ["carne"],
  vitela: ["carne"],

  // peixe
  peixe: [
    "bacalhau",
    "atum",
    "salmao",
    "salmão",
    "pescada",
    "peixe branco",
    "dourada",
    "robalo",
    "marisco",
  ],
  bacalhau: ["peixe"],
  atum: ["peixe"],
  salmao: ["peixe"],
  "salmão": ["peixe"],
  pescada: ["peixe"],
  dourada: ["peixe"],
  robalo: ["peixe"],

  // básicos
  batata: ["batatas"],
  batatas: ["batata"],
  arroz: ["arroz carolino", "arroz agulha"],
  natas: ["nata", "creme culinario", "creme culinário", "creme de leite"],
  nata: ["natas"],

  // sobremesas
  doce: ["sobremesa", "sobremesas", "doces"],
  sobremesa: ["doce", "sobremesas", "doces"],
  sobremesas: ["doce", "sobremesa", "doces"],

  // airfryer
  airfryer: ["air fryer", "fritadeira sem oleo", "fritadeira sem óleo"],
  "air fryer": ["airfryer"],
};

/**
 * Ingredientes básicos / temperos a ignorar quando avaliamos "extras"
 * (podemos ir afinando com o tempo)
 */
const BASIC_INGREDIENTS = [
  "sal",
  "pimenta",
  "pimenta preta",
  "azeite",
  "oleo",
  "óleo",
  "alho",
  "cebola",
  "louro",
  "oregãos",
  "orégãos",
  "coentros",
  "salsa",
  "vinagre",
  "manteiga",
  "especiarias",
  "noz moscada",
];

const basicSet = new Set(BASIC_INGREDIENTS.map((b) => normalize(b)));

/**
 * Expande um termo em:
 * - ele próprio
 * - singular/plural
 * - sinónimos + respetivos singular/plural
 */
function expandTerm(term: string): string[] {
  const base = normalize(term);
  const forms = new Set<string>();

  const addForm = (w: string) => {
    const n = normalize(w);
    if (!n) return;
    forms.add(n);
    forms.add(toSingular(n));
    forms.add(toPlural(n));
  };

  addForm(base);

  const synonyms = synonymMap[base] || [];
  synonyms.forEach((s) => addForm(s));

  return Array.from(forms);
}

/**
 * Extrai "ingredientes de pesquisa" para efeitos de match perfeito:
 * dividimos sobretudo por vírgulas e ponto e vírgula,
 * ignoramos palavrinhas tipo "e", "de", etc.
 */
function extractSearchIngredientsForExact(rawSearch: string): string[] {
  return (rawSearch || "")
    .split(/[,;]+/)
    .map((p) => normalize(p.trim()))
    .filter((p) => p.length > 1 && !basicSet.has(p));
}

/**
 * A partir do array recipe.ingredients (jsonb),
 * devolve um array de strings normalizadas,
 * apenas com ingredientes "relevantes" (sem temperos básicos).
 */
function getRelevantRecipeIngredients(recipe: Recipe): string[] {
  const rawIngredients = Array.isArray((recipe as any).ingredients)
    ? (recipe as any).ingredients
    : [];

  const result: string[] = [];

  for (const ing of rawIngredients) {
    const norm = normalize(String(ing));

    // Se a linha do ingrediente contiver só coisas básicas (sal, pimenta, azeite...),
    // não a consideramos para efeitos de "extra".
    const isBasicLine = Array.from(basicSet).some((b) =>
      norm.includes(b)
    );

    if (!isBasicLine) {
      result.push(norm);
    }
  }

  return result;
}

/**
 * Motor de pesquisa inteligente:
 * - OR entre termos (basta 1 bater)
 * - procura em ingredientes, título e tags
 * - devolve:
 *   - matches: se bate minimamente
 *   - score: quantos termos bateram (para ordenação)
 *   - isExactMatch: se a receita só usa os ingredientes pesquisados (ignorando temperos)
 *   - extraCount: quantos ingredientes "a mais" tem (ignorando temperos)
 */
export function smartSearch(
  recipe: Recipe,
  rawSearch: string
): {
  matches: boolean;
  score: number;
  isExactMatch: boolean;
  extraCount: number;
  matchedIngredientCount: number;
} {
  const trimmed = (rawSearch || "").trim();

  if (!trimmed) {
    return {
      matches: true,
      score: 0,
      isExactMatch: false,
      extraCount: 0,
      matchedIngredientCount: 0,
    };
  }

  const normalizedSearch = normalize(trimmed);
  const searchTerms = normalizedSearch
    .split(/[\s,;]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1);

  if (searchTerms.length === 0) {
    return {
      matches: true,
      score: 0,
      isExactMatch: false,
      extraCount: 0,
      matchedIngredientCount: 0,
    };
  }

  // Ingredientes da receita normalizados
  const recipeIngredientsNormalized = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.map((ing: string) => normalize(String(ing)))
    : [];

  // Ingredientes relevantes (sem temperos)
  const recipeRelevantIngredients = getRelevantRecipeIngredients(recipe);

  // Expande os termos da pesquisa (sinónimos, plural, singular)
  const expandedSearchTerms = searchTerms.flatMap((term) =>
    expandTerm(term)
  );

  // -----------------------------
  // CONTAGEM DE INGREDIENTES BATIDOS
  // -----------------------------
  let matchedIngredientCount = 0;

  for (const recipeIng of recipeRelevantIngredients) {
    const matchesThisIngredient = expandedSearchTerms.some((expanded) =>
      recipeIng.includes(expanded)
    );
    if (matchesThisIngredient) {
      matchedIngredientCount++;
    }
  }

  const matches = matchedIngredientCount > 0;

  // -----------------------------
  // EXACT MATCH (sem extras)
  // -----------------------------
  const searchIngsExact = extractSearchIngredientsForExact(rawSearch);
  let extraCount = 0;
  let isExactMatch = false;

  if (searchIngsExact.length > 0) {
    const matchedSearchSet = new Set<string>();

    for (const rIng of recipeRelevantIngredients) {
      const matchedThisLine = searchIngsExact.some((s) => {
        if (!s) return false;
        const ok = rIng.includes(s);
        if (ok) matchedSearchSet.add(s);
        return ok;
      });

      if (!matchedThisLine) extraCount++;
    }

    const allSearchMatched = searchIngsExact.every((s) =>
      matchedSearchSet.has(s)
    );

    isExactMatch = allSearchMatched && extraCount === 0;
  }

  return {
    matches,
    score: matchedIngredientCount,
    isExactMatch,
    extraCount,
    matchedIngredientCount,
  };
}
