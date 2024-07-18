import { combineReducers } from "redux";
import { counterReducer } from "./counterReducers";

const rootReducer = combineReducers({
    webrtcReducer: counterReducer,

});
export default rootReducer;