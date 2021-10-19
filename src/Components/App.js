import * as React from "react";
import "../App.css";
import InputWithLabel from "./InputWithLabel";
import List from "./List";

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

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
  const [url, setUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  )
  //reduces is a function which takes two arg: current state (stories) and an action (dispatchStories) and returns a new state
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer, 
    { data: [], isLoading: false, isError: false }
  );
  
  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value)
  }
  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`)
  }
  const handleFetchStories = React.useCallback(() => {
    
    dispatchStories({ type: actions.init });

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        console.log(result)
        dispatchStories({
          type: actions.success,
          payload: result.hits,
        });
      })
      .catch(() => 
        dispatchStories({ type: actions.failure })
      );
  }, [url]);
  

  React.useEffect(() => {
    handleFetchStories()
  }, [handleFetchStories])

 
 
  const handleSearch = (event) => {
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

  

  return (
    <>
      <h1>My Hacker Stories</h1>

      {/* // B */}
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearchInput}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      <button 
        type="button"
        disabled={!searchTerm}
        onClick={handleSearchSubmit}
      >Submit
      </button>
      <p>
        Searching for <strong>{searchTerm}</strong>
      </p>

      <hr />
      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List 
          list={stories.data} 
          onRemoveItem={handleRemoveStory} 
        />
      )}
    </>
  );
};

export default App;
