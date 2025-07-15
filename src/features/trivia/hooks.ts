import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import * as api from '../../api/trivia/trivia.api';
import type {
  TriviaSetDTO, UpdateTriviaSetDTO,
  TriviaQuestionDTO, CreateQuestionDTO, UpdateQuestionDTO
} from '../../api/trivia/trivia.types';

/* ------------------------------------ */
/* util para invalidar la cache */
const invalidate = (qc: QueryClient) => () => qc.invalidateQueries({ queryKey: ['trivia'] });

/* ------------- SETS ----------------- */
export const useTriviaSets = () =>
  useQuery<TriviaSetDTO[]>({ queryKey: ['trivia'], queryFn: api.listSets });

export const useCreateSet = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.createSet, onSuccess: invalidate(qc) });
};
export const useUpdateSet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTriviaSetDTO }) => api.updateSet(id, dto),
    onSuccess: invalidate(qc)
  });
};
export const useDeleteSet = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.deleteSet, onSuccess: invalidate(qc) });
};

/* ----------- PREGUNTAS -------------- */
export const useQuestions = (setId: string) =>
  useQuery<TriviaQuestionDTO[]>({
    queryKey: ['trivia', setId, 'qs'],
    queryFn: async () => {
      const questions = await api.listQuestions(setId);
      return questions ?? [];
    }
  });

export const useAddQuestion = (setId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateQuestionDTO) => api.addQuestion(setId, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trivia', setId, 'qs'] })
  });
};
export const useUpdateQuestion = (setId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateQuestionDTO }) => api.updateQuestion(setId, id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trivia', setId, 'qs'] })
  });
};
export const useDeleteQuestion = (setId: string) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteQuestion(setId, id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['trivia', setId, 'qs'] })
  });
};
