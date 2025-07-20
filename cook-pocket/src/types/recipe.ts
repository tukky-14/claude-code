export interface Recipe {
  id: string;
  url: string;
  title: string;
  category: string;
  tags: string[];
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeStore {
  recipes: Recipe[];
  filteredRecipes: Recipe[];
  selectedCategory: string;
  selectedTags: string[];
  searchQuery: string;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  setCategory: (category: string) => void;
  setTags: (tags: string[]) => void;
  setSearchQuery: (query: string) => void;
  filterRecipes: () => void;
}