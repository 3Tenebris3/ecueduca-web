import { http } from "../http";
import type { RewardDTO } from "./rewards.types";

/* ← extraemos solo defs */
export const listRewards = () =>
  http
    .get<{ data: { defs: RewardDTO[] } }>("/rewards")
    .then((r) => r.data.data.defs);

export const createReward = (dto: RewardDTO) =>
  http.post("/rewards", dto).then((r) => r.data.data);

export const updateReward = (id: string, dto: Partial<RewardDTO>) =>
  http.put(`/rewards/${id}`, dto);

export const deleteReward = (id: string) =>
  http.delete(`/rewards/${id}`).then(() => id);
