'use client';

import { useState, useEffect } from 'react';
import Modal from './Modal';
import { Recipe } from '@/types/recipe';
import { fetchMetadata, validateUrl, normalizeUrl } from '@/utils/metadata';
import { splitTags, joinTags, validateTagCount, getTagCount } from '@/utils/tagUtils';

interface EditRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, recipeData: {
    url: string;
    title: string;
    category: string;
    tags: string[];
    image: string;
  }) => void;
  recipe: Recipe | null;
  existingCategories: string[];
}

export default function EditRecipeModal({ 
  isOpen, 
  onClose, 
  onSave, 
  recipe,
  existingCategories 
}: EditRecipeModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (recipe) {
      setUrl(recipe.url);
      setTitle(recipe.title);
      setCategory(recipe.category);
      setNewCategory('');
      setTags(joinTags(recipe.tags));
      setImage(recipe.image);
      setErrors({});
    }
  }, [recipe]);

  const handleUrlChange = async (inputUrl: string) => {
    setUrl(inputUrl);
    setErrors({ ...errors, url: '' });

    if (!inputUrl.trim()) {
      return;
    }

    const normalizedUrl = normalizeUrl(inputUrl);
    
    if (!validateUrl(normalizedUrl)) {
      setErrors({ ...errors, url: '有効なURLを入力してください' });
      return;
    }

    if (normalizedUrl === recipe?.url) {
      return;
    }

    setIsLoading(true);
    try {
      const metadata = await fetchMetadata(normalizedUrl);
      setTitle(metadata.title);
      setImage(metadata.image);
      setUrl(normalizedUrl);
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
      setTitle(new URL(normalizedUrl).hostname);
      setImage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipe) return;

    const newErrors: Record<string, string> = {};
    
    if (!url.trim()) {
      newErrors.url = 'URLは必須です';
    } else if (!validateUrl(url)) {
      newErrors.url = '有効なURLを入力してください';
    }
    
    if (!title.trim()) {
      newErrors.title = 'タイトルは必須です';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const selectedCategory = newCategory.trim() || category;
    const tagArray = splitTags(tags).slice(0, 5); // 最大5つまで

    onSave(recipe.id, {
      url: url.trim(),
      title: title.trim(),
      category: selectedCategory,
      tags: tagArray,
      image: image.trim(),
    });

    handleClose();
  };

  const handleClose = () => {
    setUrl('');
    setTitle('');
    setCategory('');
    setNewCategory('');
    setTags('');
    setImage('');
    setErrors({});
    setIsLoading(false);
    onClose();
  };

  if (!recipe) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="レシピを編集">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            URL *
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className={`w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
              errors.url ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="https://example.com/recipe"
            disabled={isLoading}
          />
          {errors.url && (
            <p className="text-red-500 text-sm mt-1">{errors.url}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            タイトル *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full p-3 border rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
              errors.title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="レシピのタイトル"
            disabled={isLoading}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            カテゴリ
          </label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (e.target.value !== 'new') {
                setNewCategory('');
              }
            }}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 appearance-none cursor-pointer mb-2"
            style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
          >
            <option value="">選択してください</option>
            {existingCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="new">新しいカテゴリを作成</option>
          </select>
          
          {category === 'new' && (
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
              placeholder="新しいカテゴリ名"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            タグ (最大5つ)
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (validateTagCount(inputValue, 5)) {
                setTags(inputValue);
              }
            }}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            placeholder="タグを区切りで入力（例: 和食、簡単、10分）"
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              「、」または「,」で区切って入力してください
            </p>
            <p className={`text-xs ${
              getTagCount(tags) > 5 
                ? 'text-red-500' 
                : 'text-gray-500 dark:text-gray-400'
            }`}>
              {getTagCount(tags)}/5
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            画像URL
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
            placeholder="画像のURL"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-medium rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
            disabled={isLoading}
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.49 8.49l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.49-8.49l2.83-2.83" />
                </svg>
                <span>取得中...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>更新</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}