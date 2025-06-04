import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MeetingState {
  dismissedMeetingIds: string[];
  dismissedCandidateMeetingIds: string[];
}

const initialState: MeetingState = {
  dismissedMeetingIds: [],
  dismissedCandidateMeetingIds: [],
};

const meetingSlice = createSlice({
  name: "meetings",
  initialState,
  reducers: {
    dismissMeeting: (state, action: PayloadAction<string>) => {
      if (!state.dismissedMeetingIds.includes(action.payload)) {
        state.dismissedMeetingIds.push(action.payload);
      }
    },
    clearExpiredDismissedMeetings: (state, action: PayloadAction<string[]>) => {
      state.dismissedMeetingIds = action.payload;
    },
    dismissCandidateMeeting: (state, action: PayloadAction<string>) => {
      if (!state.dismissedCandidateMeetingIds.includes(action.payload)) {
        state.dismissedCandidateMeetingIds.push(action.payload);
      }
    },
    clearExpiredDismissedCandidateMeetings: (
      state,
      action: PayloadAction<string[]>
    ) => {
      state.dismissedCandidateMeetingIds = action.payload;
    },
  },
});

export const {
  dismissMeeting,
  clearExpiredDismissedMeetings,
  dismissCandidateMeeting,
  clearExpiredDismissedCandidateMeetings,
} = meetingSlice.actions;
export default meetingSlice.reducer;
