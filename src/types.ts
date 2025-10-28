export interface Recipe {
  id: string
  title: string
  image?: string
  ingredients: string[]
  steps: string[]
  time_minutes?: number
  tags?: string[]
  created_at?: string
}
