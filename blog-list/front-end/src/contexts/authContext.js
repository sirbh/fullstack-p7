import { createContext, useContext, useEffect, useReducer } from "react";
import blogService from "../services/blogs";

const reducer = (state, action) => {
  switch (action.type) {
  case "SET_USER": {
    return action.payload;
  }
  default: {
    return state;
  }
  }
};

const AuthContext = createContext();

export const AuthContextProvider = (props) => {
  const [authState, dispatch] = useReducer(reducer,undefined);
  useEffect(() => {
    const storeduser = window.localStorage.getItem("user");
    if (storeduser) {
      const userObj = JSON.parse(storeduser);
      dispatch({
        type:"SET_USER",
        payload:userObj
      });
      blogService.setToken(userObj.token);
    }
  }, []);
  return (
    <AuthContext.Provider value={[authState, dispatch]}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useStoredUser = () => {
  const user = useContext(AuthContext)[0];
  return user;
};

export const useUserDispatch = () => {
  const dispatch = useContext(AuthContext)[1];
  return dispatch;
};

export default AuthContext;
