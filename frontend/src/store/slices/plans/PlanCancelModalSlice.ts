import { createSlice } from "@reduxjs/toolkit";

type TPlanCancelModalState = {
  showCancelModal: boolean;
};

const initialState: TPlanCancelModalState = {
  showCancelModal: false,
};

export const PlanCancelModalSlice = createSlice({
  name: "planCancelModal",
  initialState,
  reducers: {
    openPlanCancelModal: (state) => {
      state.showCancelModal = true;
    },
    closePlanCancelModal: (state) => {
      state.showCancelModal = false;
    },
  },
});

export const PlanCancelModalActions = PlanCancelModalSlice.actions;
export const PlanCancelModalReducer = PlanCancelModalSlice.reducer;
