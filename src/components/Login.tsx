import React, { useState } from "react";
import { supabase } from "../lib/supabase";

const Login: React.FC = () => {
const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Ajusta se usares outro domínio em produção:
        emailRedirectTo: window.location.origin,
      },
    });

    setLoading(false);

    if (error) {
      console.error(error);
      setError("Não foi possível enviar o link. Tenta novamente.");
    } else {
      setSent(true);
    }
  };

  return (
    <div className="bg-white/90 border border-olive/20 rounded-2xl p-6 shadow-soft">
      <h3 className="text-xl font-serif text-olive mb-2">
        Login área privada
      </h3>
      <p className="text-sm text-charcoal/80 mb-4">
        Insere o teu email para receber um link de acesso.
      </p>

      {sent ? (
        <p className="text-sm text-olive">
          ✉️ Enviámos um link de acesso para <b>{email}</b>. Abre o email e
          clica no link para entrar.
        </p>
      ) : (
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-olive/30 px-4 py-2 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-olive/40"
            required
          />
          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-olive text-white text-sm font-medium py-2 rounded-xl hover:bg-olive/90 transition disabled:opacity-60"
          >
            {loading ? "A enviar link..." : "Entrar com magic link"}
          </button>
        </form>
      )}
    </div>
  );
};

export default Login; 
