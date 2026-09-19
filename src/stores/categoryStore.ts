import { create } from 'zustand';
import { demoStorage } from '../lib/storage';
import type { Category } from '../db/schema';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  refresh: () => Promise<void>;
  create: (data: Pick<Category, 'name' | 'icon' | 'color' | 'type'>) => Promise<void>;
  update: (id: number, data: Partial<Category>) => Promise<void>;
  archive: (id: number) => Promise<void>;
  unarchive: (id: number) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: demoStorage.getCategories(),
  loading: false,
  refresh: async () => {
    const categories = demoStorage.getCategories();
    set({ categories, loading: false });
  },
  create: async (data) => {
    const categories = get().categories;
    const newCat: Category = {
      id: Date.now(),
      name: data.name,
      icon: data.icon,
      color: data.color,
      type: data.type,
      isDefault: false,
      isArchived: false,
    };
    const updated = [...categories, newCat];
    demoStorage.saveCategories(updated);
    set({ categories: updated });
  },
  update: async (id, data) => {
    const updated = get().categories.map(c => c.id === id ? { ...c, ...data } : c);
    demoStorage.saveCategories(updated);
    set({ categories: updated });
  },
  archive: async (id) => {
    const updated = get().categories.map(c => c.id === id ? { ...c, isArchived: true } : c);
    demoStorage.saveCategories(updated);
    set({ categories: updated });
  },
  unarchive: async (id) => {
    const updated = get().categories.map(c => c.id === id ? { ...c, isArchived: false } : c);
    demoStorage.saveCategories(updated);
    set({ categories: updated });
  },
}));
