'use client';

import { useState } from 'react';
import Modal from './Modal';
import { fetchMetadata, validateUrl, normalizeUrl } from '@/utils/metadata';

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipeData: {
    url: string;
    title: string;
    category: string;
    tags: string[];
    image: string;
  }) => void;
  existingCategories: string[];
}

export default function AddRecipeModal({ 
  isOpen, 
  onClose, 
  onSave, 
  existingCategories 
}: AddRecipeModalProps) {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleUrlChange = async (inputUrl: string) => {
    setUrl(inputUrl);
    setErrors({ ...errors, url: '' });

    if (!inputUrl.trim()) {
      setTitle('');
      setImage('');
      return;
    }

    const normalizedUrl = normalizeUrl(inputUrl);
    
    if (!validateUrl(normalizedUrl)) {
      setErrors({ ...errors, url: '有効なURLを入力してください' });
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
    const tagArray = tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);

    onSave({
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="レシピを追加">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            URL *
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => handleUrlChange(e.target.value)}
            className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 ${
              errors.url ? 'border-red-500' : ''
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
            className={`w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 ${
              errors.title ? 'border-red-500' : ''
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
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 mb-2"
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
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              placeholder="新しいカテゴリ名"
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            タグ
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            placeholder="タグをカンマ区切りで入力（例: 和食, 簡単, 10分）"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            画像URL
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
            placeholder="画像のURL（自動取得されます）"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            disabled={isLoading}
          >
            キャンセル
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? '取得中...' : '保存'}
          </button>
        </div>
      </form>
    </Modal>
  );
}