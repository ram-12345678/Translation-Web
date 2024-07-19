
import {
    USER_PROFILE_ID,
    USER_DATA_VOICE_TRANSLATION,
    FETCH_LANGUAGE_CODE,
    SET_MY_STREAM,
    SET_REMOTE_STREAM,
    SET_REMOTE_SCKOTE_ID
} from "../actions/webrtcAction";

const intialState = {
    profileId: undefined,
    audio: null,
    code: null,
    myStrean: null,
    remoteStream: null,
    remoteSocketId: undefined
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
        case SET_MY_STREAM:
            return {
                ...state,
                myStrean: action.myStrean
            }
        case SET_REMOTE_STREAM:
            return {
                ...state,
                remoteStream: action.remoteStream
            }
        case SET_REMOTE_SCKOTE_ID:
            return {
                ...state,
                remoteSocketId: action.remoteSocketId
            }
        default:
            return state;
    }
}