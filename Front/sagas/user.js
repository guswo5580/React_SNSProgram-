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
  LOAD_USER_FAILURE,
  FOLLOW_USER_FAILURE,
  FOLLOW_USER_REQUEST,
  FOLLOW_USER_SUCCESS,
  UNFOLLOW_USER_FAILURE,
  UNFOLLOW_USER_REQUEST,
  UNFOLLOW_USER_SUCCESS,
  LOAD_FOLLOWERS_FAILURE,
  LOAD_FOLLOWERS_REQUEST,
  LOAD_FOLLOWERS_SUCCESS,
  LOAD_FOLLOWINGS_FAILURE,
  LOAD_FOLLOWINGS_REQUEST,
  LOAD_FOLLOWINGS_SUCCESS,
  REMOVE_FOLLOWER_FAILURE,
  REMOVE_FOLLOWER_REQUEST,
  REMOVE_FOLLOWER_SUCCESS,
  EDIT_NICKNAME_FAILURE,
  EDIT_NICKNAME_REQUEST,
  EDIT_NICKNAME_SUCCESS
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
    const result = yield call(loginAPI, action.data);
    //call = 동기적 실행
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
    yield call(logOutAPI);
    yield put({
      // put은 dispatch 동일
      type: LOG_OUT_SUCCESS
    });
    alert("로그인이 종료되었습니다. 기본화면으로 돌아갑니다");
    Router.push("/");
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
function loadUserAPI(id) {
  //id가 있으면 user.js에서 보내는 신호(다른 사용자의 정보)
  //id가 없으면 _app.js에서 보내는 신호(나의 정보)
  return axios.get(id ? `/user/${id}` : "/user/", {
    withCredentials: true
  });
  //클라이언트 요청 시, 브라우저 -> 쿠키를 같이 보내 요청
  //서버 사이드 요청 시, _app.js에서 axios 선언을 이용 쿠키를 담아 요청
}

function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
      me: !action.data
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_USER_FAILURE,
      error: e
    });
  }
}

function* watchLoadUser() {
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

//////////////////////////////////////////////////
function followAPI(userId) {
  // 서버에 요청을 보내는 부분
  return axios.post(
    `/user/${userId}/follow`,
    {},
    {
      withCredentials: true
    }
  );
}

function* follow(action) {
  try {
    const result = yield call(followAPI, action.data);
    yield put({
      // put은 dispatch 동일
      type: FOLLOW_USER_SUCCESS,
      data: result.data
    });
  } catch (e) {
    // loginAPI 실패
    console.error(e);
    yield put({
      type: FOLLOW_USER_FAILURE,
      error: e
    });
  }
}

function* watchFollow() {
  yield takeEvery(FOLLOW_USER_REQUEST, follow);
}

//////////////////////////////////////////////////
function unfollowAPI(userId) {
  // 서버에 요청을 보내는 부분
  return axios.delete(`/user/${userId}/follow`, {
    withCredentials: true
  });
}

function* unfollow(action) {
  try {
    const result = yield call(unfollowAPI, action.data);
    yield put({
      // put은 dispatch 동일
      type: UNFOLLOW_USER_SUCCESS,
      data: result.data
    });
  } catch (e) {
    // loginAPI 실패
    console.error(e);
    yield put({
      type: UNFOLLOW_USER_FAILURE,
      error: e
    });
  }
}

function* watchUnfollow() {
  yield takeEvery(UNFOLLOW_USER_REQUEST, unfollow);
}
////////////////////////////////////////////////////
function loadFollowersAPI(userId, offset = 0, limit = 3) {
  //프로필 페이지 팔로워 목록
  return axios.get(
    `/user/${userId || 0}/followers?offset=${offset}&limit=${limit}`,
    {
      withCredentials: true
    }
  );
}

function* loadFollowers(action) {
  try {
    const result = yield call(loadFollowersAPI, action.data, action.offset);
    yield put({
      type: LOAD_FOLLOWERS_SUCCESS,
      data: result.data
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_FOLLOWERS_FAILURE,
      error: e
    });
  }
}

function* watchLoadFollowers() {
  yield takeEvery(LOAD_FOLLOWERS_REQUEST, loadFollowers);
}
////////////////////////////////////////////////////
function loadFollowingsAPI(userId, offset = 0, limit = 3) {
  //프로필 페이지 팔로잉 목록
  return axios.get(
    `/user/${userId || 0}/followings?offset=${offset}&limit=${limit}`,
    {
      withCredentials: true
    }
  );
}

function* loadFollowings(action) {
  try {
    const result = yield call(loadFollowingsAPI, action.data, action.offset);
    yield put({
      type: LOAD_FOLLOWINGS_SUCCESS,
      data: result.data
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOAD_FOLLOWINGS_FAILURE,
      error: e
    });
  }
}

function* watchLoadFollowings() {
  yield takeEvery(LOAD_FOLLOWINGS_REQUEST, loadFollowings);
}
////////////////////////////////////////////////////
function removeFollowerAPI(userId) {
  //프로필 목록 팔로워 삭제, 팔로잉 삭제는 unfollower
  return axios.delete(`/user/${userId}/follower`, {
    withCredentials: true
  });
}

function* removeFollower(action) {
  try {
    // yield call(loadFollowersAPI);
    const result = yield call(removeFollowerAPI, action.data);
    yield put({
      // put은 dispatch 동일
      type: REMOVE_FOLLOWER_SUCCESS,
      data: result.data
    });
  } catch (e) {
    // loginAPI 실패
    console.error(e);
    yield put({
      type: REMOVE_FOLLOWER_FAILURE,
      error: e
    });
  }
}

function* watchRemoveFollower() {
  yield takeEvery(REMOVE_FOLLOWER_REQUEST, removeFollower);
}
////////////////////////////////////////////////////
function editNicknameAPI(nickname) {
  //user정보의 nickname만 수정 put X
  return axios.patch(
    "/user/nickname",
    { nickname },
    {
      withCredentials: true
    }
  );
}

function* editNickname(action) {
  try {
    const result = yield call(editNicknameAPI, action.data);
    yield put({
      type: EDIT_NICKNAME_SUCCESS,
      data: result.data
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: EDIT_NICKNAME_FAILURE,
      error: e
    });
  }
}

function* watchEditNickname() {
  yield takeEvery(EDIT_NICKNAME_REQUEST, editNickname);
}

export default function* userSaga() {
  yield all([
    fork(watchLogIn),
    fork(watchLogOut),
    fork(watchLoadUser),
    fork(watchSignUp),
    fork(watchFollow),
    fork(watchUnfollow),
    fork(watchLoadFollowers),
    fork(watchLoadFollowings),
    fork(watchRemoveFollower),
    fork(watchEditNickname)
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
