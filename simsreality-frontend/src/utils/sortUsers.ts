import type { User, UserSortOption } from '../types/user';

export function sortUsers(users: User[], sort: UserSortOption): User[] {
  const sorted = [...users];

  switch (sort) {
    case 'joined-desc':
      return sorted.sort(
        (a, b) => b.joinedAt.localeCompare(a.joinedAt) || b.id - a.id,
      );
    case 'joined-asc':
      return sorted.sort(
        (a, b) => a.joinedAt.localeCompare(b.joinedAt) || a.id - b.id,
      );
    case 'twin-desc':
      return sorted.sort((a, b) => b.twinCount - a.twinCount || b.id - a.id);
    case 'twin-asc':
      return sorted.sort((a, b) => a.twinCount - b.twinCount || a.id - b.id);
    default:
      return sorted;
  }
}
