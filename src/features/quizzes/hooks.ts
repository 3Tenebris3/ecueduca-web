import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import * as api from '../../api/quizzes/quizzes.api';
import type {
  QuizSetDTO,
  UpdateQuizSetDTO,
  QuizQuestionDTO,
  CreateQuestionDTO,
  UpdateQuestionDTO
} from '../../api/quizzes/quizzes.types';

const invalidate = (qc:QueryClient) => () => qc.invalidateQueries({queryKey:['quizzes']});

/* sets */
export const useQuizSets = () =>
  useQuery<QuizSetDTO[]>({queryKey:['quizzes'],queryFn:api.listSets});

export const useCreateSet = () => {
  const qc = useQueryClient();
  return useMutation({mutationFn:api.createSet,onSuccess:invalidate(qc)});
};
export const useUpdateSet = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn:({id,dto}:{id:string;dto:UpdateQuizSetDTO})=>api.updateSet(id,dto),
    onSuccess:invalidate(qc)
  });
};
export const useDeleteSet = () => {
  const qc = useQueryClient();
  return useMutation({mutationFn:api.deleteSet,onSuccess:invalidate(qc)});
};

/* preguntas */
export const useQuestions = (setId:string) =>
  useQuery<QuizQuestionDTO[]>({queryKey:['quizzes',setId,'qs'],queryFn:()=>api.listQuestions(setId)});

export const useAddQuestion = (setId:string) =>{
  const qc=useQueryClient();
  return useMutation({
    mutationFn:(dto:CreateQuestionDTO)=>api.addQuestion(setId,dto),
    onSuccess:()=>qc.invalidateQueries({queryKey:['quizzes',setId,'qs']})
  });
};
export const useUpdateQuestion = (setId:string) =>{
  const qc=useQueryClient();
  return useMutation({
    mutationFn:({id,dto}:{id:string;dto:UpdateQuestionDTO})=>api.updateQuestion(setId,id,dto),
    onSuccess:()=>qc.invalidateQueries({queryKey:['quizzes',setId,'qs']})
  });
};
export const useDeleteQuestion = (setId:string)=>{
  const qc=useQueryClient();
  return useMutation({
    mutationFn:(id:string)=>api.deleteQuestion(setId,id),
    onSuccess:()=>qc.invalidateQueries({queryKey:['quizzes',setId,'qs']})
  });
};
