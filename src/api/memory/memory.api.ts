import { http } from '../http';
import type {
  MemorySetDTO,
  CreateMemorySetDTO,
  UpdateMemorySetDTO,
  MemoryPairDTO,
  CreatePairDTO,
  UpdatePairDTO,
} from './memory.types';

/* ---------- SETS ---------- */
export const listSets = () =>
  http.get<{ data: { sets: MemorySetDTO[] } }>('/memory/sets')
      .then(r => r.data.data.sets);

export const createSet = (dto: CreateMemorySetDTO) =>
  http.post<{ data: { set: MemorySetDTO } }>('/memory/sets', dto)
      .then(r => r.data.data.set);

export const updateSet = (id: string, dto: UpdateMemorySetDTO) =>
  http.patch<{ data: { set: MemorySetDTO } }>(`/memory/sets/${id}`, dto)
      .then(r => r.data.data.set);

export const deleteSet = (id: string) =>
  http.delete(`/memory/sets/${id}`);

/* ---------- PARES ---------- */
export const listPairs = (setId: string) =>
  http.get<{ data: { pairs: MemoryPairDTO[] } }>(`/memory/sets/${setId}/pairs`)
      .then(r => r.data.data.pairs);

export const addPair = (setId: string, dto: CreatePairDTO) =>
  http.post(`/memory/sets/${setId}/pairs`, dto);

export const updatePair = (setId: string, id: string, dto: UpdatePairDTO) =>
  http.patch(`/memory/sets/${setId}/pairs/${id}`, dto);

export const deletePair = (setId: string, id: string) =>
  http.delete(`/memory/sets/${setId}/pairs/${id}`);
