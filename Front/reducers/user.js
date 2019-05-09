const dummyUser = {
  //로그인 action이 되었을 때, initialState에 들어갈 user
  nickname: "현재",
  Post: [],
  Followers: [],
  Followings: [],
  signUPData: {}
};
export const initialState = {
  isLoggedIn: false,
  user: null
};

export const LOG_IN = "LOG_IN"; //ACTION 이름
export const LOG_OUT = "LOG_OUT";
export const SIGN_UP = "SIGN_UP";

//ex
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";

export const loginAction = {
  type: LOG_IN
};
export const logoutAction = {
  type: LOG_OUT
};
//동적 Data에 따라 달라지는 부분은 함수로 action을 선언
export const signUpAction = data => {
  return {
    type: SIGN_UP,
    data: data
  };
};
export const signUpSuccess = {
  type: SIGN_UP_SUCCESS
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN: {
      return {
        ...state,
        isLoggedIn: true,
        user: dummyUser
      };
    }
    case LOG_OUT: {
      return {
        ...state,
        isLoggedIn: false,
        user: null
      };
    }
    case SIGN_UP: {
      return {
        ...state,
        signUPData: action.data
      };
    }
    default: {
      return {
        //default 는 오타가 아닌 이상 실행될 여지는 x
        ...state
      };
    }
  }
};

export default reducer;
