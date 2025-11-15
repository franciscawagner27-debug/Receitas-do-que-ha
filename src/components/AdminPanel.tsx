import React, { useState, useEffect } from "react";
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
  /* FORM STATES */
  const [title, setTitle] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [timeMinutes, setTimeMinutes] = useState<number | "">("");
  const [image, setImage] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* RECEITAS EXISTENTES */
  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const [loadingList, setLoadingList] = useState(true);

  /* PRIORIDADES EDITADAS — agora a key é string (UUID), não number */
  const [priorityEdits, setPriorityEdits] = useState<Record<string, string>>({});

  async function loadRecipes() {
    setLoadingList(true);

    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("priority", { ascending: true })
      .order("id", { ascending: false });

    if (!error && data) {
      setRecipeList(data as Recipe[]);
    }

    setLoadingList(false);
  }

  useEffect(() => {
    loadRecipes();
  }, []);

  /* GUARDAR NOVA RECEITA */
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
          priority: 9999,
        },
      ])
      .select()
      .single();

    setSaving(false);

    if (error || !data) {
      setError("Erro ao guardar a receita.");
      return;
    }

    setMessage("Receita guardada com sucesso ✨");

    setTitle("");
    setIngredientsText("");
    setStepsText("");
    setTagsText("");
    setTimeMinutes("");
    setImage("");

    loadRecipes();

    if (onRecipeCreated) onRecipeCreated(data as Recipe);
  };

  /* APAGAR RECEITA — agora id é string */
  async function deleteRecipe(id: string) {
    if (!confirm("Tem a certeza que quer apagar esta receita?")) return;

    const { error } = await supabase.from("recipes").delete().eq("id", id);

    if (!error) loadRecipes();
  }

  /* ATUALIZAR PRIORIDADE — agora id é string */
  async function updatePriority(id: string) {
    const raw = priorityEdits[id];
    const num = raw === "" ? null : Number(raw);

    await supabase.from("recipes").update({ priority: num }).eq("id", id);

    loadRecipes();
  }

  /* UI */
  return (
    <div className="bg-white/95 border border-olive/20 rounded-2xl p-6 shadow-soft mt-6 space-y-10">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-serif text-olive">Área privada — Nova receita</h3>
          {email && (
            <p className="text-xs text-charcoal/70">
              Autenticada como <span className="font-medium">{email}</span>
            </p>
          )}
        </div>

        <button
          onClick={onLogout}
          className="text-xs px-3 py-1 rounded-lg border border-terracotta text-terracotta hover:bg-terracotta hover:text-white"
        >
          Sair
        </button>
      </div>

      {/* FORM NOVA RECEITA */}
      <form onSubmit={handleSave} className="space-y-4 text-sm">
        <div>
          <label className="block mb-1 font-medium">Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-olive/30 px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Ingredientes</label>
          <textarea
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            className="w-full rounded-xl border border-olive/30 px-3 py-2 h-20"
            placeholder="farinha, leite, ovos..."
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Passos</label>
          <textarea
            value={stepsText}
            onChange={(e) => setStepsText(e.target.value)}
            className="w-full rounded-xl border border-olive/30 px-3 py-2 h-28"
            placeholder="Passo 1...\nPasso 2..."
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Tags</label>
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            className="w-full rounded-xl border border-olive/30 px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Tempo</label>
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
            <label className="block mb-1 font-medium">URL da imagem</label>
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
          className="bg-terracotta text-white px-4 py-2 rounded-xl text-sm font-semibold"
        >
          {saving ? "A guardar..." : "Guardar receita"}
        </button>
      </form>

      {/* LISTA DE RECEITAS */}
      <div>
        <h2 className="text-lg font-semibold text-olive mb-4">
          Receitas existentes ({recipeList.length})
        </h2>

        {loadingList ? (
          <p>A carregar receitas...</p>
        ) : (
          <div className="space-y-3">
            {recipeList.map((r) => {
              const currentValue =
                priorityEdits[r.id] ?? (r.priority === null ? "" : String(r.priority));

              return (
                <div
                  key={r.id}
                  className="flex items-center justify-between bg-white border p-3 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    {r.image ? (
                      <img src={r.image} className="w-12 h-12 rounded-md object-cover border" />
                    ) : (
                      <div className="w-12 h-12 bg-beige border flex items-center justify-center text-xs">
                        sem foto
                      </div>
                    )}

                    <div>
                      <p className="font-medium">{r.title}</p>
                      <p className="text-xs text-charcoal/60">ID: {r.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      className="w-16 border rounded p-1 text-sm"
                      value={currentValue}
                      placeholder="—"
                      onChange={(e) =>
                        setPriorityEdits((prev) => ({
                          ...prev,
                          [r.id]: e.target.value,
                        }))
                      }
                      onBlur={() => updatePriority(r.id)}
                    />

                    <Link
                      to={`/admin/edit/${r.id}`}
                      className="text-xs px-2 py-1 rounded bg-olive text-white"
                    >
                      Editar
                    </Link>

                    <button
                      onClick={() => deleteRecipe(r.id)}
                      className="text-xs px-2 py-1 rounded bg-red-500 text-white"
                    >
                      Apagar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
