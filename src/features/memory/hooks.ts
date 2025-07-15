import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as api from '../../api/memory/memory.api';
import type {
  MemorySetDTO, UpdateMemorySetDTO, 
  MemoryPairDTO, CreatePairDTO, UpdatePairDTO
} from '../../api/memory/memory.types';

const invalidate = (qc: QueryClient) => () =>
  qc.invalidateQueries({ queryKey: ['memory'] });

/* ---------- SETS ---------- */
export const useMemorySets = () =>
  useQuery<MemorySetDTO[]>({ queryKey: ['memory'], queryFn: api.listSets });

export const useCreateSet = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.createSet, onSuccess: invalidate(qc) });
};
export const useUpdateSet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateMemorySetDTO }) =>
      api.updateSet(id, dto),
    onSuccess: invalidate(qc)
  });
};
export const useDeleteSet = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.deleteSet, onSuccess: invalidate(qc) });
};

/* ---------- PARES ---------- */
export const usePairs = (setId: string) =>
  useQuery<MemoryPairDTO[]>({
    queryKey: ['memory', setId, 'pairs'],
    queryFn: () => api.listPairs(setId)
  });

export const useAddPair = (setId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreatePairDTO) => api.addPair(setId, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['memory', setId, 'pairs'] })
  });
};
export const useUpdatePair = (setId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdatePairDTO }) =>
      api.updatePair(setId, id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['memory', setId, 'pairs'] })
  });
};
export const useDeletePair = (setId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deletePair(setId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['memory', setId, 'pairs'] })
  });
};
