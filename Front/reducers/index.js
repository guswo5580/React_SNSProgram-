import { combineReducers } from "redux";
import user from "./user";
import post from "./post";

//redux의 내용들을 하나로 합쳐 관리하는 부분
const rootReducer = combineReducers({
  user,
  post
});

export default rootReducer;
