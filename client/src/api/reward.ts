import { api } from "./request";

const URL = "/api/v1/rewards";

export type Reward = {
  _id: string;
  title: string;
  description: string;
  icon: string;
  coins: number;
  isActive: boolean;
  parentId: string;
  childId: string;
  redeemedAt: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export async function createReward(payload: {
  title: string;
  description?: string;
  icon?: string;
  coins: number;
  assignedChildIds: string[];
}): Promise<{ rewards: Reward[] }> {
  return api.post<{ rewards: Reward[] }>(URL, payload, {
    requireAuth: true,
    role: "PARENT",
  });
}

export async function getParentRewards(options?: {
  childId?: string;
}): Promise<{ rewards: Reward[] }> {
  const query = options?.childId
    ? `?childId=${encodeURIComponent(options.childId)}`
    : "";

  return api.get<{ rewards: Reward[] }>(`${URL}/parent${query}`, {
    requireAuth: true,
    role: "PARENT",
  });
}

export async function getChildRewards(): Promise<{ rewards: Reward[] }> {
  return api.get<{ rewards: Reward[] }>(`${URL}/child`, {
    requireAuth: true,
    role: "CHILD",
  });
}

export async function redeemReward(
  rewardId: string
): Promise<{ reward: Reward }> {
  return api.patch<{ reward: Reward }>(
    `${URL}/${encodeURIComponent(rewardId)}/redeem`,
    {},
    {
      requireAuth: true,
      role: "CHILD",
    }
  );
}

export async function toggleRewardActive(
  rewardId: string
): Promise<{ reward: Reward }> {
  return api.patch<{ reward: Reward }>(
    `${URL}/${encodeURIComponent(rewardId)}/toggle-active`,
    {},
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
}

export async function deleteReward(
  rewardId: string
): Promise<{ deletedRewardId: string }> {
  return api.delete<{ deletedRewardId: string }>(
    `${URL}/${encodeURIComponent(rewardId)}`,
    {
      requireAuth: true,
      role: "PARENT",
    }
  );
}