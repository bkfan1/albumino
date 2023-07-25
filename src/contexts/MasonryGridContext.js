import { createContext, useState } from "react";

export const MasonryGridContext = createContext({
  masonryPhotos: [],
  setMasonryPhotos: () => {},
});

export const MasonryGridProvider = ({ children, photos }) => {
  const [masonryPhotos, setMasonryPhotos] = useState(photos);

  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const handleUndoSelection = () => {
    setSelectedPhotos([]);
  };

  const contextValue = {
    masonryPhotos,
    setMasonryPhotos,

    selectedPhotos,
    setSelectedPhotos,
    handleUndoSelection,
  };

  return (
    <>
      <MasonryGridContext.Provider value={contextValue}>
        {children}
      </MasonryGridContext.Provider>
    </>
  );
};
