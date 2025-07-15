import { http } from '../http';                      // <── tu wrapper axios
import type {
  TriviaSetDTO,
  CreateTriviaSetDTO, UpdateTriviaSetDTO,
  CreateQuestionDTO,  UpdateQuestionDTO
} from './trivia.types';

/* ---------- SETS ---------- */
export const listSets = () =>
  http.get<{ data: { data: TriviaSetDTO[] } }>('/trivia/sets')
      .then(r => r.data.data.data);

export const createSet = (dto: CreateTriviaSetDTO) =>
  http.post<{ data: { set: TriviaSetDTO } }>('/trivia/admin/sets', dto)
      .then(r => r.data.data.set);

export const updateSet = (id: string, dto: UpdateTriviaSetDTO) =>
  http.patch<{ data: { set: TriviaSetDTO } }>(`/trivia/admin/sets/${id}`, dto)
      .then(r => r.data.data.set);

export const deleteSet = (id: string) =>
  http.delete(`/admin/sets/${id}`);

/* ---------- PREGUNTAS ---------- */
export const listQuestions = (setId: string) =>
  http.get<{ data: { set: TriviaSetDTO } }>(`/trivia/sets/${setId}`)
      .then(r => r.data.data.set.questions);

export const addQuestion = (setId: string, dto: CreateQuestionDTO) =>
  http.post<{ data: { set: TriviaSetDTO } }>(`/trivia/admin/sets/${setId}/questions`, dto)
      .then(r => r.data.data.set.questions);

export const updateQuestion = (setId: string, qid: string, dto: UpdateQuestionDTO) =>
  http.patch(`/trivia/admin/sets/${setId}/questions/${qid}`, dto);

export const deleteQuestion = (setId: string, qid: string) =>
  http.delete(`/trivia/admin/sets/${setId}/questions/${qid}`);
