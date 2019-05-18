import { all, call } from "redux-saga/effects";
import user from "./user";
import post from "./post";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3065/api";
//공통되는 부분 캐싱으로 연결

export default function* rootSaga() {
  yield all([call(user), call(post)]);
}
