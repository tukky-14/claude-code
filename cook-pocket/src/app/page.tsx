'use client';

import { useEffect, useState } from 'react';
import { useRecipeStore } from '@/store/recipeStore';
import { getAllRecipes, initDB } from '@/lib/storage';
import { Recipe } from '@/types/recipe';
import RecipeCard from '@/components/RecipeCard';
import FilterPanel from '@/components/FilterPanel';
import AddRecipeModal from '@/components/AddRecipeModal';
import EditRecipeModal from '@/components/EditRecipeModal';

export default function Home() {
  const {
    recipes,
    filteredRecipes,
    selectedCategory,
    selectedTags,
    searchQuery,
    setCategory,
    setTags,
    setSearchQuery,
    filterRecipes,
    deleteRecipe,
    addRecipe,
    updateRecipe,
  } = useRecipeStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        await initDB();
        const storedRecipes = await getAllRecipes();
        useRecipeStore.setState({ recipes: storedRecipes });
        filterRecipes();
      } catch (error) {
        console.error('Failed to load recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipes();
  }, [filterRecipes]);

  const categories = Array.from(new Set(recipes.map(recipe => recipe.category).filter(Boolean)));

  const handleAddRecipe = () => {
    setIsAddModalOpen(true);
  };

  const handleSaveRecipe = async (recipeData: {
    url: string;
    title: string;
    category: string;
    tags: string[];
    image: string;
  }) => {
    try {
      await addRecipe(recipeData);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Failed to add recipe:', error);
    }
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsEditModalOpen(true);
  };

  const handleUpdateRecipe = async (id: string, recipeData: {
    url: string;
    title: string;
    category: string;
    tags: string[];
    image: string;
  }) => {
    try {
      await updateRecipe(id, recipeData);
      setIsEditModalOpen(false);
      setEditingRecipe(null);
    } catch (error) {
      console.error('Failed to update recipe:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Cook Pocket
            </h1>
            <button
              onClick={handleAddRecipe}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              レシピ追加
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterPanel
          categories={categories}
          selectedCategory={selectedCategory}
          selectedTags={selectedTags}
          searchQuery={searchQuery}
          onCategoryChange={setCategory}
          onTagsChange={setTags}
          onSearchChange={setSearchQuery}
        />

        {filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {recipes.length === 0 
                ? 'レシピがありません。最初のレシピを追加してみましょう！'
                : '該当するレシピが見つかりません。'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onEdit={handleEditRecipe}
                onDelete={deleteRecipe}
              />
            ))}
          </div>
        )}
      </main>

      <AddRecipeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveRecipe}
        existingCategories={categories}
      />

      <EditRecipeModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingRecipe(null);
        }}
        onSave={handleUpdateRecipe}
        recipe={editingRecipe}
        existingCategories={categories}
      />
    </div>
  );
}
