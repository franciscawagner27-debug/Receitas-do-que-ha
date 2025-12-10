diff --git a/src/pages/cozinhar.tsx b/src/pages/cozinhar.tsx
index ce3ec375c00467c672fbfdf1dea1038e84ff2f99..b6d052ffb61885302deba648cb97481de21a9ee8 100644
--- a/src/pages/cozinhar.tsx
+++ b/src/pages/cozinhar.tsx
@@ -1,992 +1,411 @@
-diff --git a/src/pages/cozinhar.tsx b/src/pages/cozinhar.tsx
-index 4885f255d076eebb1567773f86221bc6ae22b20e..e5d25c12e1a5a0d60141c354dea34a1f34f3a0a7 100644
---- a/src/pages/cozinhar.tsx
-+++ b/src/pages/cozinhar.tsx
-@@ -1,597 +1,390 @@
--diff --git a/src/pages/cozinhar.tsx b/src/pages/cozinhar.tsx
--index 8addae4986d62b929679293cf766f5c6d613ccad..e5d25c12e1a5a0d60141c354dea34a1f34f3a0a7 100644
----- a/src/pages/cozinhar.tsx
--+++ b/src/pages/cozinhar.tsx
--@@ -1,202 +1,390 @@
---diff --git a/src/pages/cozinhar.tsx b/src/pages/cozinhar.tsx
---index 0c231a4a34c8abdc6c367964ffe1018ec6c0aca7..725e4bccd7aceea7f8bf8ae1ecd6d7559eba8489 100644
------ a/src/pages/cozinhar.tsx
---+++ b/src/pages/cozinhar.tsx
---@@ -1,41 +1,42 @@
--- import React, { useEffect, useState, useRef } from "react";
--- import { useParams, useNavigate } from "react-router-dom";
--- import { supabase } from "../lib/supabase";
--- 
--- const CozinharPage: React.FC = () => {
---   const { id } = useParams<{ id: string }>();
---   const navigate = useNavigate();
--- 
---   const [recipe, setRecipe] = useState<any>(null);
---   const [currentStep, setCurrentStep] = useState(0);
--- 
---   // --- MODO VOZ ---
---   const [voiceMode, setVoiceMode] = useState(false);
---   const [lastHeard, setLastHeard] = useState("");
---   const [supportsVoice, setSupportsVoice] = useState(false);
---   const recognitionRef = useRef<any | null>(null);
---+  const voiceModeRef = useRef(false);
--- 
---   // ============================================================================
---   // 🔊 FALAR TEXTO (garantir que o microfone NÃO ouve a voz do computador)
---   // ============================================================================
---   function speak(text: string) {
---     if (typeof window === "undefined") return;
--- 
---     // parar microfone enquanto fala
---     try {
---       recognitionRef.current?.stop();
---     } catch {}
--- 
---     window.speechSynthesis.cancel();
--- 
---     const utter = new SpeechSynthesisUtterance(text);
---     utter.lang = "pt-PT";
---     utter.rate = 1;
--- 
---     utter.onend = () => {
---       console.log("🔊 Fim da fala");
--- 
---       if (voiceMode && recognitionRef.current) {
---         try {
---           recognitionRef.current.start();
---         } catch (e) {
---@@ -98,66 +99,85 @@ const CozinharPage: React.FC = () => {
---         let text = event.results?.[0]?.[0]?.transcript ?? "";
--- 
---         // PATCH ANTI-CRASH:
---         // limpar caracteres invisíveis / tokens quebrados
---         text = text
---           .replace(/[^\p{L}\p{N}\s]/gu, "") // remove símbolos estranhos
---           .normalize("NFC")
---           .trim();
--- 
---         if (!text || text.length < 1) return;
--- 
---         setLastHeard(text.toLowerCase());
---         handleVoiceCommand(text.toLowerCase());
---       } catch (err) {
---         console.log("Erro no resultado de voz (ignorado):", err);
---       }
---     };
--- 
---     recognition.onerror = (event: any) =>
---       console.log("Erro voz:", event.error);
--- 
---     recognition.onend = () => {
---       console.log("🔇 Fim da fala");
--- 
---       // repetir escuta se ainda estamos em modo voz
----      if (voiceMode) {
---+      if (voiceModeRef.current) {
---         try {
---           recognition.start();
---         } catch {}
---       }
---     };
--- 
---     recognitionRef.current = recognition;
---     setSupportsVoice(true);
--- 
---     return () => {
---       try {
---         recognition.stop();
---       } catch {}
---       recognitionRef.current = null;
---     };
---+  }, []);
---+
---+  useEffect(() => {
---+    if (!recognitionRef.current) return;
---+
---+    voiceModeRef.current = voiceMode;
---+
---+    if (voiceMode) {
---+      setLastHeard("");
---+      try {
---+        recognitionRef.current.start();
---+      } catch (e) {
---+        console.log("Erro ao iniciar microfone:", e);
---+      }
---+    } else {
---+      try {
---+        recognitionRef.current.stop();
---+      } catch {}
---+    }
---   }, [voiceMode]);
--- 
---   // ============================================================================
---   // 🧹 PARAR AO SAIR
---   // ============================================================================
---   useEffect(() => {
---     return () => {
---       window.speechSynthesis.cancel();
---       try {
---         recognitionRef.current?.stop();
---       } catch {}
---     };
---   }, []);
--- 
---   // ============================================================================
---   // NORMALIZAR PASSOS
---   // ============================================================================
---   if (!recipe) {
---     return (
---       <div className="min-h-screen bg-beige flex items-center justify-center">
---         <p className="text-charcoal">A carregar receita...</p>
---       </div>
---     );
---   }
--- 
---@@ -229,67 +249,57 @@ const CozinharPage: React.FC = () => {
---     if (c.includes("passo")) {
---       const num = c.match(/\d+/);
---       if (num) return goToStep(parseInt(num[0]) - 1);
---     }
--- 
---     if (
---       c.includes("começar receita") ||
---       c.includes("iniciar receita") ||
---       c.includes("começar do início")
---     ) {
---       return goToStep(0);
---     }
--- 
---     if (c.includes("parar") || c.includes("stop")) {
---       return stopVoiceMode();
---     }
---   }
--- 
---   // ============================================================================
---   // ATIVAR / DESATIVAR MODO VOZ
---   // ============================================================================
---   function startVoiceMode() {
---     if (!supportsVoice || !recognitionRef.current) return;
--- 
---     setVoiceMode(true);
----    setLastHeard("");
----
----    try {
----      recognitionRef.current.start();
----    } catch (e) {
----      console.log("Erro ao iniciar microfone:", e);
----    }
---   }
--- 
---   function stopVoiceMode() {
---     setVoiceMode(false);
---     setLastHeard("");
--- 
---     window.speechSynthesis.cancel();
----    try {
----      recognitionRef.current?.stop();
----    } catch {}
---   }
--- 
---   // ============================================================================
---   // RENDER
---   // ============================================================================
---   return (
---     <div className="min-h-screen bg-beige px-4 py-6">
---       <div className="max-w-2xl mx-auto">
--- 
---         {/* VOLTAR */}
---         <button
---           onClick={() => {
---             stopVoiceMode();
---             navigate(-1);
---           }}
---           className="text-olive text-sm underline mb-4"
---         >
---           ← Voltar
---         </button>
--- 
---         {/* TÍTULO */}
---         <h1 className="text-3xl font-semibold text-olive text-center mb-2">
---           Receita Passo-a-Passo
---         </h1>
--- 
--+import React, { useEffect, useState, useRef } from "react";
--+import { useParams, useNavigate } from "react-router-dom";
--+import { supabase } from "../lib/supabase";
--+
--+const CozinharPage: React.FC = () => {
--+  const { id } = useParams<{ id: string }>();
--+  const navigate = useNavigate();
--+
--+  const [recipe, setRecipe] = useState<any>(null);
--+  const [currentStep, setCurrentStep] = useState(0);
--+
--+  // --- MODO VOZ ---
--+  const [voiceMode, setVoiceMode] = useState(false);
--+  const [lastHeard, setLastHeard] = useState("");
--+  const [supportsVoice, setSupportsVoice] = useState(false);
--+  const recognitionRef = useRef<any | null>(null);
--+  const voiceModeRef = useRef(false);
--+
--+  // ============================================================================
--+  // 🔊 FALAR TEXTO (garantir que o microfone NÃO ouve a voz do computador)
--+  // ============================================================================
--+  function speak(text: string) {
--+    if (typeof window === "undefined") return;
--+
--+    // parar microfone enquanto fala
--+    try {
--+      recognitionRef.current?.stop();
--+    } catch {}
--+
--+    window.speechSynthesis.cancel();
--+
--+    const utter = new SpeechSynthesisUtterance(text);
--+    utter.lang = "pt-PT";
--+    utter.rate = 1;
--+
--+    utter.onend = () => {
--+      console.log("🔊 Fim da fala");
--+
--+      if (voiceModeRef.current && recognitionRef.current) {
--+        try {
--+          recognitionRef.current.start();
--+        } catch (e) {
--+          console.log("Erro ao reiniciar microfone:", e);
--+        }
--+      }
--+    };
--+
--+    window.speechSynthesis.speak(utter);
--+  }
--+
--+  // ============================================================================
--+  // 🔄 CARREGAR RECEITA
--+  // ============================================================================
--+  async function loadRecipe() {
--+    if (!id) return;
--+
--+    const { data, error } = await supabase
--+      .from("recipes")
--+      .select("*")
--+      .eq("id", id)
--+      .single();
--+
--+    if (!error && data) {
--+      setRecipe(data);
--+      setCurrentStep(0); // Não falar nada automaticamente
--+    }
--+  }
--+
--+  useEffect(() => {
--+    loadRecipe();
--+  }, [id]);
--+
--+  // ============================================================================
--+  // 🎤 CONFIGURAR WEBSPEECH + PATCH ANTI-CRASH PT-PT
--+  // ============================================================================
--+  useEffect(() => {
--+    if (typeof window === "undefined") return;
--+
--+    const SpeechRecognition =
--+      (window as any).SpeechRecognition ||
--+      (window as any).webkitSpeechRecognition;
--+
--+    if (!SpeechRecognition) {
--+      setSupportsVoice(false);
--+      return;
--+    }
--+
--+    const recognition = new SpeechRecognition();
--+
--+    // ✔ Idioma correto mas sem minificação problemática
--+    recognition.lang = "pt-PT";
--+    recognition.continuous = false;
--+    recognition.interimResults = false;
--+
--+    recognition.onstart = () => console.log("🎤 A ouvir…");
--+
--+    recognition.onresult = (event: any) => {
--+      try {
--+        let text = event.results?.[0]?.[0]?.transcript ?? "";
--+
--+        // PATCH ANTI-CRASH:
--+        // limpar caracteres invisíveis / tokens quebrados
--+        text = text
--+          .replace(/[^\p{L}\p{N}\s]/gu, "") // remove símbolos estranhos
--+          .normalize("NFC")
--+          .trim();
--+
--+        if (!text || text.length < 1) return;
--+
--+        setLastHeard(text.toLowerCase());
--+        handleVoiceCommand(text.toLowerCase());
--+      } catch (err) {
--+        console.log("Erro no resultado de voz (ignorado):", err);
--+      }
--+    };
--+
--+    recognition.onerror = (event: any) =>
--+      console.log("Erro voz:", event.error);
--+
--+    recognition.onend = () => {
--+      console.log("🔇 Fim da fala");
--+
--+      // repetir escuta se ainda estamos em modo voz
--+      if (voiceModeRef.current) {
--+        try {
--+          recognition.start();
--+        } catch {}
--+      }
--+    };
--+
--+    recognitionRef.current = recognition;
--+    setSupportsVoice(true);
--+
--+    return () => {
--+      try {
--+        recognition.stop();
--+      } catch {}
--+      recognitionRef.current = null;
--+    };
--+  }, []);
--+
--+  useEffect(() => {
--+    if (!recognitionRef.current) return;
--+
--+    voiceModeRef.current = voiceMode;
--+
--+    if (voiceMode) {
--+      setLastHeard("");
--+      try {
--+        recognitionRef.current.start();
--+      } catch (e) {
--+        console.log("Erro ao iniciar microfone:", e);
--+      }
--+    } else {
--+      try {
--+        recognitionRef.current.stop();
--+      } catch {}
--+    }
--+  }, [voiceMode]);
--+
--+  // ============================================================================
--+  // 🧹 PARAR AO SAIR
--+  // ============================================================================
--+  useEffect(() => {
--+    return () => {
--+      window.speechSynthesis.cancel();
--+      try {
--+        recognitionRef.current?.stop();
--+      } catch {}
--+    };
--+  }, []);
--+
--+  // ============================================================================
--+  // NORMALIZAR PASSOS
--+  // ============================================================================
--+  if (!recipe) {
--+    return (
--+      <div className="min-h-screen bg-beige flex items-center justify-center">
--+        <p className="text-charcoal">A carregar receita...</p>
--+      </div>
--+    );
--+  }
--+
--+  const rawSteps = recipe.steps;
--+
--+  const steps: string[] = Array.isArray(rawSteps)
--+    ? rawSteps.flatMap((item: any) =>
--+        item
--+          ?.toString()
--+          ?.split(/\n+/)
--+          .map((s: string) => s.trim())
--+          .filter((s: string) => s.length > 0)
--+      )
--+    : typeof rawSteps === "string"
--+    ? rawSteps
--+        .split(/\n+/)
--+        .map((s: string) => s.trim())
--+        .filter((s: string) => s.length > 0)
--+    : [];
--+
--+  // ============================================================================
--+  // FUNÇÕES DE NAVEGAÇÃO
--+  // ============================================================================
--+  function goBack(viaVoice = false) {
--+    if (currentStep <= 0) return;
--+
--+    setCurrentStep(prev => {
--+      const next = prev - 1;
--+      if (viaVoice) speak(steps[next]);
--+      return next;
--+    });
--+  }
--+
--+  function goNext(viaVoice = false) {
--+    if (currentStep >= steps.length - 1) return;
--+
--+    setCurrentStep(prev => {
--+      const next = prev + 1;
--+      if (viaVoice) speak(steps[next]);
--+      return next;
--+    });
--+  }
--+
--+  function repeatStep() {
--+    speak(steps[currentStep]);
--+  }
--+
--+  function goToStep(index: number) {
--+    const safe = Math.max(0, Math.min(index, steps.length - 1));
--+    setCurrentStep(safe);
--+    speak(steps[safe]);
--+  }
--+
--+  // ============================================================================
--+  // COMANDOS DE VOZ
--+  // ============================================================================
--+  function handleVoiceCommand(text: string) {
--+    const c = text.toLowerCase();
--+
--+    if (c.includes("próximo") || c.includes("seguinte") || c.includes("avançar"))
--+      return goNext(true);
--+
--+    if (c.includes("anterior") || c.includes("voltar") || c.includes("para trás"))
--+      return goBack(true);
--+
--+    if (c.includes("repete") || c.includes("repetir") || c.includes("outra vez"))
--+      return repeatStep();
--+
--+    if (c.includes("passo")) {
--+      const num = c.match(/\d+/);
--+      if (num) return goToStep(parseInt(num[0]) - 1);
--+    }
--+
--+    if (
--+      c.includes("começar receita") ||
--+      c.includes("iniciar receita") ||
--+      c.includes("começar do início")
--+    ) {
--+      return goToStep(0);
--+    }
--+
--+    if (c.includes("parar") || c.includes("stop")) {
--+      return stopVoiceMode();
--+    }
--+  }
--+
--+  // ============================================================================
--+  // ATIVAR / DESATIVAR MODO VOZ
--+  // ============================================================================
--+  function startVoiceMode() {
--+    if (!supportsVoice || !recognitionRef.current) return;
--+
--+    setVoiceMode(true);
--+  }
--+
--+  function stopVoiceMode() {
--+    setVoiceMode(false);
--+    setLastHeard("");
--+
--+    window.speechSynthesis.cancel();
--+  }
--+
--+  // ============================================================================
--+  // RENDER
--+  // ============================================================================
--+  return (
--+    <div className="min-h-screen bg-beige px-4 py-6">
--+      <div className="max-w-2xl mx-auto">
--+
--+        {/* VOLTAR */}
--+        <button
--+          onClick={() => {
--+            stopVoiceMode();
--+            navigate(-1);
--+          }}
--+          className="text-olive text-sm underline mb-4"
--+        >
--+          ← Voltar
--+        </button>
--+
--+        {/* TÍTULO */}
--+        <h1 className="text-3xl font-semibold text-olive text-center mb-2">
--+          Receita Passo-a-Passo
--+        </h1>
--+
--+        <p className="text-center text-charcoal/80 mb-6">
--+          {recipe.title}
--+        </p>
--+
--+        {/* PASSO */}
--+        <div className="bg-white border border-stone/30 rounded-2xl p-6 mb-8 shadow-sm">
--+          <p className="text-sm font-medium text-olive mb-2">
--+            Passo {currentStep + 1} de {steps.length}
--+          </p>
--+
--+          <p className="text-lg leading-relaxed text-charcoal">
--+            {steps[currentStep]}
--+          </p>
--+
--+          <button
--+            onClick={() => speak(steps[currentStep])}
--+            className="mt-4 px-4 py-2 bg-olive text-white rounded-xl hover:bg-olive/90 transition text-sm"
--+          >
--+            🔊 Ouvir passo
--+          </button>
--+        </div>
--+
--+        {/* BOTÕES */}
--+        <div className="flex justify-between gap-4">
--+          <button
--+            onClick={() => goBack(false)}
--+            disabled={currentStep === 0}
--+            className={`flex-1 py-3 rounded-xl text-white transition ${currentStep === 0
--+              ? "bg-olive/40 cursor-not-allowed"
--+              : "bg-olive hover:bg-olive/90"
--+              }`}
--+          >
--+            ← Anterior
--+          </button>
--+
--+          <button
--+            onClick={() => goNext(false)}
--+            disabled={currentStep === steps.length - 1}
--+            className={`flex-1 py-3 rounded-xl text-white transition ${currentStep === steps.length - 1
--+              ? "bg-olive/40 cursor-not-allowed"
--+              : "bg-olive hover:bg-olive/90"
--+              }`}
--+          >
--+            Próximo →
--+          </button>
--+        </div>
--+
--+        {/* MODO VOZ */}
--+        {supportsVoice ? (
--+          <div className="mt-8 mb-16 p-4 bg-[#F1E4D4] border border-stone/30 rounded-2xl">
--+            <h2 className="text-lg font-semibold text-olive mb-1">
--+              Modo Voz
--+            </h2>
--+            <p className="text-sm text-charcoal/80 mb-3">
--+              Diz: <strong>"próximo passo"</strong>, <strong>"anterior"</strong>,
--+              <strong>"repete"</strong>, <strong>"passo 3"</strong>,
--+              <strong>"começar receita"</strong>. Para sair, diz <strong>"parar"</strong>.
--+            </p>
--+
--+            <button
--+              onClick={voiceMode ? stopVoiceMode : startVoiceMode}
--+              className={`w-full py-2.5 rounded-xl text-sm font-medium text-white transition ${
--+                voiceMode ? "bg-olive/90" : "bg-olive hover:bg-olive/90"
--+              }`}
--+            >
--+              {voiceMode ? "🎤 A ouvir… tocar para parar" : "🎤 Ativar Modo Voz"}
--+            </button>
--+
--+            {lastHeard && (
--+              <p className="mt-2 text-xs text-charcoal">
--+                Ouvi: “{lastHeard}”
--+              </p>
--+            )}
--+          </div>
--+        ) : (
--+          <p className="mt-6 text-xs text-charcoal/60">
--+            O modo voz não é suportado neste navegador. Usa Google Chrome.
--+          </p>
--+        )}
--+      </div>
--+    </div>
--+  );
--+};
--+
--+export default CozinharPage;
-+import React, { useEffect, useState, useRef } from "react";
-+import { useParams, useNavigate } from "react-router-dom";
-+import { supabase } from "../lib/supabase";
-+
-+const CozinharPage: React.FC = () => {
-+  const { id } = useParams<{ id: string }>();
-+  const navigate = useNavigate();
-+
-+  const [recipe, setRecipe] = useState<any>(null);
-+  const [currentStep, setCurrentStep] = useState(0);
-+
-+  // --- MODO VOZ ---
-+  const [voiceMode, setVoiceMode] = useState(false);
-+  const [lastHeard, setLastHeard] = useState("");
-+  const [supportsVoice, setSupportsVoice] = useState(false);
-+  const recognitionRef = useRef<any | null>(null);
-+  const voiceModeRef = useRef(false);
-+
-+  // ============================================================================
-+  // 🔊 FALAR TEXTO (garantir que o microfone NÃO ouve a voz do computador)
-+  // ============================================================================
-+  function speak(text: string) {
-+    if (typeof window === "undefined") return;
-+
-+    // parar microfone enquanto fala
-+    try {
-+      recognitionRef.current?.stop();
-+    } catch {}
-+
-+    window.speechSynthesis.cancel();
-+
-+    const utter = new SpeechSynthesisUtterance(text);
-+    utter.lang = "pt-PT";
-+    utter.rate = 1;
-+
-+    utter.onend = () => {
-+      console.log("🔊 Fim da fala");
-+
-+      if (voiceModeRef.current && recognitionRef.current) {
-+        try {
-+          recognitionRef.current.start();
-+        } catch (e) {
-+          console.log("Erro ao reiniciar microfone:", e);
-+        }
-+      }
-+    };
-+
-+    window.speechSynthesis.speak(utter);
-+  }
-+
-+  // ============================================================================
-+  // 🔄 CARREGAR RECEITA
-+  // ============================================================================
-+  async function loadRecipe() {
-+    if (!id) return;
-+
-+    const { data, error } = await supabase
-+      .from("recipes")
-+      .select("*")
-+      .eq("id", id)
-+      .single();
-+
-+    if (!error && data) {
-+      setRecipe(data);
-+      setCurrentStep(0); // Não falar nada automaticamente
-+    }
-+  }
-+
-+  useEffect(() => {
-+    loadRecipe();
-+  }, [id]);
-+
-+  // ============================================================================
-+  // 🎤 CONFIGURAR WEBSPEECH + PATCH ANTI-CRASH PT-PT
-+  // ============================================================================
-+  useEffect(() => {
-+    if (typeof window === "undefined") return;
-+
-+    const SpeechRecognition =
-+      (window as any).SpeechRecognition ||
-+      (window as any).webkitSpeechRecognition;
-+
-+    if (!SpeechRecognition) {
-+      setSupportsVoice(false);
-+      return;
-+    }
-+
-+    const recognition = new SpeechRecognition();
-+
-+    // ✔ Idioma correto mas sem minificação problemática
-+    recognition.lang = "pt-PT";
-+    recognition.continuous = false;
-+    recognition.interimResults = false;
-+
-+    recognition.onstart = () => console.log("🎤 A ouvir…");
-+
-+    recognition.onresult = (event: any) => {
-+      try {
-+        let text = event.results?.[0]?.[0]?.transcript ?? "";
-+
-+        // PATCH ANTI-CRASH:
-+        // limpar caracteres invisíveis / tokens quebrados
-+        text = text
-+          .replace(/[^\p{L}\p{N}\s]/gu, "") // remove símbolos estranhos
-+          .normalize("NFC")
-+          .trim();
-+
-+        if (!text || text.length < 1) return;
-+
-+        setLastHeard(text.toLowerCase());
-+        handleVoiceCommand(text.toLowerCase());
-+      } catch (err) {
-+        console.log("Erro no resultado de voz (ignorado):", err);
-+      }
-+    };
-+
-+    recognition.onerror = (event: any) =>
-+      console.log("Erro voz:", event.error);
-+
-+    recognition.onend = () => {
-+      console.log("🔇 Fim da fala");
-+
-+      // repetir escuta se ainda estamos em modo voz
-+      if (voiceModeRef.current) {
-+        try {
-+          recognition.start();
-+        } catch {}
-+      }
-+    };
-+
-+    recognitionRef.current = recognition;
-+    setSupportsVoice(true);
-+
-+    return () => {
-+      try {
-+        recognition.stop();
-+      } catch {}
-+      recognitionRef.current = null;
-+    };
-+  }, []);
-+
-+  useEffect(() => {
-+    if (!recognitionRef.current) return;
-+
-+    voiceModeRef.current = voiceMode;
-+
-+    if (voiceMode) {
-+      setLastHeard("");
-+      try {
-+        recognitionRef.current.start();
-+      } catch (e) {
-+        console.log("Erro ao iniciar microfone:", e);
-+      }
-+    } else {
-+      try {
-+        recognitionRef.current.stop();
-+      } catch {}
-+    }
-+  }, [voiceMode]);
-+
-+  // ============================================================================
-+  // 🧹 PARAR AO SAIR
-+  // ============================================================================
-+  useEffect(() => {
-+    return () => {
-+      window.speechSynthesis.cancel();
-+      try {
-+        recognitionRef.current?.stop();
-+      } catch {}
-+    };
-+  }, []);
-+
-+  // ============================================================================
-+  // NORMALIZAR PASSOS
-+  // ============================================================================
-+  if (!recipe) {
-+    return (
-+      <div className="min-h-screen bg-beige flex items-center justify-center">
-+        <p className="text-charcoal">A carregar receita...</p>
-+      </div>
-+    );
-+  }
-+
-+  const rawSteps = recipe.steps;
-+
-+  const steps: string[] = Array.isArray(rawSteps)
-+    ? rawSteps.flatMap((item: any) =>
-+        item
-+          ?.toString()
-+          ?.split(/\n+/)
-+          .map((s: string) => s.trim())
-+          .filter((s: string) => s.length > 0)
-+      )
-+    : typeof rawSteps === "string"
-+    ? rawSteps
-+        .split(/\n+/)
-+        .map((s: string) => s.trim())
-+        .filter((s: string) => s.length > 0)
-+    : [];
-+
-+  // ============================================================================
-+  // FUNÇÕES DE NAVEGAÇÃO
-+  // ============================================================================
-+  function goBack(viaVoice = false) {
-+    if (currentStep <= 0) return;
-+
-+    setCurrentStep(prev => {
-+      const next = prev - 1;
-+      if (viaVoice) speak(steps[next]);
-+      return next;
-+    });
-+  }
-+
-+  function goNext(viaVoice = false) {
-+    if (currentStep >= steps.length - 1) return;
-+
-+    setCurrentStep(prev => {
-+      const next = prev + 1;
-+      if (viaVoice) speak(steps[next]);
-+      return next;
-+    });
-+  }
-+
-+  function repeatStep() {
-+    speak(steps[currentStep]);
-+  }
-+
-+  function goToStep(index: number) {
-+    const safe = Math.max(0, Math.min(index, steps.length - 1));
-+    setCurrentStep(safe);
-+    speak(steps[safe]);
-+  }
-+
-+  // ============================================================================
-+  // COMANDOS DE VOZ
-+  // ============================================================================
-+  function handleVoiceCommand(text: string) {
-+    const c = text.toLowerCase();
-+
-+    if (c.includes("próximo") || c.includes("seguinte") || c.includes("avançar"))
-+      return goNext(true);
-+
-+    if (c.includes("anterior") || c.includes("voltar") || c.includes("para trás"))
-+      return goBack(true);
-+
-+    if (c.includes("repete") || c.includes("repetir") || c.includes("outra vez"))
-+      return repeatStep();
-+
-+    if (c.includes("passo")) {
-+      const num = c.match(/\d+/);
-+      if (num) return goToStep(parseInt(num[0]) - 1);
-+    }
-+
-+    if (
-+      c.includes("começar receita") ||
-+      c.includes("iniciar receita") ||
-+      c.includes("começar do início")
-+    ) {
-+      return goToStep(0);
-+    }
-+
-+    if (c.includes("parar") || c.includes("stop")) {
-+      return stopVoiceMode();
-+    }
-+  }
-+
-+  // ============================================================================
-+  // ATIVAR / DESATIVAR MODO VOZ
-+  // ============================================================================
-+  function startVoiceMode() {
-+    if (!supportsVoice || !recognitionRef.current) return;
-+
-+    setVoiceMode(true);
-+  }
-+
-+  function stopVoiceMode() {
-+    setVoiceMode(false);
-+    setLastHeard("");
-+
-+    window.speechSynthesis.cancel();
-+  }
-+
-+  // ============================================================================
-+  // RENDER
-+  // ============================================================================
-+  return (
-+    <div className="min-h-screen bg-beige px-4 py-6">
-+      <div className="max-w-2xl mx-auto">
-+
-+        {/* VOLTAR */}
-+        <button
-+          onClick={() => {
-+            stopVoiceMode();
-+            navigate(-1);
-+          }}
-+          className="text-olive text-sm underline mb-4"
-+        >
-+          ← Voltar
-+        </button>
-+
-+        {/* TÍTULO */}
-+        <h1 className="text-3xl font-semibold text-olive text-center mb-2">
-+          Receita Passo-a-Passo
-+        </h1>
-+
-+        <p className="text-center text-charcoal/80 mb-6">
-+          {recipe.title}
-+        </p>
-+
-+        {/* PASSO */}
-+        <div className="bg-white border border-stone/30 rounded-2xl p-6 mb-8 shadow-sm">
-+          <p className="text-sm font-medium text-olive mb-2">
-+            Passo {currentStep + 1} de {steps.length}
-+          </p>
-+
-+          <p className="text-lg leading-relaxed text-charcoal">
-+            {steps[currentStep]}
-+          </p>
-+
-+          <button
-+            onClick={() => speak(steps[currentStep])}
-+            className="mt-4 px-4 py-2 bg-olive text-white rounded-xl hover:bg-olive/90 transition text-sm"
-+          >
-+            🔊 Ouvir passo
-+          </button>
-+        </div>
-+
-+        {/* BOTÕES */}
-+        <div className="flex justify-between gap-4">
-+          <button
-+            onClick={() => goBack(false)}
-+            disabled={currentStep === 0}
-+            className={`flex-1 py-3 rounded-xl text-white transition ${currentStep === 0
-+              ? "bg-olive/40 cursor-not-allowed"
-+              : "bg-olive hover:bg-olive/90"
-+              }`}
-+          >
-+            ← Anterior
-+          </button>
-+
-+          <button
-+            onClick={() => goNext(false)}
-+            disabled={currentStep === steps.length - 1}
-+            className={`flex-1 py-3 rounded-xl text-white transition ${currentStep === steps.length - 1
-+              ? "bg-olive/40 cursor-not-allowed"
-+              : "bg-olive hover:bg-olive/90"
-+              }`}
-+          >
-+            Próximo →
-+          </button>
-+        </div>
-+
-+        {/* MODO VOZ */}
-+        {supportsVoice ? (
-+          <div className="mt-8 mb-16 p-4 bg-[#F1E4D4] border border-stone/30 rounded-2xl">
-+            <h2 className="text-lg font-semibold text-olive mb-1">
-+              Modo Voz
-+            </h2>
-+            <p className="text-sm text-charcoal/80 mb-3">
-+              Diz: <strong>"próximo passo"</strong>, <strong>"anterior"</strong>,
-+              <strong>"repete"</strong>, <strong>"passo 3"</strong>,
-+              <strong>"começar receita"</strong>. Para sair, diz <strong>"parar"</strong>.
-+            </p>
-+
-+            <button
-+              onClick={voiceMode ? stopVoiceMode : startVoiceMode}
-+              className={`w-full py-2.5 rounded-xl text-sm font-medium text-white transition ${
-+                voiceMode ? "bg-olive/90" : "bg-olive hover:bg-olive/90"
-+              }`}
-+            >
-+              {voiceMode ? "🎤 A ouvir… tocar para parar" : "🎤 Ativar Modo Voz"}
-+            </button>
-+
-+            {lastHeard && (
-+              <p className="mt-2 text-xs text-charcoal">
-+                Ouvi: “{lastHeard}”
-+              </p>
-+            )}
-+          </div>
-+        ) : (
-+          <p className="mt-6 text-xs text-charcoal/60">
-+            O modo voz não é suportado neste navegador. Usa Google Chrome.
-+          </p>
-+        )}
-+      </div>
-+    </div>
-+  );
-+};
-+
-+export default CozinharPage;
+// src/pages/cozinhar.tsx (ou onde estiver este ficheiro)
+import React, { useEffect, useState, useRef } from "react";
+import { useParams, useNavigate } from "react-router-dom";
+import { supabase } from "../lib/supabase";
+
+const CozinharPage: React.FC = () => {
+  const { id } = useParams<{ id: string }>();
+  const navigate = useNavigate();
+
+  const [recipe, setRecipe] = useState<any>(null);
+  const [currentStep, setCurrentStep] = useState(0);
+
+  // --- MODO VOZ (WEB) ---
+  const [voiceMode, setVoiceMode] = useState(false);
+  const [lastHeard, setLastHeard] = useState("");
+  const [supportsVoice, setSupportsVoice] = useState(false);
+  const recognitionRef = useRef<any | null>(null);
+
+  // 🔊 FALAR PASSO + (SE MODO VOZ ATIVO) VOLTAR A OUVIR
+  function speakAndListen(text: string) {
+    if (typeof window === "undefined") return;
+
+    window.speechSynthesis.cancel();
+
+    const utter = new SpeechSynthesisUtterance(text);
+    utter.lang = "pt-PT";
+    utter.rate = 1;
+
+    utter.onend = () => {
+      // Se o modo voz estiver ativo, volta a abrir o microfone
+      if (voiceMode && recognitionRef.current) {
+        try {
+          recognitionRef.current.start();
+        } catch (e) {
+          console.log("Erro a reiniciar microfone após TTS:", e);
+        }
+      }
+    };
+
+    window.speechSynthesis.speak(utter);
+  }
+
+  async function loadRecipe() {
+    if (!id) return;
+
+    const { data, error } = await supabase
+      .from("recipes")
+      .select("*")
+      .eq("id", id)
+      .single();
+
+    if (!error && data) {
+      setRecipe(data);
+      setCurrentStep(0);
+    }
+  }
+
+  // Carregar receita
+  useEffect(() => {
+    loadRecipe();
+  }, [id]);
+
+  // Configurar reconhecimento de voz (Web Speech API)
+  useEffect(() => {
+    if (typeof window === "undefined") return;
+
+    const SpeechRecognition =
+      (window as any).SpeechRecognition ||
+      (window as any).webkitSpeechRecognition;
+
+    if (!SpeechRecognition) {
+      setSupportsVoice(false);
+      return;
+    }
+
+    const recognition = new SpeechRecognition();
+    recognition.lang = "pt-PT";
+    recognition.continuous = false;
+    recognition.interimResults = false;
+
+    recognition.onstart = () => {
+      console.log("🎤 A ouvir...");
+    };
+
+    recognition.onresult = (event: any) => {
+      const text =
+        event.results?.[0]?.[0]?.transcript?.toString() ?? "";
+      if (!text) return;
+
+      const lower = text.toLowerCase();
+      setLastHeard(lower);
+      handleVoiceCommand(lower);
+    };
+
+    recognition.onerror = (event: any) => {
+      console.log("Erro voz:", event);
+    };
+
+    recognition.onend = () => {
+      console.log("🔇 Fim da fala");
+      // NÃO desligamos o voiceMode aqui, só quando o utilizador disser parar ou carregar no botão
+    };
+
+    recognitionRef.current = recognition;
+    setSupportsVoice(true);
+
+    return () => {
+      try {
+        recognition.stop();
+      } catch (e) {
+        // ignore
+      }
+      recognitionRef.current = null;
+    };
+  }, []);
+
+  // Parar voz ao sair da página
+  useEffect(() => {
+    return () => {
+      if (typeof window !== "undefined") {
+        window.speechSynthesis.cancel();
+      }
+      try {
+        recognitionRef.current?.stop();
+      } catch {
+        // ignore
+      }
+    };
+  }, []);
+
+  if (!recipe) {
+    return (
+      <div className="min-h-screen bg-beige flex items-center justify-center">
+        <p className="text-charcoal">A carregar receita...</p>
+      </div>
+    );
+  }
+
+  const rawSteps = recipe.steps;
+
+  const steps: string[] = Array.isArray(rawSteps)
+    ? rawSteps
+        .flatMap((item: any) =>
+          item
+            ?.toString()
+            ?.split(/\n+/)
+            .map((s: string) => s.trim())
+            .filter((s: string) => s.length > 0)
+        )
+    : typeof rawSteps === "string"
+    ? rawSteps
+        .split(/\n+/)
+        .map((s: string) => s.trim())
+        .filter((s: string) => s.length > 0)
+    : [];
+
+  // ⬅️ VOLTAR UM PASSO (com opção de falar se vier do modo voz)
+  function goBack(viaVoice: boolean = false) {
+    if (currentStep <= 0 || !steps.length) return;
+
+    setCurrentStep((prev) => {
+      const next = Math.max(prev - 1, 0);
+      if (viaVoice && next !== prev) {
+        speakAndListen(steps[next]);
+      }
+      return next;
+    });
+  }
+
+  // ➡️ AVANÇAR UM PASSO
+  function goNext(viaVoice: boolean = false) {
+    if (currentStep >= steps.length - 1 || !steps.length) return;
+
+    setCurrentStep((prev) => {
+      const next = Math.min(prev + 1, steps.length - 1);
+      if (viaVoice && next !== prev) {
+        speakAndListen(steps[next]);
+      }
+      return next;
+    });
+  }
+
+  // 🔁 REPETIR PASSO
+  function repeatStep() {
+    if (!steps.length) return;
+    speakAndListen(steps[currentStep]);
+  }
+
+  // IR PARA UM PASSO ESPECÍFICO (ex: "passo 3")
+  function goToStep(index: number) {
+    if (!steps.length) return;
+
+    const safeIndex = Math.min(
+      Math.max(index, 0),
+      steps.length - 1
+    );
+
+    setCurrentStep(safeIndex);
+    speakAndListen(steps[safeIndex]);
+  }
+
+  // 🧠 INTERPRETAR COMANDOS DE VOZ
+  function handleVoiceCommand(text: string) {
+    const comando = text.toLowerCase();
+
+    if (
+      comando.includes("próximo") ||
+      comando.includes("seguinte") ||
+      comando.includes("avançar")
+    ) {
+      goNext(true);
+      return;
+    }
+
+    if (
+      comando.includes("anterior") ||
+      comando.includes("para trás") ||
+      comando.includes("voltar")
+    ) {
+      goBack(true);
+      return;
+    }
+
+    if (
+      comando.includes("repete") ||
+      comando.includes("repetir") ||
+      comando.includes("outra vez")
+    ) {
+      repeatStep();
+      return;
+    }
+
+    if (comando.includes("passo")) {
+      const numeroEncontrado = comando.match(/\d+/);
+      if (numeroEncontrado) {
+        const passoNumero = parseInt(numeroEncontrado[0], 10);
+        if (!isNaN(passoNumero)) {
+          goToStep(passoNumero - 1);
+          return;
+        }
+      }
+    }
+
+    if (
+      comando.includes("começar receita") ||
+      comando.includes("iniciar receita") ||
+      comando.includes("começar do início")
+    ) {
+      goToStep(0);
+      return;
+    }
+
+    if (comando.includes("parar") || comando.includes("stop")) {
+      stopVoiceMode();
+      return;
+    }
+
+    // Se não reconheceu, podemos simplesmente não fazer nada.
+    // Se quiseres no futuro, podemos pôr aqui uma resposta tipo:
+    // speakAndListen("Não percebi, tenta outra vez.");
+  }
+
+  // ▶️ ATIVAR MODO VOZ
+  function startVoiceMode() {
+    if (!supportsVoice || !recognitionRef.current || !steps.length) {
+      return;
+    }
+
+    setVoiceMode(true);
+    setLastHeard("");
+
+    // Fala o passo atual e, quando acabar de falar,
+    // o speakAndListen volta a abrir o microfone
+    speakAndListen(steps[currentStep]);
+  }
+
+  // ⏹ DESATIVAR MODO VOZ
+  function stopVoiceMode() {
+    setVoiceMode(false);
+    setLastHeard("");
+
+    if (typeof window !== "undefined") {
+      window.speechSynthesis.cancel();
+    }
+
+    if (recognitionRef.current) {
+      try {
+        recognitionRef.current.stop();
+      } catch (e) {
+        console.log("Erro ao parar reconhecimento:", e);
+      }
+    }
+  }
+
+  return (
+    <div className="min-h-screen bg-beige px-4 py-6">
+      <div className="max-w-2xl mx-auto">
+        {/* VOLTAR */}
+        <button
+          onClick={() => {
+            stopVoiceMode();
+            navigate(-1);
+          }}
+          className="text-olive text-sm underline mb-4"
+        >
+          ← Voltar
+        </button>
+
+        {/* TÍTULO */}
+        <h1 className="text-3xl font-semibold text-olive text-center mb-2">
+          Receita Passo-a-Passo
+        </h1>
+
+        <p className="text-center text-charcoal/80 mb-6">
+          {recipe.title}
+        </p>
+
+        {/* CAIXA DO PASSO */}
+        <div className="bg-white border border-stone/30 rounded-2xl p-6 mb-8 shadow-sm">
+          <p className="text-sm font-medium text-olive mb-2">
+            Passo {currentStep + 1} de {steps.length}
+          </p>
+
+          <p className="text-lg leading-relaxed text-charcoal">
+            {steps[currentStep]}
+          </p>
+
+          {/* 🔊 BOTÃO OUVIR PASSO (funciona com ou sem modo voz) */}
+          <button
+            onClick={() => speakAndListen(steps[currentStep])}
+            className="mt-4 px-4 py-2 bg-olive text-white rounded-xl 
+                       hover:bg-olive/90 transition text-sm"
+          >
+            🔊 Ouvir passo
+          </button>
+        </div>
+
+        {/* BOTÕES ANTERIOR / PRÓXIMO */}
+        <div className="flex justify-between gap-4">
+          <button
+            onClick={() => goBack(false)}
+            disabled={currentStep === 0}
+            className={`flex-1 py-3 rounded-xl text-white transition ${
+              currentStep === 0
+                ? "bg-olive/40 cursor-not-allowed"
+                : "bg-olive hover:bg-olive/90"
+            }`}
+          >
+            ← Anterior
+          </button>
+
+          <button
+            onClick={() => goNext(false)}
+            disabled={currentStep === steps.length - 1}
+            className={`flex-1 py-3 rounded-xl text-white transition ${
+              currentStep === steps.length - 1
+                ? "bg-olive/40 cursor-not-allowed"
+                : "bg-olive hover:bg-olive/90"
+            }`}
+          >
+            Próximo →
+          </button>
+        </div>
+
+        {/* 🟫 MODO VOZ - CAIXA IGUAL À APP */}
+        {supportsVoice ? (
+          <div className="mt-8 mb-16 p-4 bg-[#F1E4D4] border border-stone/30 rounded-2xl">
+            <h2 className="text-lg font-semibold text-olive mb-1">
+              Modo Voz
+            </h2>
+            <p className="text-sm text-charcoal/80 mb-3">
+              Controla a receita por voz:{" "}
+              <strong>"próximo passo"</strong>,{" "}
+              <strong>"anterior"</strong>,{" "}
+              <strong>"repete"</strong>,{" "}
+              <strong>"passo 3"</strong> ou{" "}
+              <strong>"começar receita"</strong>. Para sair,
+              diz <strong>"parar"</strong>.
+            </p>
+
+            <button
+              onClick={voiceMode ? stopVoiceMode : startVoiceMode}
+              className={`w-full py-2.5 rounded-xl text-sm font-medium text-white transition ${
+                voiceMode
+                  ? "bg-olive/90"
+                  : "bg-olive hover:bg-olive/90"
+              }`}
+            >
+              {voiceMode
+                ? "🎤 A ouvir… tocar para parar"
+                : "🎤 Ativar Modo Voz"}
+            </button>
+
+            {lastHeard && (
+              <p className="mt-2 text-xs text-charcoal">
+                Ouvi: “{lastHeard}”
+              </p>
+            )}
+          </div>
+        ) : (
+          <p className="mt-6 text-xs text-charcoal/60">
+            O modo voz não é suportado neste navegador. Tenta usar o
+            Google Chrome no computador ou telemóvel.
+          </p>
+        )}
+      </div>
+    </div>
+  );
+};
+
+export default CozinharPage;
