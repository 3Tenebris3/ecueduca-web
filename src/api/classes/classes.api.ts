import { http } from '../../api/http';
import type { ClassDTO, CreateClassDTO, UpdateClassDTO } from './classes.types';
import type { UserDTO } from '../../api/users/users.types';

/* ═════════════ ADMIN CRUD ═════════════ */

export const listClasses = () =>
  http
    .get<{ data: { classes: ClassDTO[] } }>('/admin/classes')
    .then(r => r.data.data.classes);

export const createClass = (dto: CreateClassDTO) =>
  http
    .post<{ data: { cls: ClassDTO } }>('/admin/classes', dto)
    .then(r => r.data.data.cls);

export const updateClass = (id: string, dto: UpdateClassDTO) =>
  http
    .patch<{ data: { cls: ClassDTO } }>(`/admin/classes/${id}`, dto)
    .then(r => r.data.data.cls);

export const deleteClass = (id: string) =>
  http.delete(`/admin/classes/${id}`).then(() => id);

/* ═════════════ ESTUDIANTES ═════════════ */

export const listStudentsIn = (id: string) =>
  http
    .get<{ data: { students: UserDTO[] } }>(`/admin/classes/${id}/students`)
    .then(r => r.data.data.students);

export const enroll = (payload: {
  studentId: string;
  classId: string;
  action: 'add' | 'remove';
}) => http.post('/admin/classes/enroll', payload);
