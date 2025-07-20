'use client';

import { useEffect, useState } from 'react';
import { useRecipeStore } from '@/store/recipeStore';
import { getAllRecipes, initDB } from '@/lib/storage';
import { Recipe } from '@/types/recipe';
import RecipeCard from '@/components/RecipeCard';
import FilterPanel from '@/components/FilterPanel';
import AddRecipeModal from '@/components/AddRecipeModal';
import EditRecipeModal from '@/components/EditRecipeModal';
import ConfirmDialog from '@/components/ConfirmDialog';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingRecipe, setDeletingRecipe] = useState<Recipe | null>(null);

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

  const handleDeleteRecipe = (recipeId: string) => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (recipe) {
      setDeletingRecipe(recipe);
      setShowDeleteConfirm(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (deletingRecipe) {
      try {
        await deleteRecipe(deletingRecipe.id);
        setShowDeleteConfirm(false);
        setDeletingRecipe(null);
      } catch (error) {
        console.error('Failed to delete recipe:', error);
      }
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
      <header className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-2">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Cook Pocket
                </h1>
                <p className="text-white/80 text-sm">あなただけのレシピコレクション</p>
              </div>
            </div>
            <button
              onClick={handleAddRecipe}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>レシピを追加</span>
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
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-full flex items-center justify-center">
                {recipes.length === 0 ? (
                  <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ) : (
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {recipes.length === 0 
                  ? 'レシピコレクションを始めましょう！'
                  : '該当するレシピが見つかりません'
                }
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {recipes.length === 0 
                  ? 'お気に入りのレシピURLを追加して、あなただけのレシピコレクションを作成してください。'
                  : 'フィルターを調整するか、新しいレシピを追加してみてください。'
                }
              </p>
              {recipes.length === 0 && (
                <button
                  onClick={handleAddRecipe}
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>最初のレシピを追加</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onEdit={handleEditRecipe}
                onDelete={handleDeleteRecipe}
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

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletingRecipe(null);
        }}
        onConfirm={handleConfirmDelete}
        title="レシピを削除"
        message={deletingRecipe ? `「${deletingRecipe.title}」を削除してもよろしいですか？この操作は元に戻せません。` : ''}
        confirmText="削除する"
        cancelText="キャンセル"
        variant="danger"
      />
    </div>
  );
}
