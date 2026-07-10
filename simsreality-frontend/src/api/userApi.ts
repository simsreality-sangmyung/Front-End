import {
  addMockUser,
  deleteMockUser,
  getMockUsers,
  updateMockUser,
} from '../mocks/userStore';
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
  UserSearchParams,
} from '../types/user';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function filterUsers(users: User[], params: UserSearchParams): User[] {
  const keyword = params.keyword?.trim().toLowerCase();
  const role = params.role;
  const status = params.status;

  return users.filter((user) => {
    if (keyword) {
      const haystack = [user.name, user.email].join(' ').toLowerCase();
      if (!haystack.includes(keyword)) {
        return false;
      }
    }
    if (role && role !== 'all' && user.role !== role) {
      return false;
    }
    if (status && status !== 'all' && user.status !== status) {
      return false;
    }
    return true;
  });
}

function formatToday(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function fetchUsers(
  params: UserSearchParams = {},
): Promise<User[]> {
  await delay(400);
  return filterUsers(getMockUsers(), params);
}

export async function createUser(input: CreateUserInput): Promise<User> {
  await delay(400);
  return addMockUser({
    name: input.name,
    email: input.email,
    role: input.role,
    plan: input.plan,
    twinCount: 0,
    status: '대기',
    joinedAt: formatToday(),
    lastLoginAt: '방금 전',
  });
}

export async function updateUser(input: UpdateUserInput): Promise<User> {
  await delay(300);
  const updated = updateMockUser(input.id, {
    role: input.role,
    plan: input.plan,
    status: input.status,
  });
  if (!updated) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  return updated;
}

export async function toggleUserSuspend(id: number): Promise<User> {
  await delay(300);
  const current = getMockUsers().find((user) => user.id === id);
  if (!current) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  const nextStatus = current.status === '정지' ? '활성' : '정지';
  const updated = updateMockUser(id, { status: nextStatus });
  if (!updated) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
  return updated;
}

export async function deleteUser(id: number): Promise<void> {
  await delay(300);
  const deleted = deleteMockUser(id);
  if (!deleted) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }
}

export const usersQueryKey = (params: UserSearchParams) =>
  ['users', params] as const;
