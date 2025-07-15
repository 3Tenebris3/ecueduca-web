/* ---------- modelos base ---------- */
export interface TriviaQuestionDTO {
  id:      string;
  text:    string;
  options: string[];
  answer:  string;
}

export interface TriviaSetDTO {
  id:        string;
  title:     string;
  completed: boolean;
  questions?: TriviaQuestionDTO[];
}

/* ---------- admin ---------- */
export interface CreateTriviaSetDTO  { title: string; }
export interface UpdateTriviaSetDTO  { title?: string; }

export interface CreateQuestionDTO {
  text:    string;
  options: [string, string, string, string];
  answer:  string;
}
// Interface for updating a question, extending Partial<CreateQuestionDTO> for flexibility
export type UpdateQuestionDTO = Partial<CreateQuestionDTO>;
