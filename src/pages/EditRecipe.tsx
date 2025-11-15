import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [ingredientsText, setIngredientsText] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [timeMinutes, setTimeMinutes] = useState<number | "">("");
  const [image, setImage] = useState("");

  /* -------------------------------------------------------------------------- */
  /*                          CARREGAR RECEITA EXISTENTE                         */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    async function fetchRecipe() {
      const { data, error } = await supabase
        .from("recipes")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        alert("Erro ao carregar receita.");
        navigate("/admin");
        return;
      }

      setTitle(data.title);

      // INGREDIENTES
      if (Array.isArray(data.ingredients)) {
        setIngredientsText(data.ingredients.join(", "));
      } else if (typeof data.ingredients === "string") {
        // limpar lixo antigo
        setIngredientsText(
          data.ingredients
            .replace(/[\[\]\(\)"{}]/g, "")
            .split(/[,;]+/)
            .map((t) => t.trim())
            .filter(Boolean)
            .join(", ")
        );
      } else {
        setIngredientsText("");
      }

      // PASSOS
      if (Array.isArray(data.steps)) {
        setStepsText(data.steps.join("\n"));
      } else if (typeof data.steps === "string") {
        setStepsText(
          data.steps
            .replace(/[\[\]\(\)"{}]/g, "")
            .split(/[\n,;]+/)
            .map((s) => s.trim())
            .filter(Boolean)
            .join("\n")
        );
      } else {
        setStepsText("");
      }

      // TAGS
      if (Array.isArray(data.tags)) {
        setTagsText(data.tags.join(", "));
      } else if (typeof data.tags === "string") {
        setTagsText(
          data.tags
            .replace(/[\[\]\(\)"{}]/g, "")
            .split(/[,;]+/)
            .map((t) => t.trim())
            .filter(Boolean)
            .join(", ")
        );
      } else {
        setTagsText("");
      }

      setTimeMinutes(data.time_minutes || "");
      setImage(data.image || "");

      setLoading(false);
    }

    fetchRecipe();
  }, [id, navigate]);

  /* -------------------------------------------------------------------------- */
  /*                              GUARDAR ALTERAÇÕES                             */
  /* -------------------------------------------------------------------------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      /* INGREDIENTES → ARRAY LIMPO */
      const ingredients = ingredientsText
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean);

      /* PASSOS → ARRAY LIMPO */
      const steps = stepsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      /* TAGS → ARRAY LIMPO */
      const tags = tagsText
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const updateObj: any = {
        title,
        ingredients,
        steps,
        tags,
        time_minutes: timeMinutes === "" ? null : Number(timeMinutes),
        image: image || null,
      };

      console.log("🔍 UPDATE OBJ:", updateObj);

      const { error } = await supabase
        .from("recipes")
        .update(updateObj)
        .eq("id", id);

      if (error) {
        console.error("❌ ERRO SUPABASE:", error);
        alert("Erro ao guardar alterações.");
        setSaving(false);
        return;
      }

      alert("Receita atualizada com sucesso!");
      navigate("/admin");
    } catch (err) {
      console.error("❌ ERRO INESPERADO:", err);
      alert("Erro inesperado ao guardar.");
    }

    setSaving(false);
  };

  /* -------------------------------------------------------------------------- */
  /*                                   UI                                       */
  /* -------------------------------------------------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-olive">
        A carregar receita...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h1 className="text-3xl font-serif text-olive mb-6">Editar Receita</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label className="block font-medium mb-1">Título</label>
          <input
            className="w-full border border-olive/30 rounded-xl p-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Ingredientes */}
        <div>
          <label className="block font-medium mb-1">
            Ingredientes (separados por vírgulas)
          </label>
          <textarea
            className="w-full border border-olive/30 rounded-xl p-3 h-28"
            value={ingredientsText}
            onChange={(e) => setIngredientsText(e.target.value)}
            required
          />
        </div>

        {/* Passos */}
        <div>
          <label className="block font-medium mb-1">
            Passos (cada linha = 1 passo)
          </label>
          <textarea
            className="w-full border border-olive/30 rounded-xl p-3 h-36"
            value={stepsText}
            onChange={(e) => setStepsText(e.target.value)}
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block font-medium mb-1">
            Tags (separadas por vírgulas)
          </label>
          <input
            className="w-full border border-olive/30 rounded-xl p-3"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
          />
        </div>

        {/* Tempo + Imagem */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">
              Tempo (minutos)
            </label>
            <input
              type="number"
              min={0}
              className="w-full border border-olive/30 rounded-xl p-3"
              value={timeMinutes}
              onChange={(e) =>
                setTimeMinutes(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
            />
          </div>

          <div>
            <label className="block font-medium mb-1">URL da imagem</label>
            <input
              className="w-full border border-olive/30 rounded-xl p-3"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
        </div>

        {/* Botão */}
        <button
          type="submit"
          disabled={saving}
          className="bg-terracotta text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-terracotta/90 transition disabled:opacity-50"
        >
          {saving ? "A guardar..." : "Guardar alterações"}
        </button>
      </form>
    </div>
  );
}
