import type { User } from '../types/user';
import { mockUsers as initialUsers } from './users';

let users: User[] = [...initialUsers];
let nextId = Math.max(...initialUsers.map((user) => user.id), 0) + 1;

export function getMockUsers(): User[] {
  return [...users];
}

export function getMockUser(id: number): User | undefined {
  return users.find((user) => user.id === id);
}

export function addMockUser(
  user: Omit<User, 'id' | 'twinCount' | 'status' | 'joinedAt' | 'lastLoginAt'> & {
    twinCount?: number;
    status?: User['status'];
    joinedAt?: string;
    lastLoginAt?: string;
  },
): User {
  const newUser: User = {
    twinCount: 0,
    status: '대기',
    joinedAt: '',
    lastLoginAt: '방금 전',
    ...user,
    id: nextId++,
  };
  users = [newUser, ...users];
  return newUser;
}

export function updateMockUser(
  id: number,
  updates: Partial<Omit<User, 'id'>>,
): User | null {
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    return null;
  }

  users[index] = { ...users[index], ...updates };
  return users[index];
}

export function deleteMockUser(id: number): boolean {
  const prevLength = users.length;
  users = users.filter((user) => user.id !== id);
  return users.length < prevLength;
}
