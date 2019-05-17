import {
  all,
  fork,
  takeLatest,
  takeEvery,
  call,
  put,
  take,
  delay
} from "redux-saga/effects";
import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE
} from "../reducers/user";
import axios from "axios";
import Router from "next/router";

axios.defaults.baseURL = "http://localhost:3065/api";

function loginAPI(loginData) {
  // 서버에 요청을 보내는 부분
  return axios.post("/user/login", loginData, {
    withCredentials: true
  });
}

function* login(action) {
  try {
    const result = yield call(loginAPI, action.data); //call = 동기적 실행
    // yield delay(2000);
    yield put({
      //put = dispatch --- loginAPI 성공 시 실행
      type: LOG_IN_SUCCESS,
      data: result.data //사용자 정보 위치
    });
    alert("회원가입이 완료되었습니다. 메인 페이지로 이동합니다");
    Router.push("/");
  } catch (error) {
    //loginAPI 실패 시 실행
    console.log(error);
    yield put({
      type: LOG_IN_FAILURE
    });
  }
}
function* watchLogin() {
  yield takeEvery(LOG_IN_REQUEST, login);
}
////////////////////////////////////////////////////////

function signUpAPI(signUpData) {
  return axios.post("/user", signUpData);
}

function* signUp(action) {
  //SIGN_UP_REQUEST를 통한 정보가 action으로
  try {
    yield call(signUpAPI, action.data); //call = 동기적 실행
    // yield delay(2000);
    yield put({
      //put = dispatch --- loginAPI 성공 시 실행
      type: SIGN_UP_SUCCESS
    });
  } catch (error) {
    //loginAPI 실패 시 실행
    console.log(error);
    yield put({
      type: SIGN_UP_FAILURE,
      error
    });
  }
}
function* watchSignUp() {
  yield takeEvery(SIGN_UP_REQUEST, signUp);
}

// while (true) {
//   //take만 사용할 때는 while true로 감싸주기
//   yield take(LOG_IN); //LOG_IN action을 기다림
//   yield delay(2000); //비동기 이용 가능
//   yield put({
//     //action 수행 후, 바로 아래의 action 수행,
//     type: LOG_IN_SUCCESS
//   });
//}

export default function* userSaga() {
  yield all([fork(watchLogin), fork(watchSignUp)]); //all = 여러 개의 eventlistener을 이용 시, all
  //fork = 비동기적 실행
}
