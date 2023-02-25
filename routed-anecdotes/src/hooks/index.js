import { useState } from "react";

export const useField = (name, type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const reset = ()=>{
    setValue("")
  }

  return {
    value,
    type,
    name,
    onChange,
    reset
  };
};
