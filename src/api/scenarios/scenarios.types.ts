export interface SceneMetaDTO {
  id: string;
  title: string;
  preview: string;
  completed: boolean;
}

export interface CreateSceneDTO {
  id:      string;
  title:   string;
  preview: string;
  glbUrl:  string;
  audio?:  string;
  desc:    string;     // ← NUEVO  (obligatorio)
}

export type UpdateSceneDTO = Partial<Omit<CreateSceneDTO, 'id'>>;

