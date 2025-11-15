export interface Recipe {
  id: string;                     // ← OBRIGATÓRIO E STRING (UUID)
  title: string;
  image: string | null;

  ingredients: string[];
  steps: string[];
  tags: string[];

  time_minutes: number | null;    // ← só existe um campo, o correto

  priority: number | null;        // ← importante para o painel admin
}
