import produce from "immer";

export const initialState = {
  mainPosts: [],
  imagePaths: [], //미리보기 이미지 경로
  addPostErrorReason: "", // 포스트 업로드 실패 사유
  isAddingPost: false, // 포스트 업로드 중
  postAdded: false, // 포스트 업로드 성공

  isAddingComment: false, //댓글 업로드 중
  addCommentErrorReason: "", //댓글 업로드 실패 이유
  commentAdded: false, //댓글 업로드 성공
  hasMorePost: false,
  singlePost: null
};

export const LOAD_MAIN_POSTS_REQUEST = "LOAD_MAIN_POSTS_REQUEST";
export const LOAD_MAIN_POSTS_SUCCESS = "LOAD_MAIN_POSTS_SUCCESS";
export const LOAD_MAIN_POSTS_FAILURE = "LOAD_MAIN_POSTS_FAILURE";

export const LOAD_HASHTAG_POSTS_REQUEST = "LOAD_HASHTAG_POSTS_REQUEST";
export const LOAD_HASHTAG_POSTS_SUCCESS = "LOAD_HASHTAG_POSTS_SUCCESS";
export const LOAD_HASHTAG_POSTS_FAILURE = "LOAD_HASHTAG_POSTS_FAILURE";

export const LOAD_USER_POSTS_REQUEST = "LOAD_USER_POSTS_REQUEST";
export const LOAD_USER_POSTS_SUCCESS = "LOAD_USER_POSTS_SUCCESS";
export const LOAD_USER_POSTS_FAILURE = "LOAD_USER_POSTS_FAILURE";

export const UPLOAD_IMAGES_REQUEST = "UPLOAD_IMAGES_REQUEST";
export const UPLOAD_IMAGES_SUCCESS = "UPLOAD_IMAGES_SUCCESS";
export const UPLOAD_IMAGES_FAILURE = "UPLOAD_IMAGES_FAILURE";

export const REMOVE_IMAGE = "REMOVE_IMAGE"; //삭제는 굳이 비동기로 처리할 필요X

export const ADD_POST_REQUEST = "ADD_POST_REQUEST";
export const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
export const ADD_POST_FAILURE = "ADD_POST_FAILURE";

export const LIKE_POST_REQUEST = "LIKE_POST_REQUEST";
export const LIKE_POST_SUCCESS = "LIKE_POST_SUCCESS";
export const LIKE_POST_FAILURE = "LIKE_POST_FAILURE";

export const UNLIKE_POST_REQUEST = "UNLIKE_POST_REQUEST";
export const UNLIKE_POST_SUCCESS = "UNLIKE_POST_SUCCESS";
export const UNLIKE_POST_FAILURE = "UNLIKE_POST_FAILURE";

export const ADD_COMMENT_REQUEST = "ADD_COMMENT_REQUEST";
export const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
export const ADD_COMMENT_FAILURE = "ADD_COMMENT_FAILURE";

export const LOAD_COMMENTS_REQUEST = "LOAD_COMMENTS_REQUEST";
export const LOAD_COMMENTS_SUCCESS = "LOAD_COMMENTS_SUCCESS";
export const LOAD_COMMENTS_FAILURE = "LOAD_COMMENTS_FAILURE";

export const RETWEET_REQUEST = "RETWEET_REQUEST";
export const RETWEET_SUCCESS = "RETWEET_SUCCESS";
export const RETWEET_FAILURE = "RETWEET_FAILURE";

export const REMOVE_POST_REQUEST = "REMOVE_POST_REQUEST";
export const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
export const REMOVE_POST_FAILURE = "REMOVE_POST_FAILURE";

export const LOAD_POST_REQUEST = "LOAD_POST_REQUEST";
export const LOAD_POST_SUCCESS = "LOAD_POST_SUCCESS";
export const LOAD_POST_FAILURE = "LOAD_POST_FAILURE";

export default (state = initialState, action) => {
  return produce(state, draft => {
    switch (action.type) {
      case ADD_POST_REQUEST: {
        draft.isAddingPost = true;
        draft.addingPostErrorReason = "";
        draft.postAdded = false;
        break;
      }
      case ADD_POST_SUCCESS: {
        draft.isAddingPost = false;
        draft.mainPosts.unshift(action.data);
        draft.postAdded = true;
        draft.imagePaths = []; //이미지 미리보기 초기화
        break;
      }
      case ADD_POST_FAILURE: {
        draft.isAddingPost = false;
        draft.addPostErrorReason = action.error;
        break;
      }
      ////////////////////////////////
      case ADD_COMMENT_REQUEST: {
        draft.isAddingComment = true;
        draft.addCommentErrorReason = "";
        draft.commentAdded = false;
        break;
      }
      case ADD_COMMENT_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(
          v => v.id === action.data.postId
        );
        draft.mainPosts[postIndex].Comments.push(action.data.comment);
        draft.isAddingComment = false;
        draft.commentAdded = true;
        break;
      }
      case ADD_COMMENT_FAILURE: {
        draft.isAddingComment = false;
        draft.addingPostErrorReason = action.error;
        break;
      }
      ////////////////////////////////
      case LOAD_COMMENTS_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(
          v => v.id === action.data.postId
        );
        draft.mainPosts[postIndex].Comments = action.data.comments;
        break;
      }

      ////////////////////////////////
      //같은 역할을 하는 경우 Case 문으로 엮어서 이용!!
      case LOAD_MAIN_POSTS_REQUEST:
      case LOAD_HASHTAG_POSTS_REQUEST:
      case LOAD_USER_POSTS_REQUEST: {
        draft.mainPosts = !action.lastId ? [] : draft.mainPosts;
        //처음 게시글을 불러올 때는 빈 객체부터 시작
        //게시글을 이어서 받을 때는 기존 post를 유지한 채로
        draft.hasMorePost = action.lastId ? draft.hasMorePost : true;
        //스크롤 기능을 막지 않으면 계속 REQUEST가 일어남
        //불러올 게시글이 없으면 스크롤 기능 비활성화
        break;
      }
      case LOAD_MAIN_POSTS_SUCCESS:
      case LOAD_HASHTAG_POSTS_SUCCESS:
      case LOAD_USER_POSTS_SUCCESS: {
        action.data.forEach(d => {
          draft.mainPosts.push(d);
          //기존 게시글 위로 덮어쓰기
        });
        draft.hasMorePost = action.data.length === 10;
        //현재 렌더링한 게시글이 10개가 되지 않는다면
        //hasMorePost는 false가 되므로 스크롤링 방지
        break;
      }
      case LOAD_MAIN_POSTS_FAILURE:
      case LOAD_HASHTAG_POSTS_FAILURE:
      case LOAD_USER_POSTS_FAILURE: {
        break;
      }
      ////////////////////////////////
      case UPLOAD_IMAGES_REQUEST: {
        break;
      }
      case UPLOAD_IMAGES_SUCCESS: {
        action.data.forEach(p => {
          draft.imagePaths.push(p);
        });
        break;
      }
      case UPLOAD_IMAGES_FAILURE: {
        break;
      }
      ////////////////////////////////
      case REMOVE_IMAGE: {
        const index = draft.imagePaths.findIndex((v, i) => i === action.index);
        draft.imagePaths.splice(index, 1);
        break;
      }
      ////////////////////////////////
      case LIKE_POST_REQUEST: {
        break;
      }
      case LIKE_POST_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(
          v => v.id === action.data.postId
        );
        draft.mainPosts[postIndex].Likers.unshift({ id: action.data.userId });
        break;
      }
      case LIKE_POST_FAILURE: {
        break;
      }
      case UNLIKE_POST_REQUEST: {
        break;
      }
      case UNLIKE_POST_SUCCESS: {
        const postIndex = draft.mainPosts.findIndex(
          v => v.id === action.data.postId
        );
        const likeIndex = draft.mainPosts[postIndex].Likers.findIndex(
          v => v.id === action.data.userId
        );
        draft.mainPosts[postIndex].Likers.splice(likeIndex, 1);
        break;
      }
      case UNLIKE_POST_FAILURE: {
        break;
      }
      ////////////////////////////////////////////
      case RETWEET_REQUEST: {
        break;
      }
      case RETWEET_SUCCESS: {
        draft.mainPosts.unshift(action.data);
        break;
      }
      case RETWEET_FAILURE: {
        break;
      }
      ////////////////////////////////////////////
      case REMOVE_POST_REQUEST: {
        break;
      }
      case REMOVE_POST_SUCCESS: {
        const index = draft.mainPosts.findIndex(v => v.id === action.data);
        draft.mainPosts.splice(index, 1);
        break;
      }
      case REMOVE_POST_FAILURE: {
        break;
      }
      case LOAD_POST_SUCCESS: {
        draft.singlePost = action.data;
        break;
      }
      default: {
        break;
      }
    }
  });
};
