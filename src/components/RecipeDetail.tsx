import React from "react";
import type { Recipe } from "../types";
import { Volume2 } from "react-feather";
import { Link } from "react-router-dom";


// Palavras que não queremos usar como ingrediente principal
const STOPWORDS = [
  "de","da","do","dos","das",
  "uma","um","uns","umas","meia","meio",
  "dente","dentes","colher","colheres","chá","sopa","café",
  "mão","punhado","pitada","fio","folha","folhas",
  "qb","q.b","q.b.","quanto","baste"
];

const UNITS = [
  "g","kg","mg","ml","cl","dl","l"
];

const DESCRIPTORS = [
  "pequeno","pequena","pequenos","pequenas",
  "médio","média","médios","médias",
  "grande","grandes",
  "fresco","fresca","frescos","frescas",
  "congelado","congelada","congelados","congeladas",
  "picado","picada","picados","picadas",
  "opcional","opcionais",
  "gosto","aprox","aproximadamente","branco","tinto","maduro","verde"
];

function extractIngredientSlug(text: string) {
  const cleaned = text
    .toLowerCase()
    .replace(/[0-9]/g, "")
    .replace(/[^a-zà-ÿ\s]/gi, "")
    .split(/\s+/)
    .filter(
      (w) =>
        w &&
        w.length > 2 &&
        !STOPWORDS.includes(w) &&
        !UNITS.includes(w) &&
        !DESCRIPTORS.includes(w)
    );

  if (cleaned.length === 0) return null;

  return cleaned[cleaned.length - 1];
}

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({
  recipe,
  onBack,
  favorites,
  toggleFavorite,
}) => {
  // Normalizar ingredientes
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
        .flatMap((item) =>
          item
            .toString()
            .split(/\n+/)
            .map((i) => i.trim())
            .filter((i) => i.length > 0)
        )
    : typeof recipe.ingredients === "string"
    ? recipe.ingredients
        .split(/\n|,|;/)
        .map((i) => i.trim())
        .filter((i) => i.length > 0)
    : [];

  // Normalizar passos
  const steps = Array.isArray(recipe.steps)
    ? recipe.steps.flatMap((item) =>
        item
          .toString()
          .split(/\n+/)
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      )
    : typeof recipe.steps === "string"
    ? recipe.steps
        .split(/\n+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  return (
    <div className="p-6 sm:p-8 text-charcoal">
      {recipe.image && (
        <img
          src={recipe.image}
          alt={recipe.title}
          loading="lazy"
          className="w-full h-64 object-cover rounded-xl mb-6"
        />
      )}

      <h2 className="text-2xl md:text-3xl font-semibold text-olive mb-6 text-center">
        {recipe.title}
      </h2>

      {recipe.time_minutes && (
        <p className="text-stone mb-4">⏱️ {recipe.time_minutes} min</p>
      )}

      {/* QUANTIDADE — só aparece se NÃO for sobremesa */}
      {!(
        recipe.tags &&
        recipe.tags.some((tag) =>
          [
            "doce",
            "doces",
            "sobremesa",
            "sobremesas",
            "bolo",
            "bolos",
            "tarte",
            "tartes",
            "pudim",
            "pudins",
            "mousse",
            "mousses",
          ].includes(tag.toLowerCase())
        )
      ) && <p className="text-stone mb-6">Quantidade: 4 pessoas</p>}

      {/* BOTÃO VOZ */}
      <div className="mb-6">
        <a
          href={`/cozinhar/${recipe.id}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-olive text-white rounded-2xl 
                     hover:bg-olive/90 transition text-sm"
        >
          <Volume2 size={18} strokeWidth={2} />
          Ouvir a receita passo-a-passo
        </a>

        <p className="text-xs text-charcoal/70 mt-1 ml-1">
          Siga a receita com instruções faladas enquanto cozinha.
        </p>
      </div>

      {/* INGREDIENTES */}
      <h3 className="text-xl font-semibold text-olive mt-6 mb-2">
        Ingredientes
      </h3>

      <ul className="list-disc list-inside space-y-1 mb-6">
        {ingredients.length > 0 ? (
    ingredients.map((ing, i) => {
const mainIngredient = extractIngredientSlug(ing);
if (!mainIngredient) return null;
   

  return (
    <li key={i}>
      <Link
        to={`/ingrediente/${mainIngredient}`}
        className="text-olive hover:underline"
      >
        {ing}
      </Link>
    </li>
  );
})
        ) : (
          <li>Sem ingredientes registados.</li>
        )}
      </ul>

      {/* LINKS PARA PÁGINAS DE INGREDIENTE (SEO) */}
      {ingredients.length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-olive mb-3">
            Receitas com estes ingredientes
          </h3>

          <div className="flex flex-wrap gap-2 mb-6">
            {ingredients.slice(0, 4).map((ing, i) => {
             const clean = extractIngredientSlug(ing);
             if (!clean) return null;

              return (
                <a
                  key={i}
                  href={`/ingrediente/${clean}`}
                  className="bg-beige text-olive px-3 py-1 rounded-full text-sm hover:bg-olive hover:text-white transition"
                >
                  {clean}
                </a>
              );
            })}
          </div>
        </>
      )}

      {/* PASSOS */}
      <h3 className="text-xl font-semibold text-olive mb-2">Passos</h3>
      <ol className="list-decimal list-inside space-y-2 mb-6">
        {steps.length > 0 ? (
          steps.map((step, i) => <li key={i}>{step}</li>)
        ) : (
          <li>Sem passos registados.</li>
        )}
      </ol>

      {/* TAGS */}
      {recipe.tags && recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-beige text-charcoal/80 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* FAVORITOS + PARTILHA */}
      <div className="flex flex-col items-start gap-3 mb-6">
        <button
          onClick={() => toggleFavorite(recipe.id)}
          className="px-4 py-2 border border-[#6B705C] text-[#6B705C] 
                     rounded-2xl hover:bg-[#6B705C10] transition text-sm"
        >
          {favorites.includes(recipe.id)
            ? "❤️ Remover dos favoritos"
            : "❤️ Guardar esta receita"}
        </button>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(
            `${recipe.title} - Receitas DO QUE HÁ - https://receitasdoqueha.pt/receita/${recipe.id}`
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 border border-[#6B705C] text-[#6B705C] 
                     rounded-2xl hover:bg-[#6B705C10] transition text-sm inline-flex items-center gap-1"
        >
          <span className="text-lg">↪</span> Partilhar
        </a>
      </div>

      {/* FECHAR */}
      <div className="text-right">
        <button
          onClick={onBack}
          className="px-4 py-2 text-sm rounded-xl border border-terracotta text-terracotta 
                     hover:bg-terracotta hover:text-white transition"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;
