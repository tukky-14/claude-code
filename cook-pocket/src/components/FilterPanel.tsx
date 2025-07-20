'use client';

interface FilterPanelProps {
  categories: string[];
  selectedCategory: string;
  selectedTags: string[];
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onTagsChange: (tags: string[]) => void;
  onSearchChange: (query: string) => void;
}

export default function FilterPanel({
  categories,
  selectedCategory,
  selectedTags,
  searchQuery,
  onCategoryChange,
  onTagsChange,
  onSearchChange,
}: FilterPanelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">カテゴリ</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">すべて</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">タグ</label>
          <input
            type="text"
            placeholder="タグを入力（カンマ区切り）"
            value={selectedTags.join(', ')}
            onChange={(e) => {
              const tags = e.target.value
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag);
              onTagsChange(tags);
            }}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">検索</label>
          <input
            type="text"
            placeholder="タイトルやURLで検索"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  );
}