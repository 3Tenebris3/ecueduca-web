export interface QuizScoreDTO {
  quizId: string;
  quizName: string;
  score: number;
  date: string;
}

export interface SceneStatDTO {
  sceneId: string;
  sceneName: string;
  minutes: number;      // tiempo de uso
  progress: number;     // 0-100 %
  lastVisit: string;    // ISO date
}