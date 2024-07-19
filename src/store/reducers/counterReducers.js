
import { USER_PROFILE_ID, USER_DATA_VOICE_TRANSLATION, FETCH_LANGUAGE_CODE } from "../actions/webrtcAction";

const intialState = {
    profileId: undefined,
    audio:null,
    code:null
};
export const counterReducer = (state = intialState, action) => {
    switch (action.type) {
        case USER_PROFILE_ID:
            return {
                ...state,
                profileId: action.profileId
            }
        case USER_DATA_VOICE_TRANSLATION:
            return {
                ...state,
                audio: action.audio
            }
        case FETCH_LANGUAGE_CODE:
            return {
                ...state,
                code: action.code
            }
        default:
            return state;
    }
}