'use client';

import { Recipe } from '@/types/recipe';
import Image from 'next/image';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit?: (recipe: Recipe) => void;
  onDelete?: (id: string) => void;
}

export default function RecipeCard({ recipe, onEdit, onDelete }: RecipeCardProps) {
  const handleCardClick = () => {
    window.open(recipe.url, '_blank', 'noopener,noreferrer');
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(recipe);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(recipe.id);
  };

  return (
    <div 
      className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer bg-white dark:bg-gray-800"
      onClick={handleCardClick}
    >
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-md mb-3 overflow-hidden">
        {recipe.image ? (
          <Image
            src={recipe.image}
            alt={recipe.title}
            width={300}
            height={200}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                parent.innerHTML = '<div class="w-full h-full flex items-center justify-center text-gray-500">No Image</div>';
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>
      
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{recipe.title}</h3>
      
      <div className="flex flex-wrap gap-2 mb-2">
        {recipe.category && (
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-sm text-xs">
            {recipe.category}
          </span>
        )}
        {recipe.tags.map((tag, index) => (
          <span 
            key={index} 
            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-sm text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-3">
        <span className="text-xs text-gray-500">
          {new Date(recipe.createdAt).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleEditClick}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            編集
          </button>
          <button
            onClick={handleDeleteClick}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  );
}