diff --git a/src/pages/cozinhar.tsx b/src/pages/cozinhar.tsx
index 0c231a4a34c8abdc6c367964ffe1018ec6c0aca7..725e4bccd7aceea7f8bf8ae1ecd6d7559eba8489 100644
--- a/src/pages/cozinhar.tsx
+++ b/src/pages/cozinhar.tsx
@@ -1,41 +1,42 @@
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
+  const voiceModeRef = useRef(false);
 
   // ============================================================================
   // 🔊 FALAR TEXTO (garantir que o microfone NÃO ouve a voz do computador)
   // ============================================================================
   function speak(text: string) {
     if (typeof window === "undefined") return;
 
     // parar microfone enquanto fala
     try {
       recognitionRef.current?.stop();
     } catch {}
 
     window.speechSynthesis.cancel();
 
     const utter = new SpeechSynthesisUtterance(text);
     utter.lang = "pt-PT";
     utter.rate = 1;
 
     utter.onend = () => {
       console.log("🔊 Fim da fala");
 
       if (voiceMode && recognitionRef.current) {
         try {
           recognitionRef.current.start();
         } catch (e) {
@@ -98,66 +99,85 @@ const CozinharPage: React.FC = () => {
         let text = event.results?.[0]?.[0]?.transcript ?? "";
 
         // PATCH ANTI-CRASH:
         // limpar caracteres invisíveis / tokens quebrados
         text = text
           .replace(/[^\p{L}\p{N}\s]/gu, "") // remove símbolos estranhos
           .normalize("NFC")
           .trim();
 
         if (!text || text.length < 1) return;
 
         setLastHeard(text.toLowerCase());
         handleVoiceCommand(text.toLowerCase());
       } catch (err) {
         console.log("Erro no resultado de voz (ignorado):", err);
       }
     };
 
     recognition.onerror = (event: any) =>
       console.log("Erro voz:", event.error);
 
     recognition.onend = () => {
       console.log("🔇 Fim da fala");
 
       // repetir escuta se ainda estamos em modo voz
-      if (voiceMode) {
+      if (voiceModeRef.current) {
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
+  }, []);
+
+  useEffect(() => {
+    if (!recognitionRef.current) return;
+
+    voiceModeRef.current = voiceMode;
+
+    if (voiceMode) {
+      setLastHeard("");
+      try {
+        recognitionRef.current.start();
+      } catch (e) {
+        console.log("Erro ao iniciar microfone:", e);
+      }
+    } else {
+      try {
+        recognitionRef.current.stop();
+      } catch {}
+    }
   }, [voiceMode]);
 
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
 
@@ -229,67 +249,57 @@ const CozinharPage: React.FC = () => {
     if (c.includes("passo")) {
       const num = c.match(/\d+/);
       if (num) return goToStep(parseInt(num[0]) - 1);
     }
 
     if (
       c.includes("começar receita") ||
       c.includes("iniciar receita") ||
       c.includes("começar do início")
     ) {
       return goToStep(0);
     }
 
     if (c.includes("parar") || c.includes("stop")) {
       return stopVoiceMode();
     }
   }
 
   // ============================================================================
   // ATIVAR / DESATIVAR MODO VOZ
   // ============================================================================
   function startVoiceMode() {
     if (!supportsVoice || !recognitionRef.current) return;
 
     setVoiceMode(true);
-    setLastHeard("");
-
-    try {
-      recognitionRef.current.start();
-    } catch (e) {
-      console.log("Erro ao iniciar microfone:", e);
-    }
   }
 
   function stopVoiceMode() {
     setVoiceMode(false);
     setLastHeard("");
 
     window.speechSynthesis.cancel();
-    try {
-      recognitionRef.current?.stop();
-    } catch {}
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
 
