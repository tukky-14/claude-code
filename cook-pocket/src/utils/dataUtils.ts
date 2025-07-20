import { Recipe } from '@/types/recipe';

export interface ExportData {
  version: string;
  exportedAt: string;
  recipes: Recipe[];
  totalCount: number;
}

export interface ImportResult {
  success: boolean;
  importedCount: number;
  skippedCount: number;
  errorCount: number;
  errors: string[];
}

// データをエクスポートする関数
export function exportRecipes(recipes: Recipe[]): ExportData {
  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    recipes: recipes.map(recipe => ({
      ...recipe,
      createdAt: new Date(recipe.createdAt),
      updatedAt: new Date(recipe.updatedAt),
    })),
    totalCount: recipes.length,
  };
}

// エクスポートデータをJSONファイルとしてダウンロードする関数
export function downloadExportFile(data: ExportData, filename?: string): void {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const defaultFilename = `cook-pocket-recipes-${new Date().toISOString().split('T')[0]}.json`;
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || defaultFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// インポートファイルを読み込む関数
export function readImportFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('ファイルの読み込みに失敗しました'));
      }
    };
    reader.onerror = () => reject(new Error('ファイルの読み込みエラー'));
    reader.readAsText(file);
  });
}

// インポートデータをバリデーションする関数
export function validateImportData(jsonString: string): { isValid: boolean; data?: ExportData; error?: string } {
  try {
    const data = JSON.parse(jsonString);
    
    // 基本構造のチェック
    if (!data || typeof data !== 'object') {
      return { isValid: false, error: 'データ形式が正しくありません' };
    }
    
    if (!data.recipes || !Array.isArray(data.recipes)) {
      return { isValid: false, error: 'レシピデータが見つかりません' };
    }
    
    // レシピデータの基本チェック
    for (let i = 0; i < data.recipes.length; i++) {
      const recipe = data.recipes[i];
      if (!recipe.id || !recipe.url || !recipe.title) {
        return { isValid: false, error: `レシピ${i + 1}に必須項目が不足しています` };
      }
    }
    
    return { isValid: true, data };
  } catch {
    return { isValid: false, error: 'JSONファイルの形式が正しくありません' };
  }
}

// レシピデータを正規化する関数
export function normalizeRecipeData(recipe: Partial<Recipe> & { id: string; url: string; title: string }): Recipe {
  return {
    id: recipe.id || '',
    url: recipe.url || '',
    title: recipe.title || '',
    category: recipe.category || '',
    tags: Array.isArray(recipe.tags) ? recipe.tags : [],
    image: recipe.image || '',
    createdAt: recipe.createdAt ? new Date(recipe.createdAt) : new Date(),
    updatedAt: recipe.updatedAt ? new Date(recipe.updatedAt) : new Date(),
  };
}

// インポートデータを処理する関数
export function processImportData(
  importData: ExportData, 
  existingRecipes: Recipe[], 
  mode: 'replace' | 'merge' = 'merge'
): ImportResult {
  const result: ImportResult = {
    success: true,
    importedCount: 0,
    skippedCount: 0,
    errorCount: 0,
    errors: [],
  };
  
  try {
    const existingIds = new Set(existingRecipes.map(r => r.id));
    const processedRecipes: Recipe[] = [];
    
    for (const recipeData of importData.recipes) {
      try {
        const recipe = normalizeRecipeData(recipeData);
        
        if (mode === 'merge' && existingIds.has(recipe.id)) {
          result.skippedCount++;
          continue;
        }
        
        processedRecipes.push(recipe);
        result.importedCount++;
      } catch {
        result.errorCount++;
        result.errors.push(`レシピ「${recipeData.title || 'Unknown'}」の処理に失敗しました`);
      }
    }
    
    return result;
  } catch {
    result.success = false;
    result.errors.push('データの処理中にエラーが発生しました');
    return result;
  }
}

// ファイル拡張子をチェックする関数
export function isValidImportFile(file: File): boolean {
  return file.type === 'application/json' || file.name.toLowerCase().endsWith('.json');
}