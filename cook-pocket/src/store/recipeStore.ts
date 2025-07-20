import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { Recipe, RecipeStore } from '@/types/recipe';
import { addRecipe as addRecipeToStorage, updateRecipe as updateRecipeInStorage, deleteRecipe as deleteRecipeFromStorage } from '@/lib/storage';

export const useRecipeStore = create<RecipeStore>((set, get) => ({
  recipes: [],
  filteredRecipes: [],
  selectedCategory: '',
  selectedTags: [],
  searchQuery: '',

  addRecipe: async (recipeData) => {
    const recipe: Recipe = {
      ...recipeData,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await addRecipeToStorage(recipe);
    
    set((state) => ({
      recipes: [...state.recipes, recipe],
    }));
    
    get().filterRecipes();
  },

  updateRecipe: async (id, updatedData) => {
    const { recipes } = get();
    const recipeIndex = recipes.findIndex(r => r.id === id);
    
    if (recipeIndex === -1) return;
    
    const updatedRecipe = {
      ...recipes[recipeIndex],
      ...updatedData,
      updatedAt: new Date(),
    };

    await updateRecipeInStorage(updatedRecipe);
    
    set((state) => ({
      recipes: state.recipes.map(r => r.id === id ? updatedRecipe : r),
    }));
    
    get().filterRecipes();
  },

  deleteRecipe: async (id) => {
    await deleteRecipeFromStorage(id);
    
    set((state) => ({
      recipes: state.recipes.filter(r => r.id !== id),
    }));
    
    get().filterRecipes();
  },

  setCategory: (category) => {
    set({ selectedCategory: category });
    get().filterRecipes();
  },

  setTags: (tags) => {
    set({ selectedTags: tags });
    get().filterRecipes();
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().filterRecipes();
  },

  filterRecipes: () => {
    const { recipes, selectedCategory, selectedTags, searchQuery } = get();
    
    let filtered = recipes;

    if (selectedCategory) {
      filtered = filtered.filter(recipe => recipe.category === selectedCategory);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(recipe => 
        selectedTags.some(tag => recipe.tags.includes(tag))
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(query) ||
        recipe.url.toLowerCase().includes(query)
      );
    }

    set({ filteredRecipes: filtered });
  },
}));