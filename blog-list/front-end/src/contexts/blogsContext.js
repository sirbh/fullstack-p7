import { createContext, useReducer } from "react";

const reducer = (state, action) => {
  switch (action.type) {
  case "SET_BLOGS": {
    return action.payload;
  }
  default: {
    return state;
  }
  }
};

const BlogsContext = createContext();

export const BlogsContextProvider = (props) => {
  const [dispatch, blogs] = useReducer(reducer, []);

  return (
    <BlogsContext.Provider value={[dispatch, blogs]}>
      {props.children}
    </BlogsContext.Provider>
  );
};
