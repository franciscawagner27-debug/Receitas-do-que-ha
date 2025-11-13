import React from "react";
import AdminPanel from "../components/AdminPanel";
import Login from "../components/Login";
import { supabase } from "../lib/supabase";

export default function AdminPage() {
  const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-olive">
        A carregar...
      </div>
    );
  }

  const userEmail = session?.user?.email;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Login />
      </div>
    );
  }

  if (userEmail !== "franciscawagner27@gmail.com") {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Acesso negado.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-beige p-8">
      <h1 className="text-3xl mb-6 text-olive font-serif">
        Painel de Administração
      </h1>

      <AdminPanel
        email={userEmail}
        onLogout={() => supabase.auth.signOut()}
        onRecipeCreated={() => {}}
      />
    </div>
  );
}
