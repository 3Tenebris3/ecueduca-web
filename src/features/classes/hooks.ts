import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient
} from '@tanstack/react-query';
import * as api from '../../api/classes/classes.api';
import type {
  ClassDTO,
  UpdateClassDTO
} from '../../api/classes/classes.types';

/* helper para refetch */
const invalidate = (qc: QueryClient) => () =>
  qc.invalidateQueries({ queryKey: ['classes'] });

/* list */
export const useClasses = () =>
  useQuery<ClassDTO[]>({ queryKey: ['classes'], queryFn: api.listClasses });

/* mutations */
export const useCreateClass = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.createClass,
    onSuccess: invalidate(qc)
  });
};

export const useUpdateClass = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateClassDTO }) =>
      api.updateClass(id, dto),
    onSuccess: invalidate(qc)
  });
};

export const useDeleteClass = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteClass,
    onSuccess: invalidate(qc)
  });
};

/* alumnos */
export const useStudentsInClass = (id: string) =>
  useQuery({
    queryKey: ['class', id, 'students'],
    queryFn: () => api.listStudentsIn(id)
  });

export const useEnroll = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.enroll,
    onSuccess: invalidate(qc)
  });
};
