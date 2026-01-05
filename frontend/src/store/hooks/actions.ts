import { useDispatch } from "react-redux";
import { storeApi } from "../api/store";
import { bindActionCreators } from "@reduxjs/toolkit";

const actions = {
  getStoreSettings: storeApi.endpoints.getStoreSettings.initiate,
};

export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actions, dispatch);
};
