export interface Category {
  id: string;
  name: string;
  image?: string;
}

export interface Story {
  id: string;
  title: string;
  description: string;
  content: string;
  categoryId: string;
  image?: string;
  author?: string;
  date?: string;
}

export type ThemeMode = "light" | "dark";
