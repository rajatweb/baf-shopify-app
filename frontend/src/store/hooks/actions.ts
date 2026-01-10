import { useDispatch } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { playlistsCreateEditModalActions } from "../reducers/playlists/createEditPlaylistModalSlice";
import { addEditAudioTrackModalActions } from "../reducers/audioTracks/addEditAudioTrackModalSlice";
import { deleteAduioTrackModalActions } from "../reducers/audioTracks/deleteAduioTrackModalSlice";
import { reOrderAudioTrackCardActions } from "../reducers/audioTracks/reOrderAudioTrackCardSlice";
import { addEditVideoModalActions } from "../reducers/videoTracks/addEditVideoModalSlice";
import { deleteVideoTrackModalActions } from "../reducers/videoTracks/deleteVideoTrackModalSlice";

const actions = {
  ...playlistsCreateEditModalActions,
  ...addEditAudioTrackModalActions,
  ...deleteAduioTrackModalActions,
  ...reOrderAudioTrackCardActions,
  ...addEditVideoModalActions,
  ...deleteVideoTrackModalActions,
};

export const useActions = () => {
  const dispatch = useDispatch();
  return bindActionCreators(actions, dispatch);
};
