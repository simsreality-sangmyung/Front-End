import { useQuery, useMutation } from '@tanstack/react-query';

export function useApiQuery(request: any, options = {}, extraKey?: unknown) {
  return useQuery({
    queryKey: request.key(extraKey),
    queryFn: () => request.execute(),
    ...options,
  });
}

export function useApiMutation(request: any, options = {}) {
  return useMutation({
    mutationFn: (data) => request.execute({ data }),
    ...options,
  });
}