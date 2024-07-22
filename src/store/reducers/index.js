import { combineReducers } from "redux";
import { counterReducer } from "./counterReducers";
import voiceTranslate from "./voiceTranslate";

const rootReducer = combineReducers({
    webrtcReducer: counterReducer,
    voiceTranslate:voiceTranslate

});
export default rootReducer;