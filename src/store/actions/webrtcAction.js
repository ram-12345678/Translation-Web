import { axiosPostApi } from "../axiosApiCall/axiosApiCall";
export const USER_PROFILE_ID = 'USER_PROFILE_ID';
export const USER_DATA_VOICE_TRANSLATION = 'USER_DATA_VOICE_TRANSLATION';
export const FETCH_LANGUAGE_CODE = 'FETCH_LANGUAGE_CODE';

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

webrtcDataActions.fetchLanguageCode = (code) => ({
    type: FETCH_LANGUAGE_CODE,
    code: code
})

webrtcDataActions.putVioceForTranslation = (myStream, language) => {
    const params = { myStream, language }
    const data = axiosPostApi(baseUrl, params);
    if (data) {
        receiveVoice(data)
    }
}

export default webrtcDataActions;