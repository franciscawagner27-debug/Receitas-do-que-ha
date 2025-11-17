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
 * Podes ir ajustando com o tempo.
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
 * Motor de pesquisa inteligente:
 * - OR entre termos (basta 1 bater)
 * - procura em ingredientes, título e tags
 * - devolve se faz match e quantos termos bateu (score)
 */
export function smartSearch(
  recipe: Recipe,
  rawSearch: string
): { matches: boolean; score: number } {
  const trimmed = (rawSearch || "").trim();
  if (!trimmed) {
    return { matches: true, score: 0 };
  }

  const normalizedSearch = normalize(trimmed);
  const terms = normalizedSearch
    .split(/[\s,;]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 1); // ignora coisas tipo "e", "de", etc.

  if (terms.length === 0) {
    return { matches: true, score: 0 };
  }

  const ingredients = Array.isArray((recipe as any).ingredients)
    ? (recipe as any).ingredients.map((ing: string) => normalize(String(ing)))
    : [];

  const title = normalize((recipe as any).title || "");

  const tags = Array.isArray((recipe as any).tags)
    ? (recipe as any).tags.map((tag: string) => normalize(String(tag)))
    : [];

  let matchedCount = 0;

  for (const term of terms) {
    const expanded = expandTerm(term);

    const termMatched = expanded.some((word) => {
      if (!word) return false;

      const inTitle = title.includes(word);
      const inIngredients = ingredients.some((ing) => ing.includes(word));
      const inTags = tags.some((tag) => tag.includes(word));

      return inTitle || inIngredients || inTags;
    });

    if (termMatched) {
      matchedCount++;
    }
  }

  const matches = matchedCount > 0;

  return { matches, score: matchedCount };
}
