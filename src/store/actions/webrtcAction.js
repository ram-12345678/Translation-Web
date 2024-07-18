export const USER_PROFILE_ID = 'USER_PROFILE_ID';
// export const CLOSE_WEBRTC_CONNECTION = 'CLOSE_WEBRTC_CONNECTION';

export const setUserProfileId = (profileId) => ({
    type: USER_PROFILE_ID,
    profileId: profileId
})
// export const closeWEBRTCConnection = () =>({
//     type: CLOSE_WEBRTC_CONNECTION,
// })