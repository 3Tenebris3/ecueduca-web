import { http } from '../../api/http';
import type {
  SceneMetaDTO,
  CreateSceneDTO,
  UpdateSceneDTO
} from './scenarios.types';

/* alumno + admin */
export const listScenes = () =>
  http
    .get<{ data: { scenes: SceneMetaDTO[] } }>('/scenarios')
    .then((r) => r.data.data.scenes);

/* admin CRUD */
export const createScene = (dto: CreateSceneDTO) =>
  http
    .post<{ data: { scene: SceneMetaDTO } }>('/scenarios', dto)
    .then((r) => r.data.data.scene);

export const updateScene = (id: string, dto: UpdateSceneDTO) =>
  http.patch(`/scenarios/${id}`, dto);

export const deleteScene = (id: string) =>
  http.delete(`/scenarios/${id}`).then(() => id);
