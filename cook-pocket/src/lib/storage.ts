import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Recipe } from '@/types/recipe';

interface RecipeDB extends DBSchema {
  recipes: {
    key: string;
    value: Recipe;
  };
}

const DB_NAME = 'cook-pocket-db';
const DB_VERSION = 1;

let db: IDBPDatabase<RecipeDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<RecipeDB>> {
  if (db) return db;

  db = await openDB<RecipeDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('recipes')) {
        db.createObjectStore('recipes', {
          keyPath: 'id',
        });
      }
    },
  });

  return db;
}

export async function getAllRecipes(): Promise<Recipe[]> {
  const database = await initDB();
  return database.getAll('recipes');
}

export async function addRecipe(recipe: Recipe): Promise<void> {
  const database = await initDB();
  await database.add('recipes', recipe);
}

export async function updateRecipe(recipe: Recipe): Promise<void> {
  const database = await initDB();
  await database.put('recipes', recipe);
}

export async function deleteRecipe(id: string): Promise<void> {
  const database = await initDB();
  await database.delete('recipes', id);
}

export async function clearAllRecipes(): Promise<void> {
  const database = await initDB();
  await database.clear('recipes');
}