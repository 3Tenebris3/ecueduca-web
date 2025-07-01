import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient
} from '@tanstack/react-query';
import * as api from '../../api/scenarios/scenarios.api';
import type {
  SceneMetaDTO,
  UpdateSceneDTO
} from '../../api/scenarios/scenarios.types';

const invalidate = (qc: QueryClient) => () =>
  qc.invalidateQueries({ queryKey: ['scenarios'] });

export const useScenes = () =>
  useQuery<SceneMetaDTO[]>({
    queryKey: ['scenarios'],
    queryFn: api.listScenes
  });

export const useCreateScene = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.createScene, onSuccess: invalidate(qc) });
};

export const useUpdateScene = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateSceneDTO }) =>
      api.updateScene(id, dto),
    onSuccess: invalidate(qc)
  });
};

export const useDeleteScene = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.deleteScene, onSuccess: invalidate(qc) });
};
