export const SET_WEBRTC_CONNECTION = 'SET_WEBRTC_CONNECTION';
export const CLOSE_WEBRTC_CONNECTION = 'CLOSE_WEBRTC_CONNECTION';

export const setWEBRTCConnection = (connection) => ({
    type: SET_WEBRTC_CONNECTION,
    payload: connection
})
export const closeWEBRTCConnection = () =>({
    type: CLOSE_WEBRTC_CONNECTION,
})