export const initialState = {
  mainPost: []
};

export const ADD_POST = "ADD_POST";
export const ADD_DUMMY = "ADD_DUMMY";

const addPost = {
  type: ADD_POST
};
const addDummy = {
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
