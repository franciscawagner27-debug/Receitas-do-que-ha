import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

const CozinharPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);

  async function loadRecipe() {
    if (!id) return;

    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (!error && data) {
      setRecipe(data);
    }
  }

  useEffect(() => {
    loadRecipe();
  }, [id]);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <p className="text-charcoal">A carregar receita...</p>
      </div>
    );
  }

  const rawSteps = recipe.steps;

  const steps: string[] = Array.isArray(rawSteps)
    ? rawSteps
        .flatMap((item: any) =>
          item
            ?.toString()
            ?.split(/\n+/)
            .map((s: string) => s.trim())
            .filter((s: string) => s.length > 0)
        )
    : typeof rawSteps === "string"
    ? rawSteps
        .split(/\n+/)
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0)
    : [];

  function goNext() {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }

  function goBack() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }

  return (
    <div className="min-h-screen bg-beige px-4 py-6">
      <div className="max-w-2xl mx-auto">
        {/* VOLTAR */}
        <button
          onClick={() => navigate(-1)}
          className="text-olive text-sm underline mb-4"
        >
          ← Voltar
        </button>

        {/* TÍTULO */}
        <h1 className="text-3xl font-semibold text-olive text-center mb-2">
          Receita Passo-a-Passo
        </h1>

        <p className="text-center text-charcoal/80 mb-6">
          {recipe.title}
        </p>

        {/* CAIXA DO PASSO */}
        <div className="bg-white border border-stone/30 rounded-2xl p-6 mb-8 shadow-sm">
          <p className="text-sm font-medium text-olive mb-2">
            Passo {currentStep + 1} de {steps.length}
          </p>

          <p className="text-lg leading-relaxed text-charcoal">
            {steps[currentStep]}
          </p>
        </div>

        {/* BOTÕES */}
        <div className="flex justify-between gap-4">
          <button
            onClick={goBack}
            disabled={currentStep === 0}
            className={`flex-1 py-3 rounded-xl text-white transition ${
              currentStep === 0
                ? "bg-olive/40 cursor-not-allowed"
                : "bg-olive hover:bg-olive/90"
            }`}
          >
            ← Anterior
          </button>

          <button
            onClick={goNext}
            disabled={currentStep === steps.length - 1}
            className={`flex-1 py-3 rounded-xl text-white transition ${
              currentStep === steps.length - 1
                ? "bg-olive/40 cursor-not-allowed"
                : "bg-olive hover:bg-olive/90"
            }`}
          >
            Próximo →
          </button>
        </div>
      </div>
    </div>
  );
};

export default CozinharPage;
