import { listSets } from "../quizzes/quizzes.api";
import type { QuizSetDTO } from "../quizzes/quizzes.types";
import { listScenes } from "../scenarios/scenarios.api";
import type { SceneMetaDTO } from "../scenarios/scenarios.types";
import type { QuizScoreDTO, SceneStatDTO } from "./reports.types";

/* ─── helpers ────────────────────────────────────────────── */
const randomBetween = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/* Cinco generadores con distribuciones distintas */
const generators = [
  /* Dataset 1: notas altas */
  (sets: QuizSetDTO[]) =>
    sets.map<QuizScoreDTO>((s) => ({
      quizId: s.id,
      quizName: s.title,
      score: randomBetween(80, 100),
      date: new Date().toISOString(),
    })),
  /* Dataset 2: mixto */
  (sets: QuizSetDTO[]) =>
    sets.map((s) => ({
      quizId: s.id,
      quizName: s.title,
      score: randomBetween(50, 100),
      date: new Date().toISOString(),
    })),
  /* Dataset 3: notas bajas */
  (sets: QuizSetDTO[]) =>
    sets.map((s) => ({
      quizId: s.id,
      quizName: s.title,
      score: randomBetween(10, 60),
      date: new Date().toISOString(),
    })),
  /* Dataset 4: campana centrada ~70 */
  (sets: QuizSetDTO[]) =>
    sets.map((s) => {
      const base = 70 + Math.round((Math.random() - 0.5) * 20);
      return {
        quizId: s.id,
        quizName: s.title,
        score: Math.min(100, Math.max(0, base)),
        date: new Date().toISOString(),
      };
    }),
  /* Dataset 5: dispersión total */
  (sets: QuizSetDTO[]) =>
    sets.map((s) => ({
      quizId: s.id,
      quizName: s.title,
      score: randomBetween(0, 100),
      date: new Date().toISOString(),
    })),
];

/* helper */
const rnd = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/* 5 generadores distintos igual que para quizzes (usamos 3) */
const sceneGenerators = [
  (scenes: SceneMetaDTO[]) =>
    scenes.map<SceneStatDTO>((s) => ({
      sceneId: s.id,
      sceneName: s.title,
      minutes: rnd(5, 25),
      progress: rnd(70, 100),
      lastVisit: new Date().toISOString(),
    })),
  (scenes: SceneMetaDTO[]) =>
    scenes.map((s) => ({
      sceneId: s.id,
      sceneName: s.title,
      minutes: rnd(1, 15),
      progress: rnd(30, 80),
      lastVisit: new Date().toISOString(),
    })),
  (scenes: SceneMetaDTO[]) =>
    scenes.map((s) => ({
      sceneId: s.id,
      sceneName: s.title,
      minutes: rnd(10, 40),
      progress: rnd(0, 60),
      lastVisit: new Date().toISOString(),
    })),
];

/* ─── endpoint fake ───────────────────────────────────────── */
export async function getStudentQuizScores(studentId: string) {
  /* 1. Usa la API real para obtener los sets existentes */
  const sets = await listSets(); // real HTTP call
    console.log(studentId)
  /* 2. Elige aleatoriamente uno de los 5 generadores dummy */
  const gen = generators[Math.floor(Math.random() * generators.length)];

  /* 3. Devuelve las notas sintetizadas */
  return gen(sets);
}

export async function getStudentSceneStats(studentId: string) {
  const scenes = await listScenes();     
  console.log(studentId)     // ← llamada real
  const gen =
    sceneGenerators[Math.floor(Math.random() * sceneGenerators.length)];
  return gen(scenes);
}