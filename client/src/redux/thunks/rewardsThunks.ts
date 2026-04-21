import { createAsyncThunk } from "@reduxjs/toolkit";
import * as rewardApi from "../../api/reward";

export const createRewardThunk = createAsyncThunk<
  rewardApi.Reward[],
  {
    title: string;
    description?: string;
    icon?: string;
    coins: number;
    assignedChildIds: string[];
  },
  { rejectValue: string }
>("rewards/createReward", async (payload, thunkAPI) => {
  try {
    const response = await rewardApi.createReward(payload);
    return Array.isArray(response?.rewards) ? response.rewards : [];
  } catch (error) {
    const message = (error as Error)?.message ?? "rewards.create_failed";
    return thunkAPI.rejectWithValue(message);
  }
});

export const getParentRewardsThunk = createAsyncThunk<
  rewardApi.Reward[],
  void,
  { rejectValue: string }
>("rewards/getParentRewards", async (_, thunkAPI) => {
  try {
    const response = await rewardApi.getParentRewards();
    return Array.isArray(response?.rewards) ? response.rewards : [];
  } catch (error) {
    const message = (error as Error)?.message ?? "rewards.fetch_failed";
    return thunkAPI.rejectWithValue(message);
  }
});

export const getChildRewardsThunk = createAsyncThunk<
  rewardApi.Reward[],
  void,
  { rejectValue: string }
>("rewards/getChildRewards", async (_, thunkAPI) => {
  try {
    const response = await rewardApi.getChildRewards();
    return Array.isArray(response?.rewards) ? response.rewards : [];
  } catch (error) {
    const message = (error as Error)?.message ?? "rewards.fetch_failed";
    return thunkAPI.rejectWithValue(message);
  }
});

export const redeemRewardThunk = createAsyncThunk<
  rewardApi.Reward,
  string,
  { rejectValue: string }
>("rewards/redeemReward", async (rewardId, thunkAPI) => {
  try {
    const response = await rewardApi.redeemReward(rewardId);
    return response.reward;
  } catch (error) {
    const message = (error as Error)?.message ?? "rewards.redeem_failed";
    return thunkAPI.rejectWithValue(message);
  }
});

export const toggleRewardActiveThunk = createAsyncThunk<
  rewardApi.Reward,
  string,
  { rejectValue: string }
>("rewards/toggleRewardActive", async (rewardId, thunkAPI) => {
  try {
    const response = await rewardApi.toggleRewardActive(rewardId);
    return response.reward;
  } catch (error) {
    const message = (error as Error)?.message ?? "rewards.toggle_failed";
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteRewardThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("rewards/deleteReward", async (rewardId, thunkAPI) => {
  try {
    await rewardApi.deleteReward(rewardId);
    return rewardId;
  } catch (error) {
    const message = (error as Error)?.message ?? "rewards.delete_failed";
    return thunkAPI.rejectWithValue(message);
  }
});