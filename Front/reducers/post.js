export const initialState = {
  mainPost: [
    {
      User: {
        id: 1,
        nickname: "현재"
      },
      content: "첫 번째 게시글",
      img:
        "https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726",
      imagePath: []
    }
  ]
};

export const ADD_POST = "ADD_POST";
export const ADD_DUMMY = "ADD_DUMMY";

export const addPost = {
  type: ADD_POST
};
export const addDummy = {
  type: ADD_DUMMY,
  data: {
    content: "Hello",
    UserId: 1,
    User: {
      nickname: "현재"
    }
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST: {
      return {
        ...state
      };
    }
    case ADD_DUMMY: {
      return {
        ...state,
        mainPost: [action.data, ...state.mainPost]
      };
    }
    default: {
      return {
        ...state
      };
    }
  }
};

export default reducer;
