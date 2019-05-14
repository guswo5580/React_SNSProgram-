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
  LOG_IN_FAILURE
} from "../reducers/user";

function loginAPI() {
  // 서버에 요청을 보내는 부분
  //return axios.post("/login");
}

function* login() {
  try {
    yield call(loginAPI);
    yield put({
      //put = dispatch --- loginAPI 성공 시 실행
      type: LOG_IN_SUCCESS
    });
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
  yield all([fork(watchLogin)]); //all = 여러 개의 eventlistener을 이용 시, all
}
