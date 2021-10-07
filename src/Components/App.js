import * as React from "react";
import "../App.css";
import InputWithLabel from "./InputWithLabel";
import List from "./List";

const initialStories = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const getAsyncStories = () =>
  new Promise((resolve) =>
    setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
  );

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const actions = {
  init: "STORIES_FETCH_INIT",
  success: "STORIES_FETCH_SUCCESS",
  failure: "STORIES_FETCH_FAILURE",
  remove: "REMOVE_STORY",
};

const storiesReducer = (state, action) => {
  console.log("this is action:", action);
  console.log("this is state:", state);

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

const App = () => {
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    "search", 
    "React"
    );
  //reduces is a function which takes two arg: current state (stories) and an action (dispatchStories) and returns a new state
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer, 
    { data: [], isLoading: false, isError: false }
  );
  console.log(stories);

  React.useEffect(() => {
    dispatchStories({ type: actions.init });

    getAsyncStories()
      .then((result) => {
        dispatchStories({
          type: actions.success,
          payload: result.data.stories,
        });
      })
      .catch(() => 
        dispatchStories({ type: actions.failure })
      );
  }, []);

  console.log("App renders");
  //A
  const handleSearch = (event) => {
    //C
    setSearchTerm(event.target.value);
  };

  const handleRemoveStory = (item) => {
    dispatchStories({
      type: actions.remove,
      payload: {
        story: item,
      },
    });
  };

  const searchedStories = stories.data.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <h1>My Hacker Stories</h1>

      {/* // B */}
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>

      <hr />
      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List 
          list={searchedStories} 
          onRemoveItem={handleRemoveStory} 
        />
      )}
    </>
  );
};

export default App;
