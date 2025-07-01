import { http } from "../http";
import type { UserDTO, CreateUserDTO, UpdateUserDTO } from "./users.types";

export const listUsers = () =>
  http
    .get<{ data: { users: UserDTO[] } }>("/users")
    .then((r) => r.data.data.users);

export const createUser = (dto: CreateUserDTO) =>
  http
    .post<{ data: { user: UserDTO } }>("/users", dto)
    .then((r) => r.data.data.user);

export const updateUser = (id: string, dto: UpdateUserDTO) =>
  http
    .patch<{ data: { user: UserDTO } }>(`/users/${id}`, dto)
    .then((r) => r.data.data.user);

export const deleteUser = (id: string) =>
  http.delete(`/users/${id}`).then(() => id);

export const resetPassword = (id: string) =>
  http.post(`/users/${id}/change-password`, { newPwd: "Educa123!" });
export const updateAvatar = (id: string, avatar: string) =>
  http.patch(`/users/${id}/avatar`, { avatar });
export const assignTeacher = (studentId: string, teacherId: string) =>
  http.post(`/users/${studentId}/assign-teacher`, { teacherId });
/* helpers para listados */
export const listTeachers = () =>
  http
    .get<{ data: { users: UserDTO[] } }>("/users/role/teacher")
    .then((r) => r.data.data.users);
export const listStudents = () =>
  http
    .get<{ data: { users: UserDTO[] } }>("/users/role/student")
    .then((r) => r.data.data.users);
