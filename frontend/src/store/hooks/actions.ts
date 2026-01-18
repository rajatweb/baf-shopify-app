import { useDispatch } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { PlanCancelModalActions } from "../slices/plans/PlanCancelModalSlice";
import { planUpgradeModalActions } from "../slices/plans/PlanUpgradeModalSlice";

const actions = {
  ...PlanCancelModalActions,
  ...planUpgradeModalActions,
};

export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actions, dispatch);
};
