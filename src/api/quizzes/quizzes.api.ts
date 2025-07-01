import { http } from '../http';
import type {
  QuizSetDTO,
  QuizQuestionDTO,
  CreateQuizSetDTO,
  UpdateQuizSetDTO,
  CreateQuestionDTO,
  UpdateQuestionDTO
} from './quizzes.types';

/* ───── sets ───── */
export const listSets   = () =>
  http.get<{data:{sets: QuizSetDTO[]}}>('quizzes/sets')
      .then(r => r.data.data.sets);

export const createSet  = (dto:CreateQuizSetDTO) =>
  http.post<{data:{set:QuizSetDTO}}>('quizzes/sets', dto)
      .then(r => r.data.data.set);

export const updateSet  = (id:string,dto:UpdateQuizSetDTO) =>
  http.patch<{data:{set:QuizSetDTO}}>(`quizzes/sets/${id}`, dto)
      .then(r => r.data.data.set);

export const deleteSet  = (id:string) =>
  http.delete(`quizzes/sets/${id}`).then(()=>id);

/* ───── preguntas ───── */
export const listQuestions = (setId:string) =>
  http.get<{data:QuizQuestionDTO[]}>(`quizzes/sets/${setId}`)
      .then(r => r.data.data);

export const addQuestion  = (setId:string,dto:CreateQuestionDTO) =>
  http.post<{data:{question:QuizQuestionDTO}}>(`quizzes/sets/${setId}/questions`,dto)
      .then(r=>r.data.data.question);

export const updateQuestion = (setId:string,qid:string,dto:UpdateQuestionDTO) =>
  http.patch(`quizzes/sets/${setId}/questions/${qid}`,dto);

export const deleteQuestion = (setId:string,qid:string) =>
  http.delete(`quizzes/sets/${setId}/questions/${qid}`);
