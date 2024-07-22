import { axiosPostApi } from "../axiosApiCall/axiosApiCall";
export const USER_PROFILE_ID = 'USER_PROFILE_ID';
export const USER_DATA_VOICE_TRANSLATION = 'USER_DATA_VOICE_TRANSLATION';
export const FETCH_LANGUAGE_CODE = 'FETCH_LANGUAGE_CODE';
export const SET_MY_STREAM='SET_MY_STREAM';
export const SET_REMOTE_STREAM='SET_REMOTE_STREAM';
export const SET_REMOTE_SCKOTE_ID='SET_REMOTE_SCKOTE_ID'

const baseUrl = 'https://98.70.11.251:5000';
const webrtcDataActions = {};


const receiveVoice = (audio) => ({
    type: USER_DATA_VOICE_TRANSLATION,
    audio: audio
})

webrtcDataActions.fetchUserProfileId = (profileId) => ({
    type: USER_PROFILE_ID,
    profileId: profileId
})

webrtcDataActions.setMyStream = (myStream) => ({
    type: SET_MY_STREAM,
    myStream: myStream
})

webrtcDataActions.setRemoteStream = (remoteStream) => ({
    type: SET_REMOTE_STREAM,
    remoteStream: remoteStream
})

webrtcDataActions.fetchLanguageCode = (code) => ({
    type: FETCH_LANGUAGE_CODE,
    code: code
})

webrtcDataActions.setRemoteSocketId = (remoteSocketId) => ({
    type: SET_REMOTE_SCKOTE_ID,
    remoteSocketId: remoteSocketId
})

webrtcDataActions.putVioceForTranslation = (myStream, language) => {
    const params = { myStream, language }
    // const data = axiosPostApi(baseUrl, params);
    // if (data) {
    //     receiveVoice(data)
    // }
}

export default webrtcDataActions;