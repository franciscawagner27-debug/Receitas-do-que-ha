import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Recipe } from "../types";
import { Link } from "react-router-dom";

interface AdminPanelProps {
  onRecipeCreated?: (recipe: Recipe) => void;
  onLogout: () => void;
  email?: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  onRecipeCreated,
  onLogout,
  email,
}) => {
  /* -------------------------------------------------------------------------- */
  /*                               ESTADO LOCAL                                 */
  /* -------------------------------------------------------------------------- */

  const [title, setTitle] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [timeMinutes, setTimeMinutes] = useState<number | "">("");
  const [image, setImage] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Lista de receitas
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  /* -------------------------------------------------------------------------- */
  /*                          FETCH LISTA DE RECEITAS                           */
  /* -------------------------------------------------------------------------- */

  async function loadRecipes() {
    setLoadingRecipes(true);

    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) {
      setRecipes(data as Recipe[]);
    }

    setLoadingRecipes(false);
  }

  useEffect(() => {
    loadRecipes();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                            GUARDAR NOVA RECEITA                            */
  /* -------------------------------------------------------------------------- */

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const ingredients = ingredientsText
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    const steps = stepsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const { data, error } = await supabase
      .from("recipes")
      .insert([
        {
          title,
          ingredients,
          steps,
          tags,
          time_minutes: timeMinutes === "" ? null : Number(timeMinutes),
          image: image || null,
        },
      ])
      .select()
      .single();

    setSaving(false);

    if (error || !data) {
      console.error(error);
      setError("Erro ao guardar a receita. Verifica os campos.");
      return;
    }

    setMessage("Receita guardada com sucesso ✨");

    setTitle("");
    setIngredientsText("");
    setStepsText("");
    setTagsText("");
    setTimeMinutes("");
    setImage("");

    if (onRecipeCreated) onRecipeCreated(data as Recipe);

    loadRecipes(); // atualizar lista
  };

  /* -------------------------------------------------------------------------- */
  /*                                 ELIMINAR                                   */
  /* -------------------------------------------------------------------------- */

  async function deleteRecipe(id: number) {
    const confirmDelete = confirm("Tem a certeza que quer apagar esta receita?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("recipes").delete().eq("id", id);

    if (error) {
      alert("Erro ao apagar receita.");
      return;
    }

    loadRecipes();
  }

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="bg-white/95 border border-olive/20 rounded-2xl p-6 shadow-soft mt-6 space-y-10">

      {/* ------------------------------------------------------------- */}
      {/*  CABEÇALHO DO PAINEL                                          */}
      {/* ------------------------------------------------------------- */}

      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-serif text-olive">
            Área privada — Nova receita
          </h3>
          {email && (
            <p className="text-xs text-charcoal/70">
              Autenticada como <span className="font-medium">{email}</span>
            </p>
          )}
        </div>

        <button
          onClick={onLogout}
          className="text-xs px-3 py-1 rounded-lg border border-terracotta text-terracotta hover:bg-terracotta hover:text-white transition"
        >
          Sair
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/*  FORMULÁRIO DE NOVA RECEITA                                   */}
      {/* ------------------------------------------------------------- */}

      <form onSubmit={handleSave} className="space-y-4 text-sm">
        <div>
          <label className="block mb-1 font-medium text-charcoal/80">
            Título
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-olive/30 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-charcoal/80">
            Ingredientes (separados por vírgulas)
          </label>
          <textarea
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            className="w-full rounded-xl border border-olive/30 px-3 py-2 h-20"
            placeholder="ex: farinha, leite, ovos..."
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-charcoal/80">
            Passos (cada linha = 1 passo)
          </label>
          <textarea
            value={stepsText}
            onChange={(e) => setStepsText(e.target.value)}
            className="w-full rounded-xl border border-olive/30 px-3 py-2 h-28"
            placeholder={"Passo 1...\nPasso 2...\nPasso 3..."}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-charcoal/80">
            Tags (separadas por vírgulas)
          </label>
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            className="w-full rounded-xl border border-olive/30 px-3 py-2"
            placeholder="ex: sobremesa, mousse, fácil"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium text-charcoal/80">
              Tempo (minutos)
            </label>
            <input
              type="number"
              min={0}
              value={timeMinutes}
              onChange={(e) =>
                setTimeMinutes(e.target.value === "" ? "" : Number(e.target.value))
              }
              className="w-full rounded-xl border border-olive/30 px-3 py-2"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-charcoal/80">
              URL da imagem (opcional)
            </label>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-xl border border-olive/30 px-3 py-2"
              placeholder="https://..."
            />
          </div>
        </div>

        {message && <p className="text-xs text-olive">{message}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-2 bg-terracotta text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-terracotta/90 transition disabled:opacity-60"
        >
          {saving ? "A guardar..." : "Guardar receita"}
        </button>
      </form>

      {/* ------------------------------------------------------------- */}
      {/*  LISTA DE RECEITAS + EDITAR + ELIMINAR                        */}
      {/* ------------------------------------------------------------- */}

      <div>
       <h3 className="text-xl font-serif text-olive mb-4">
  Receitas existentes ({recipes.length})
</h3>
>

        {loadingRecipes ? (
          <p className="text-charcoal/60">A carregar receitas...</p>
        ) : recipes.length === 0 ? (
          <p className="text-charcoal/60">Ainda não existe nenhuma receita.</p>
        ) : (
          <div className="space-y-4">
            {recipes.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 border rounded-xl bg-white shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={r.image || "https://via.placeholder.com/50"}
                    className="w-[50px] h-[50px] object-cover rounded"
                  />
                  <span className="text-charcoal font-medium">{r.title}</span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/admin/edit/${r.id}`}
                    className="px-3 py-1 text-xs rounded-lg border border-olive text-olive hover:bg-olive hover:text-white transition"
                  >
                    Editar
                  </Link>

                  <button
                    onClick={() => deleteRecipe(r.id)}
                    className="px-3 py-1 text-xs rounded-lg border border-terracotta text-terracotta hover:bg-terracotta hover:text-white transition"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
