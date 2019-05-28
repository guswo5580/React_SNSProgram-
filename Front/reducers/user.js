import produce from "immer";

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

// 액션의 이름
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
  return produce(state, draft => {
    switch (action.type) {
      case LOG_IN_REQUEST: {
        draft.isLoggedIn = true;
        draft.logInErrorReason = "";
        break;
      }
      case LOG_IN_SUCCESS: {
        draft.isLoggedIn = true;
        draft.logInErrorReason = "";
        draft.me = action.data;
        break;
      }
      case LOG_IN_FAILURE: {
        draft.isLoggedIn = false;
        draft.logInErrorReason = action.reason;
        draft.me = null;
        break;
      }
      /////////////////////////////////
      case LOG_OUT_REQUEST: {
        draft.isLoggingOut = true;
        break;
      }
      case LOG_OUT_SUCCESS: {
        draft.isLoggingOut = false;
        draft.me = null;
        break;
      }
      /////////////////////////////////
      case SIGN_UP_REQUEST: {
        draft.isSignedUp = false;
        draft.isSigningUp = true;
        draft.signUpErrorReason = "";
        break;
      }
      case SIGN_UP_SUCCESS: {
        draft.isSigningUp = false;
        draft.isSignedUp = true;
        break;
      }
      case SIGN_UP_FAILURE: {
        draft.isSigningUp = false;
        draft.signUpErrorReason = action.error;
        break;
      }
      /////////////////////////////////
      case LOAD_USER_REQUEST: {
        break;
      }
      case LOAD_USER_SUCCESS: {
        if (action.me) {
          draft.me = action.data;
          break;
        }
        draft.useInfo = action.data;
        break;
      }
      case LOAD_USER_FAILURE: {
        break;
      }
      /////////////////////////////////
      case FOLLOW_USER_REQUEST: {
        break;
      }
      case FOLLOW_USER_SUCCESS: {
        draft.me.Followings.unshift({ id: action.data });
        break;
      }
      case FOLLOW_USER_FAILURE: {
        break;
      }
      /////////////////////////////////
      case UNFOLLOW_USER_REQUEST: {
        break;
      }
      case UNFOLLOW_USER_SUCCESS: {
        const index = draft.me.Followings.findIndex(v => v.id === action.data);
        draft.me.Followings.splice(index, 1); //연결된 팔로잉 객체에서 내용 삭제
        const index2 = draft.followingList.findIndex(v => v.id === action.data);
        draft.followingList.splice(index2, 1); //initialState의 요소에서도 삭제
        break;
      }
      case UNFOLLOW_USER_FAILURE: {
        break;
      }
      /////////////////////////////////
      case ADD_POST_TO_ME: {
        draft.me.Posts.unshift({ id: action.data });
        //post에서 변화가 일어났을 때
        //user의 정보에서도 새로운 게시글의 id를 추가
        break;
      }
      case REMOVE_POST_OF_ME: {
        const index = draft.me.Posts.findIndex(v => v.id === action.data);
        draft.me.Posts.splice(index, 1);
        break;
      }
      /////////////////////////////////
      case LOAD_FOLLOWERS_REQUEST: {
        draft.hasMoreFollower = action.offset ? draft.hasMoreFollower : true;
        //처음 데이터를 가져올 때는 더보기 버튼을 보여주는 걸로
        //처음 action.offset === 0 (false) -> true가 반환!!!
        //action.offset이 수행될 때는 남은 Data가 있다는 의미 -> true를 계속 유지
        //따라서 데이터가 있다면 현 상태 유지, 없다면 상태를 변화 -> false로 변화
        break;
      }
      case LOAD_FOLLOWERS_SUCCESS: {
        action.data.forEach(d => {
          draft.followerList.push(d);
          //기존의 것에 덮어쓰기
        });
        draft.hasMoreFollower = action.data.length === 3;
        //limit을 3으로 지정했으므로 Data가 1, 2개이면 더 이상 data가 없는 것
        //Data가 3개가 되면 이후에 Data의 유무가 확실치 않게된다
        //1, 2개가 남은 상태라면 hasMoreFollower는 false로 변하게 된다
        break;
      }
      case LOAD_FOLLOWERS_FAILURE: {
        break;
      }
      /////////////////////////////////
      case LOAD_FOLLOWINGS_REQUEST: {
        draft.hasMoreFollowing = action.offset ? draft.hasMoreFollowing : true; // 처음 데이터를 가져올 때는 더보기 버튼을 보여주는 걸로
        break;
      }
      case LOAD_FOLLOWINGS_SUCCESS: {
        action.data.forEach(d => {
          draft.followingList.push(d);
        });
        draft.hasMoreFollowing = action.data.length === 3;
        break;
      }
      case LOAD_FOLLOWINGS_FAILURE: {
        break;
      }
      /////////////////////////////////
      case REMOVE_FOLLOWER_REQUEST: {
        break;
      }
      case REMOVE_FOLLOWER_SUCCESS: {
        const index = draft.me.Followers.findIndex(v => v.id === action.data);
        draft.me.Followers.splice(index, 1);
        const index2 = draft.followerList.findIndex(v => v.id === action.data);
        draft.followerList.splice(index2, 1);
        break;
      }
      case REMOVE_FOLLOWER_FAILURE: {
        break;
      }
      /////////////////////////////////
      case EDIT_NICKNAME_REQUEST: {
        draft.isEditingNickname = true;
        draft.editNicknameErrorReason = "";
        break;
      }
      case EDIT_NICKNAME_SUCCESS: {
        draft.isEditingNickname = false;
        draft.me.nickname = action.data;
        break;
      }
      case EDIT_NICKNAME_FAILURE: {
        draft.isEditingNickname = false;
        draft.editNicknameErrorReason = action.error;
        break;
      }
      /////////////////////////////////
      default: {
        break;
      }
    }
  });
};
