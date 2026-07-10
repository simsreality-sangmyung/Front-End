import type { AdminItem } from '../types/adminItem';
import { mockAdminItems as initialItems } from './adminItems';

let items: AdminItem[] = [...initialItems];
let nextId = Math.max(...initialItems.map((item) => item.id), 0) + 1;

export function getMockAdminItems(): AdminItem[] {
  return [...items];
}

export function getMockAdminItem(id: number): AdminItem | undefined {
  return items.find((item) => item.id === id);
}

export function addMockAdminItem(
  item: Omit<AdminItem, 'id' | 'viewCount' | 'description'> & {
    viewCount?: number;
    description?: string;
  },
): AdminItem {
  const newItem: AdminItem = {
    description: '',
    viewCount: 0,
    ...item,
    id: nextId++,
  };
  items = [newItem, ...items];
  return newItem;
}

export function updateMockAdminItem(
  id: number,
  updates: Partial<Omit<AdminItem, 'id'>>,
): AdminItem | null {
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }

  items[index] = { ...items[index], ...updates };
  return items[index];
}

export function deleteMockAdminItem(id: number): boolean {
  const prevLength = items.length;
  items = items.filter((item) => item.id !== id);
  return items.length < prevLength;
}
