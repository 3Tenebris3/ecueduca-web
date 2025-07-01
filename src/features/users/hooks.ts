import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../../api/users/users.api';
import type { UpdateUserDTO, UserDTO } from '../../api/users/users.types';

/* listados */
export const useUsers     = () => useQuery<UserDTO[]>({ queryKey:['users'],   queryFn: api.listUsers });
export const useTeachers  = () => useQuery<UserDTO[]>({ queryKey:['teachers'],queryFn: api.listTeachers });
export const useStudents  = () => useQuery<UserDTO[]>({ queryKey:['students'],queryFn: api.listStudents });

/* CRUD */
import { QueryClient } from '@tanstack/react-query';

const invalidate = (qc: QueryClient) => () => qc.invalidateQueries({ queryKey:['users'] });

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.createUser, onSuccess: invalidate(qc) });
};
export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id:string; dto:UpdateUserDTO }) => api.updateUser(id,dto),
    onSuccess: invalidate(qc)
  });
};
export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.deleteUser, onSuccess: invalidate(qc) });
};

/* nuevas */
export const useResetPwd = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.resetPassword, onSuccess: invalidate(qc) });
};
export const useUpdateAvatar = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({id,avatar}:{id:string;avatar:string})=>api.updateAvatar(id,avatar), onSuccess: invalidate(qc) });
};
export const useAssignTeacher = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ studentId, teacherId }:{studentId:string;teacherId:string}) =>
      api.assignTeacher(studentId, teacherId),
    onSuccess: invalidate(qc)
  });
};
