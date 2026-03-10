import { createSlice } from "@reduxjs/toolkit";
import { updateProfile } from "../Services/ProfileService";

const profileSlice = createSlice({
    name: 'profile',
    initialState: {} as any,
    reducers: {
        changeProfile: (state, action) => {
            // Merge with existing state so we always preserve id and other fields
            const updatedProfile = { ...(state || {}), ...(action.payload || {}) };

            // Only call backend update when we have a valid id
            if (updatedProfile.id) {
                // Fire-and-forget; result is not used to avoid async logic in reducer
                updateProfile(updatedProfile).catch(() => {
                    // Swallow errors here; UI can handle via explicit calls if needed
                });
            }

            return updatedProfile;
        },
        setProfile: (state, action) => {
            return action.payload;
        }
    }
});

export const { changeProfile, setProfile } = profileSlice.actions;
export default profileSlice.reducer;