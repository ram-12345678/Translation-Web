
import { SET_WEBRTC_CONNECTION, CLOSE_WEBRTC_CONNECTION } from "../actions/webrtcAction";

const intialState = {
    connection: null
};
export const counterReducer = (state = intialState, action) => {
    switch (action.type) {
        case SET_WEBRTC_CONNECTION:
            return {
                ...state,
                connection: action.payload
            }
        case CLOSE_WEBRTC_CONNECTION:
            return {
                ...state,
                connection: null
            }
        default:
            return state;
    }
}