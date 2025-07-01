export interface QuizSetDTO {
  id: string;
  title: string;
  total: number;          // nº de preguntas
}

export interface QuizQuestionDTO {
  id: string;
  prompt: string;
  choices: [string, string, string, string];
  answer: number;         // 0-3 (no mostrar al alumno)
}

/* DTOs admin */
export interface CreateQuizSetDTO  { title: string }
export type      UpdateQuizSetDTO  = Partial<CreateQuizSetDTO>

export interface CreateQuestionDTO {
  prompt: string;
  choices: string[];   // ahora longitud variable (≥ 2)
  answer: number;      // índice correcto
}

export type UpdateQuestionDTO = Partial<CreateQuestionDTO>

