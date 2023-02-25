import { useReducer, createContext, useContext } from "react";

const reducer = (state, action) => {
  switch (action.type) {
  case "SET": {
    return action.payload;
  }
  default: {
    return state;
  }
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification,dispatch] = useReducer(reducer,"");
  return <NotificationContext.Provider value = {[notification,dispatch]}>
    {props.children}
  </NotificationContext.Provider>;
};

export const useNotification = () => {
  const notification = useContext(NotificationContext)[0];
  return notification;
};

export const useNotificationDispatch = () => {
  const notificationDispatch = useContext(NotificationContext)[1];
  return notificationDispatch;
};
