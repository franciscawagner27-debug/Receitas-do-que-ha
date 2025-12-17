import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const CozinharPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // --- MODO VOZ ---
  const [voiceMode, setVoiceMode] = useState(false);
  const [lastHeard, setLastHeard] = useState("");
  const [supportsVoice, setSupportsVoice] = useState(false);
  const recognitionRef = useRef<any | null>(null);
  const voiceModeRef = useRef(false);
  const handleVoiceCommandRef = useRef<(text: string) => void>();

  // ============================================================================
  // 🔊 FALAR TEXTO
  // ============================================================================
  function speak(text: string) {
    if (typeof window === "undefined") return;

    try {
      recognitionRef.current?.stop();
    } catch {}

    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "pt-PT";
    utter.rate = 1;

    utter.onend = () => {
      console.log("🔊 Fim da fala");

      if (voiceModeRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.log("Erro ao reiniciar microfone:", e);
        }
      }
    };

    window.speechSynthesis.speak(utter);
  }

  // ============================================================================
  // 🔄 CARREGAR RECEITA
  // ============================================================================
  async function loadRecipe() {
    if (!id) return;

    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setRecipe(data);
      setCurrentStep(0);
    }
  }

  useEffect(() => {
    loadRecipe();
  }, [id]);

  // ============================================================================
  // 🎤 CONFIGURAR WEBSPEECH
  // ============================================================================
  useEffect(() => {
    voiceModeRef.current = voiceMode;
  }, [voiceMode]);

  useEffect(() => {
    handleVoiceCommandRef.current = handleVoiceCommand;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSupportsVoice(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "pt-PT";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => console.log("🎤 A ouvir…");

    recognition.onresult = (event: any) => {
      try {
        const raw = event.results?.[0]?.[0]?.transcript ?? "";
        const sanitized = raw
          .replace(/[^a-zA-Z0-9À-ÖØ-öø-ÿ\s]/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .toLowerCase();

        if (!sanitized) return;
        setLastHeard(sanitized);

        try {
          handleVoiceCommandRef.current?.(sanitized);
        } catch (err) {
          console.log("Erro ao interpretar comando:", err);
        }
      } catch (err) {
        console.log("Erro no resultado de voz:", err);
      }
    };

    recognition.onerror = (event: any) =>
      console.log("Erro voz:", event.error);

    recognition.onend = () => {
      console.log("🔇 Fim da fala");

      if (voiceModeRef.current) {
        try {
          recognition.start();
        } catch {}
      }
    };

    recognitionRef.current = recognition;
    setSupportsVoice(true);

    return () => {
      try {
        recognition.stop();
      } catch {}
      recognitionRef.current = null;
    };
  }, []);

  // ============================================================================
  // 🧹 PARAR AO SAIR
  // ============================================================================
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      try {
        recognitionRef.current?.stop();
      } catch {}
    };
  }, []);

  // ============================================================================
  // NORMALIZAR PASSOS
  // ============================================================================
  if (!recipe) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <p className="text-charcoal">A carregar receita...</p>
      </div>
    );
  }

  const rawSteps = recipe.steps;

  const steps: string[] = Array.isArray(rawSteps)
    ? rawSteps.flatMap((item: any) =>
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

  // ============================================================================
  // FUNÇÕES DE NAVEGAÇÃO
  // ============================================================================
  function goBack(viaVoice = false) {
    if (currentStep <= 0) return;

    setCurrentStep((prev) => {
      const next = prev - 1;
      if (viaVoice) speak(steps[next]);
      return next;
    });
  }

  function goNext(viaVoice = false) {
    if (currentStep >= steps.length - 1) return;

    setCurrentStep((prev) => {
      const next = prev + 1;
      if (viaVoice) speak(steps[next]);
      return next;
    });
  }

  function repeatStep() {
    speak(steps[currentStep]);
  }

  function goToStep(index: number) {
    const safe = Math.max(0, Math.min(index, steps.length - 1));
    setCurrentStep(safe);
    speak(steps[safe]);
  }

  // ============================================================================
  // COMANDOS DE VOZ
  // ============================================================================
  function handleVoiceCommand(text: string) {
    const c = text.toLowerCase();

    if (
      c.includes("próximo") ||
      c.includes("seguinte") ||
      c.includes("avançar")
    )
      return goNext(true);

    if (
      c.includes("anterior") ||
      c.includes("voltar") ||
      c.includes("para trás")
    )
      return goBack(true);

    if (c.includes("repete") || c.includes("repetir") || c.includes("outra vez"))
      return repeatStep();

    if (c.includes("passo")) {
      const num = c.match(/\d+/);
      if (num) return goToStep(parseInt(num[0]) - 1);
    }

    if (
      c.includes("começar receita") ||
      c.includes("iniciar receita") ||
      c.includes("começar do início")
    )
      return goToStep(0);

    if (c.includes("parar") || c.includes("stop")) return stopVoiceMode();
  }

  // ============================================================================
  // ATIVAR / DESATIVAR MODO VOZ
  // ============================================================================
  function startVoiceMode() {
    if (!supportsVoice || !recognitionRef.current) return;

    voiceModeRef.current = true;
    setVoiceMode(true);
    setLastHeard("");

    try {
      recognitionRef.current.start();
    } catch (e) {
      console.log("Erro ao iniciar microfone:", e);
    }
  }

  function stopVoiceMode() {
    voiceModeRef.current = false;
    setVoiceMode(false);
    setLastHeard("");

    window.speechSynthesis.cancel();
    try {
      recognitionRef.current?.stop();
    } catch {}
  }

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="min-h-screen bg-beige px-4 py-6">
      <div className="max-w-2xl mx-auto">

        {/* VOLTAR */}
        <button
          onClick={() => {
            stopVoiceMode();
            navigate(-1);
          }}
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

        {/* PASSO */}
        <div className="bg-white border border-stone/30 rounded-2xl p-6 mb-8 shadow-sm">
          <p className="text-sm font-medium text-olive mb-2">
            Passo {currentStep + 1} de {steps.length}
          </p>

          <p className="text-lg leading-relaxed text-charcoal">
            {steps[currentStep]}
          </p>

          <button
            onClick={() => speak(steps[currentStep])}
            className="mt-4 px-4 py-2 bg-olive text-white rounded-xl hover:bg-olive/90 transition text-sm"
          >
            🔊 Ouvir passo
          </button>
        </div>

        {/* BOTÕES */}
        <div className="flex justify-between gap-4">
          <button
            onClick={() => goBack(false)}
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
            onClick={() => goNext(false)}
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

        {/* MODO VOZ */}
        {supportsVoice ? (
          <div className="mt-8 mb-16 p-4 bg-[#F1E4D4] border border-stone/30 rounded-2xl">
            <h2 className="text-lg font-semibold text-olive mb-1">
              Modo Voz
            </h2>
            <p className="text-sm text-charcoal/80 mb-3">
              Diz: <strong>"próximo passo"</strong>, <strong>"anterior"</strong>,
              <strong>"repete"</strong>, <strong>"passo 3"</strong>,
              <strong>"começar receita"</strong>. Para sair, diz <strong>"parar"</strong>.
            </p>

            {/* FRASE QUE EXPLICA MODO VOZ */}
            <p className="text-sm text-charcoal/80 mb-3 italic">
              Mãos sujas? Ative o modo voz e diga os comandos para avançar sem tocar no ecrã.
            </p>

            <button
              onClick={voiceMode ? stopVoiceMode : startVoiceMode}
              className={`w-full py-2.5 rounded-xl text-sm font-medium text-white transition ${
                voiceMode ? "bg-olive/90" : "bg-olive hover:bg-olive/90"
              }`}
            >
              {voiceMode ? "🎤 A ouvir… tocar para parar" : "🎤 Ativar Modo Voz"}
            </button>

            {lastHeard && (
              <p className="mt-2 text-xs text-charcoal">
                Ouvi: “{lastHeard}”
              </p>
            )}
          </div>
        ) : (
          <p className="mt-6 text-xs text-charcoal/60">
            O modo voz não é suportado neste navegador. Usa Google Chrome.
          </p>
        )}

        {/* INGREDIENTES — DESIGN IGUAL À PÁGINA PRINCIPAL */}
        <h3 className="text-xl font-semibold text-olive mt-6 mb-2">
          Ingredientes:
        </h3>

        <ul className="list-disc list-inside space-y-1 mb-6 text-charcoal">
          {recipe.ingredients ? (
            recipe.ingredients
              .toString()
              .split(/\n+/)
              .map((ing: string, idx: number) => (
                <li key={idx}>{ing.trim()}</li>
              ))
          ) : (
            <li>Sem ingredientes registados.</li>
          )}
        </ul>

        {/* RECEITA COMPLETA */}
        <h3 className="text-xl font-semibold text-olive mb-2">
          Receita:
        </h3>

        <p className="whitespace-pre-line leading-relaxed text-charcoal mb-12">
          {Array.isArray(recipe.steps)
            ? recipe.steps
                .flatMap((s: any) =>
                  s
                    .toString()
                    .split(/\n+/)
                    .map((p: string) => p.trim())
                    .filter((p: string) => p.length > 0)
                )
                .join("\n\n")
            : recipe.steps}
        </p>

      </div>
    </div>
  );
};

export default CozinharPage;
