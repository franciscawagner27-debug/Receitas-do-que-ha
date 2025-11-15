export interface Recipe {
  id: string;
  title: string;
  image?: string;
  ingredients: string[];
  steps: string[];
  tags: string[];
  time_minutes?: number | null;
  priority?: number | null;
}
