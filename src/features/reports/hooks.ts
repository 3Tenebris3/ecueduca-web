import { useQuery } from "@tanstack/react-query";
import { getStudentQuizScores, getStudentSceneStats } from "../../api/reports/reports.api";
import type { QuizScoreDTO, SceneStatDTO } from "../../api/reports/reports.types";


  export const useStudentScores = (studentId: string | null) =>
  useQuery<QuizScoreDTO[]>({
    queryKey: ["scores", studentId],
    queryFn: () => getStudentQuizScores(studentId!),
    enabled: !!studentId,
  });

/* ─── escenario stats ────────────────────────── */
export const useStudentScenes = (studentId: string | null) =>
  useQuery<SceneStatDTO[]>({
    queryKey: ["scenesStats", studentId],
    queryFn: () => getStudentSceneStats(studentId!),
    enabled: !!studentId,
  });