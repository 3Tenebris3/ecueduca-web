import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../../api/rewards/rewards.api";
import type { RewardDTO } from "../../api/rewards/rewards.types";

const invalidate = (qc: ReturnType<typeof useQueryClient>) => () =>
  qc.invalidateQueries({ queryKey: ["rewards"] });

export const useRewards = () =>
  useQuery<RewardDTO[]>({
    queryKey: ["rewards"],
    queryFn: api.listRewards,
  });

export const useCreateReward = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: api.createReward, onSuccess: invalidate(qc) });
};

export const useUpdateReward = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: Partial<RewardDTO> }) =>
      api.updateReward(id, dto),
    onSuccess: invalidate(qc),
  });
};

export const useDeleteReward = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: api.deleteReward,
    onSuccess: invalidate(qc),
  });
};
