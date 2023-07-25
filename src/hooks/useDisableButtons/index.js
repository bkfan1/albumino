import { useState } from "react";

export const useDisableButtons = () => {
  const [disableButtons, setDisableButtons] = useState(false);

  const toggleDisableButtons = () => {
    setDisableButtons(!disableButtons);
  };

  return { disableButtons, toggleDisableButtons };
};
