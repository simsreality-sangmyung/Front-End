import { useQuery, useMutation } from '@tanstack/react-query';

export function useApiQuery(request, options = {}, extraKey) {
  return useQuery({
    queryKey: request.key(extraKey),
    queryFn: () => request.execute(),
    ...options,
  });
}

export function useApiMutation(request, options = {}) {
  return useMutation({
    mutationFn: (override) => request.execute(override),
    ...options,
  });
}
