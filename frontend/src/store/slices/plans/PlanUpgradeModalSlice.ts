import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TPlan } from "../../api/subscriptions/types";

type TPlanUpgradeModalState = {
  isOpen: boolean;
  initialValue: {
    isUpgrade: boolean;
    isDowngrade: boolean;
    isSwitch: boolean;
    selectedPlan: TPlan | null;
    selectedInterval: "EVERY_30_DAYS" | "ANNUAL";
    currentBillingInterval: "EVERY_30_DAYS" | "ANNUAL" | null;
    currencyCode: string;
  };
};

const initialState: TPlanUpgradeModalState = {
  isOpen: false,
  initialValue: {
    isUpgrade: false,
    isDowngrade: false,
    isSwitch: false,
    selectedPlan: null,
    selectedInterval: "EVERY_30_DAYS",
    currentBillingInterval: null,
    currencyCode: "USD",
  },
};

export const PlanUpgradeModalSlice = createSlice({
  name: "planUpgradeModal",
  initialState,
  reducers: {
    openPlanUpgradeModal: (
      state,
      action: PayloadAction<TPlanUpgradeModalState["initialValue"]>
    ) => {
      state.isOpen = true;
      state.initialValue = action.payload;
    },
    closePlanUpgradeModal: (state) => {
      state.isOpen = false;
      state.initialValue = initialState.initialValue;
    },
  },
});

export const planUpgradeModalActions = PlanUpgradeModalSlice.actions;
export const planUpgradeModalReducer = PlanUpgradeModalSlice.reducer;
