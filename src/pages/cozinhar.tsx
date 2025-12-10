import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const CozinharPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);

  // --- MODO VOZ (WEB) ---
  const [voiceMode, setVoiceMode] = useState(false);
  const [lastHeard, setLastHeard] = useState("");
  const [supportsVoice, setSupportsVoice] = useState(false);
  const recognitionRef = useRef<any | null>(null);

  // 🔊 FALAR (sem tentar ligar microfone aqui)
  function speak(text: string) {
    if (typeof window === "undefined") return;

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "pt-PT";
    utter.rate = 1;
    window.speechSynthesis.speak(utter);
  }

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

  // Carregar receita
  useEffect(() => {
    loadRecipe();
  }, [id]);

  // Configurar reconhecimento de voz (Web Speech API)
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

    recognition.onstart = () => {
      console.log("🎤 A ouvir…");
    };

    recognition.onresult = (event: any) => {
      const text =
        event.results?.[0]?.[0]?.transcript?.toString() ?? "";
      if (!text) return;

      const lower = text.toLowerCase();
      setLastHeard(lower);
      handleVoiceCommand(lower);
    };

    recognition.onerror = (event: any) => {
      console.log("Erro voz:", event);
    };

    recognition.onend = () => {
      console.log("🔇 Fim da fala");
      // Se o modo voz ainda estiver ativo, tenta voltar a ouvir
      if (voiceMode) {
        try {
          recognition.start();
        } catch (e) {
          console.log("Erro a reiniciar reconhecimento:", e);
        }
      }
    };

    recognitionRef.current = recognition;
    setSupportsVoice(true);

    return () => {
      try {
        recognition.stop();
      } catch (e) {
        // ignore
      }
      recognitionRef.current = null;
    };
    // ⚠️ NÃO meter voiceMode nas deps deste effect,
    // senão recriava o recognition sempre que o estado muda.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Parar voz ao sair da página
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
    };
  }, []);

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

  // ⬅️ VOLTAR UM PASSO (com opção de falar se vier do modo voz)
  function goBack(viaVoice: boolean = false) {
    if (currentStep <= 0 || !steps.length) return;

    setCurrentStep((prev) => {
      const next = Math.max(prev - 1, 0);
      if (viaVoice && next !== prev) {
        speak(steps[next]);
      }
      return next;
    });
  }

  // ➡️ AVANÇAR UM PASSO
  function goNext(viaVoice: boolean = false) {
    if (currentStep >= steps.length - 1 || !steps.length) return;

    setCurrentStep((prev) => {
      const next = Math.min(prev + 1, steps.length - 1);
      if (viaVoice && next !== prev) {
        speak(steps[next]);
      }
      return next;
    });
  }

  // 🔁 REPETIR PASSO
  function repeatStep() {
    if (!steps.length) return;
    speak(steps[currentStep]);
  }

  // IR PARA UM PASSO ESPECÍFICO (ex: "passo 3")
  function goToStep(index: number) {
    if (!steps.length) return;

    const safeIndex = Math.min(
      Math.max(index, 0),
      steps.length - 1
    );

    setCurrentStep(safeIndex);
    speak(steps[safeIndex]);
  }

  // 🧠 INTERPRETAR COMANDOS DE VOZ
  function handleVoiceCommand(text: string) {
    const comando = text.toLowerCase();

    if (
      comando.includes("próximo") ||
      comando.includes("seguinte") ||
      comando.includes("avançar")
    ) {
      goNext(true);
      return;
    }

    if (
      comando.includes("anterior") ||
      comando.includes("para trás") ||
      comando.includes("voltar")
    ) {
      goBack(true);
      return;
    }

    if (
      comando.includes("repete") ||
      comando.includes("repetir") ||
      comando.includes("outra vez")
    ) {
      repeatStep();
      return;
    }

    if (comando.includes("passo")) {
      const numeroEncontrado = comando.match(/\d+/);
      if (numeroEncontrado) {
        const passoNumero = parseInt(numeroEncontrado[0], 10);
        if (!isNaN(passoNumero)) {
          goToStep(passoNumero - 1);
          return;
        }
      }
    }

    if (
      comando.includes("começar receita") ||
      comando.includes("iniciar receita") ||
      comando.includes("começar do início")
    ) {
      goToStep(0);
      return;
    }

    if (comando.includes("parar") || comando.includes("stop")) {
      stopVoiceMode();
      return;
    }
  }

  // ▶️ ATIVAR MODO VOZ
  function startVoiceMode() {
    if (!supportsVoice || !recognitionRef.current || !steps.length) {
      return;
    }

    setVoiceMode(true);
    setLastHeard("");

    try {
      // 👉 Ligar o microfone logo na ação do clique (requisito do browser)
      recognitionRef.current.start();
    } catch (e) {
      console.log("Erro ao iniciar reconhecimento:", e);
    }

    // E também falar o passo atual
    speak(steps[currentStep]);
  }

  // ⏹ DESATIVAR MODO VOZ
  function stopVoiceMode() {
    setVoiceMode(false);
    setLastHeard("");

    if (typeof window !== "undefined") {
      window.speechSynthesis.cancel();
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log("Erro ao parar reconhecimento:", e);
      }
    }
  }

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

        {/* CAIXA DO PASSO */}
        <div className="bg-white border border-stone/30 rounded-2xl p-6 mb-8 shadow-sm">
          <p className="text-sm font-medium text-olive mb-2">
            Passo {currentStep + 1} de {steps.length}
          </p>

          <p className="text-lg leading-relaxed text-charcoal">
            {steps[currentStep]}
          </p>

          {/* 🔊 BOTÃO OUVIR PASSO */}
          <button
            onClick={() => speak(steps[currentStep])}
            className="mt-4 px-4 py-2 bg-olive text-white rounded-xl 
                       hover:bg-olive/90 transition text-sm"
          >
            🔊 Ouvir passo
          </button>
        </div>

        {/* BOTÕES ANTERIOR / PRÓXIMO */}
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

        {/* 🟫 MODO VOZ */}
        {supportsVoice ? (
          <div className="mt-8 mb-16 p-4 bg-[#F1E4D4] border border-stone/30 rounded-2xl">
            <h2 className="text-lg font-semibold text-olive mb-1">
              Modo Voz
            </h2>
            <p className="text-sm text-charcoal/80 mb-3">
              Controla a receita por voz:{" "}
              <strong>"próximo passo"</strong>,{" "}
              <strong>"anterior"</strong>,{" "}
              <strong>"repete"</strong>,{" "}
              <strong>"passo 3"</strong> ou{" "}
              <strong>"começar receita"</strong>. Para sair,
              diz <strong>"parar"</strong>.
            </p>

            <button
              onClick={voiceMode ? stopVoiceMode : startVoiceMode}
              className={`w-full py-2.5 rounded-xl text-sm font-medium text-white transition ${
                voiceMode
                  ? "bg-olive/90"
                  : "bg-olive hover:bg-olive/90"
              }`}
            >
              {voiceMode
                ? "🎤 A ouvir… tocar para parar"
                : "🎤 Ativar Modo Voz"}
            </button>

            {lastHeard && (
              <p className="mt-2 text-xs text-charcoal">
                Ouvi: “{lastHeard}”
              </p>
            )}
          </div>
        ) : (
          <p className="mt-6 text-xs text-charcoal/60">
            O modo voz não é suportado neste navegador. Tenta usar o
            Google Chrome no computador ou telemóvel.
          </p>
        )}
      </div>
    </div>
  );
};

export default CozinharPage;
