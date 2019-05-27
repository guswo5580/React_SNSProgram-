export const initialState = {
  isLoggingOut: false, // 로그아웃 시도중
  isLoggingIn: false, // 로그인 시도중
  logInErrorReason: "", // 로그인 실패 사유

  signedUp: false, // 회원가입 성공
  isSigningUp: false, // 회원가입 시도중
  signUpErrorReason: "", // 회원가입 실패 사유

  me: null, // 내 정보
  followingList: [], // 팔로잉 리스트
  followerList: [], // 팔로워 리스트
  userInfo: null, // 다른 사람의 정보
  isEditingNickname: false, // 이름 변경 중
  editNicknameErrorReason: "", // 이름 변경 실패 사유
  hasMoreFollower: false, //페이지네이션 버튼 유무
  hasMoreFollowing: false //페이지네이션 버튼 유무
};

// 액션의 이름 - saga로 처리할 부분
export const SIGN_UP_REQUEST = "SIGN_UP_REQUEST";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_UP_FAILURE";

export const LOG_IN_REQUEST = "LOG_IN_REQUEST";
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS";
export const LOG_IN_FAILURE = "LOG_IN_FAILURE";

export const LOAD_USER_REQUEST = "LOAD_USER_REQUEST";
export const LOAD_USER_SUCCESS = "LOAD_USER_SUCCESS";
export const LOAD_USER_FAILURE = "LOAD_USER_FAILURE";

export const LOG_OUT_REQUEST = "LOG_OUT_REQUEST";
export const LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";
export const LOG_OUT_FAILURE = "LOG_OUT_FAILURE";

export const LOAD_FOLLOWERS_REQUEST = "LOAD_FOLLOWERS_REQUEST";
export const LOAD_FOLLOWERS_SUCCESS = "LOAD_FOLLOWERS_SUCCESS";
export const LOAD_FOLLOWERS_FAILURE = "LOAD_FOLLOWERS_FAILURE";

export const LOAD_FOLLOWINGS_REQUEST = "LOAD_FOLLOWINGS_REQUEST";
export const LOAD_FOLLOWINGS_SUCCESS = "LOAD_FOLLOWINGS_SUCCESS";
export const LOAD_FOLLOWINGS_FAILURE = "LOAD_FOLLOWINGS_FAILURE";

export const FOLLOW_USER_REQUEST = "FOLLOW_USER_REQUEST";
export const FOLLOW_USER_SUCCESS = "FOLLOW_USER_SUCCESS";
export const FOLLOW_USER_FAILURE = "FOLLOW_USER_FAILURE";

export const UNFOLLOW_USER_REQUEST = "UNFOLLOW_USER_REQUEST";
export const UNFOLLOW_USER_SUCCESS = "UNFOLLOW_USER_SUCCESS";
export const UNFOLLOW_USER_FAILURE = "UNFOLLOW_USER_FAILURE";

export const REMOVE_FOLLOWER_REQUEST = "REMOVE_FOLLOWER_REQUEST";
export const REMOVE_FOLLOWER_SUCCESS = "REMOVE_FOLLOWER_SUCCESS";
export const REMOVE_FOLLOWER_FAILURE = "REMOVE_FOLLOWER_FAILURE";

export const EDIT_NICKNAME_REQUEST = "EDIT_NICKNAME_REQUEST";
export const EDIT_NICKNAME_SUCCESS = "EDIT_NICKNAME_SUCCESS";
export const EDIT_NICKNAME_FAILURE = "EDIT_NICKNAME_FAILURE";

//post ~ user 간 서로의 변화에 대해 서로 감지할 수 있는 action
export const ADD_POST_TO_ME = "ADD_POST_TO_ME";
export const REMOVE_POST_OF_ME = "REMOVE_POST_OF_ME";

export default (state = initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST: {
      return {
        ...state,
        isLoggingIn: true,
        logInErrorReason: ""
      };
    }
    case LOG_IN_SUCCESS: {
      return {
        ...state,
        isLoggingIn: false,
        me: action.data,
        isLoading: false
      };
    }
    case LOG_IN_FAILURE: {
      return {
        ...state,
        isLoggingIn: false,
        logInErrorReason: action.error,
        me: null
      };
    }
    /////////////////////////////////
    case LOG_OUT_REQUEST: {
      return {
        ...state,
        isLoggingOut: true
      };
    }
    case LOG_OUT_SUCCESS: {
      return {
        ...state,
        isLoggingOut: false,
        me: null
      };
    }
    /////////////////////////////////
    case SIGN_UP_REQUEST: {
      return {
        ...state,
        isSigningUp: true,
        isSignedUp: false,
        signUpErrorReason: ""
      };
    }
    case SIGN_UP_SUCCESS: {
      return {
        ...state,
        isSigningUp: false,
        isSignedUp: true
      };
    }
    case SIGN_UP_FAILURE: {
      return {
        ...state,
        isSigningUp: false,
        signUpErrorReason: action.error
      };
    }
    /////////////////////////////////
    case LOAD_USER_REQUEST: {
      return {
        ...state
      };
    }
    case LOAD_USER_SUCCESS: {
      if (action.me) {
        return {
          ...state,
          me: action.data
        };
      }
      return {
        ...state,
        userInfo: action.data
      };
    }
    case LOAD_USER_FAILURE: {
      return {
        ...state
      };
    }
    /////////////////////////////////
    case FOLLOW_USER_REQUEST: {
      return {
        ...state
      };
    }
    case FOLLOW_USER_SUCCESS: {
      return {
        ...state,
        me: {
          ...state.me,
          Followings: [{ id: action.data }, ...state.me.Followings]
        }
      };
    }
    case FOLLOW_USER_FAILURE: {
      return {
        ...state
      };
    }
    /////////////////////////////////
    case UNFOLLOW_USER_REQUEST: {
      return {
        ...state
      };
    }
    case UNFOLLOW_USER_SUCCESS: {
      return {
        ...state,
        me: {
          ...state.me,
          Followings: state.me.Followings.filter(v => v.id !== action.data)
        },
        followingList: state.followingList.filter(v => v.id !== action.data)
      };
    }
    case UNFOLLOW_USER_FAILURE: {
      return {
        ...state
      };
    }
    /////////////////////////////////
    case ADD_POST_TO_ME: {
      return {
        ...state,
        me: {
          ...state.me,
          Posts: [
            {
              id: action.data
              //기존 게시글에 새로운 게시글의 id를 추가
            },
            ...state.me.Posts
          ]
        }
      };
    }
    case REMOVE_POST_OF_ME: {
      return {
        ...state,
        me: {
          ...state.me,
          Posts: state.me.Posts.filter(v => v.id !== action.data)
        }
      };
    }
    /////////////////////////////////
    case LOAD_FOLLOWERS_REQUEST: {
      return {
        ...state,
        hasMoreFollower: action.offset ? state.hasMoreFollower : true
        //처음 action.offset === 0 (false) -> true가 반환!!!
        //action.offset이 수행될 때는 남은 Data가 있다는 의미 -> true를 계속 유지
        //따라서 데이터가 있다면 현 상태 유지, 없다면 상태를 변화 -> false로 변화
      };
    }
    case LOAD_FOLLOWERS_SUCCESS: {
      return {
        ...state,
        followerList: state.followerList.concat(action.data),
        //기존의 것에 덮어쓰기
        hasMoreFollower: action.data.length === 3
        //limit을 3으로 지정했으므로 Data가 1, 2개이면 더 이상 data가 없는 것
        //Data가 3개가 되면 이후에 Data의 유무가 확실치 않게된다
        //1, 2개가 남은 상태라면 hasMoreFollower는 false로 변하게 된다
      };
    }
    case LOAD_FOLLOWERS_FAILURE: {
      return {
        ...state
      };
    }
    /////////////////////////////////
    case LOAD_FOLLOWINGS_REQUEST: {
      return {
        ...state,
        hasMoreFollowing: action.offset ? state.hasMoreFollowing : true
      };
    }
    case LOAD_FOLLOWINGS_SUCCESS: {
      return {
        ...state,
        followingList: state.followingList.concat(action.data),
        hasMoreFollowing: action.data.length === 3
      };
    }
    case LOAD_FOLLOWINGS_FAILURE: {
      return {
        ...state
      };
    }
    /////////////////////////////////
    case REMOVE_FOLLOWER_REQUEST: {
      return {
        ...state
      };
    }
    case REMOVE_FOLLOWER_SUCCESS: {
      return {
        ...state,
        me: {
          ...state.me,
          Followers: state.me.Followers.filter(v => v.id !== action.data)
        },
        followerList: state.followerList.filter(v => v.id !== action.data)
      };
    }
    case REMOVE_FOLLOWER_FAILURE: {
      return {
        ...state
      };
    }
    /////////////////////////////////
    case EDIT_NICKNAME_REQUEST: {
      return {
        ...state,
        isEditingNickname: true,
        editNicknameErrorReason: ""
      };
    }
    case EDIT_NICKNAME_SUCCESS: {
      return {
        ...state,
        isEditingNickname: false,
        me: {
          ...state.me,
          nickname: action.data
        }
      };
    }
    case EDIT_NICKNAME_FAILURE: {
      return {
        ...state,
        isEditingNickname: false,
        editNicknameErrorReason: action.error
      };
    }
    /////////////////////////////////
    default: {
      return {
        ...state
      };
    }
  }
};
