import { all, fork, takeEvery, call, put } from "redux-saga/effects";
import {
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  LOG_OUT_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE
} from "../reducers/user";
import axios from "axios";
import Router from "next/router";

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
  } catch (error) {
    //loginAPI 실패 시 실행
    console.error(error);
    yield put({
      type: LOG_IN_FAILURE
    });
  }
}
function* watchLogIn() {
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
    alert("회원가입이 완료되었습니다. 로그인 후 이용해주세요");
    Router.push("/");
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

////////////////////////////////////////////////
function logOutAPI() {
  return axios.post("/user/logout", {}, { withCredentials: true });
  //logout은 보낼 데이터가 없지만 빈 객체라도 넣어줄 것 (POST 시)
}

function* logOut() {
  try {
    // yield call(logOutAPI);
    yield call(logOutAPI);
    yield put({
      // put은 dispatch 동일
      type: LOG_OUT_SUCCESS
    });
  } catch (e) {
    // loginAPI 실패
    console.error(e);
    yield put({
      type: LOG_OUT_FAILURE,
      error: e
    });
  }
}

function* watchLogOut() {
  yield takeEvery(LOG_OUT_REQUEST, logOut);
}

///////////////////////////////////////
function loadUserAPI() {
  return axios.get("/user", { withCredentials: true });
  //쿠키가 있으면 쿠키를 이용하여 요청
}

function* loadUser() {
  try {
    const result = yield call(loadUserAPI);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data
    });
  } catch (e) {
    // loginAPI 실패
    yield put({
      type: LOAD_USER_FAILURE,
      error: e
    });
  }
}

function* watchLoadUser() {
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

export default function* userSaga() {
  yield all([
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchLoadUser),
    fork(watchSignUp)
  ]);
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
