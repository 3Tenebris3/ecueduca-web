export interface ClassDTO {
  id: string;
  name: string;
  grade: string;
  teacherId: string;

  /* nuevos */
  code: string;
  studentsCount: number;
  createdAt: string;   // ISO
  updatedAt: string;   // ISO
}

export interface CreateClassDTO {
  name: string;
  grade: string;
  teacherId: string;
}

export type UpdateClassDTO = Partial<CreateClassDTO>;
