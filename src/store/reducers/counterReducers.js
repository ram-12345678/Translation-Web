
import { USER_PROFILE_ID } from "../actions/webrtcAction";

const intialState = {
    profileId: null
};
export const counterReducer = (state = intialState, action) => {
    switch (action.type) {
        case USER_PROFILE_ID:
            return {
                ...state,
                profileId: action.profileId
            }
        default:
            return state;
    }
}