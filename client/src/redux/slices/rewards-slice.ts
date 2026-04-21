import { createSlice } from "@reduxjs/toolkit";
import type { Reward } from "../../api/reward";
import {
  createRewardThunk,
  getParentRewardsThunk,
  getChildRewardsThunk,
  redeemRewardThunk,
  toggleRewardActiveThunk,
  deleteRewardThunk,
} from "../thunks/rewardsThunks";

type RewardsState = {
  parentRewards: Reward[];
  childRewards: Reward[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
};

const initialState: RewardsState = {
  parentRewards: [],
  childRewards: [],
  isLoading: false,
  isCreating: false,
  error: null,
};

const rewardsSlice = createSlice({
  name: "rewards",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createRewardThunk.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createRewardThunk.fulfilled, (state, action) => {
        state.isCreating = false;
        state.error = null;
        state.parentRewards = [
          ...action.payload,
          ...state.parentRewards,
        ];
      })
      .addCase(createRewardThunk.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload ?? "Failed to create reward";
      })

      .addCase(getParentRewardsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getParentRewardsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.parentRewards = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getParentRewardsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch rewards";
      })

      .addCase(getChildRewardsThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getChildRewardsThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.childRewards = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getChildRewardsThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? "Failed to fetch child rewards";
      })

      .addCase(redeemRewardThunk.fulfilled, (state, action) => {
        const updatedReward = action.payload;

        state.childRewards = state.childRewards.map((reward) =>
          String(reward._id) === String(updatedReward._id) ? updatedReward : reward
        );

        state.parentRewards = state.parentRewards.map((reward) =>
          String(reward._id) === String(updatedReward._id) ? updatedReward : reward
        );
      })

      .addCase(toggleRewardActiveThunk.fulfilled, (state, action) => {
        const updatedReward = action.payload;

        state.parentRewards = state.parentRewards.map((reward) =>
          String(reward._id) === String(updatedReward._id) ? updatedReward : reward
        );
      })

      .addCase(deleteRewardThunk.fulfilled, (state, action) => {
        state.parentRewards = state.parentRewards.filter(
          (reward) => String(reward._id) !== String(action.payload)
        );
      });
  },
});

export default rewardsSlice.reducer;