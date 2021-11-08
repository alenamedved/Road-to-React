

const actions = {
  init: "STORIES_FETCH_INIT",
  success: "STORIES_FETCH_SUCCESS",
  failure: "STORIES_FETCH_FAILURE",
  remove: "REMOVE_STORY",
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case actions.init:
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case actions.success:
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case actions.failure:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case actions.remove:
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.story.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};

export default storiesReducer;
export { actions };
