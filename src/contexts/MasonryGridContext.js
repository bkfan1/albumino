import { createContext, useState } from "react";

export const MasonryGridContext = createContext({
  masonryPhotos: [],
  setMasonryPhotos: () => {},
});

export const MasonryGridProvider = ({ children, photos }) => {
  const [masonryPhotos, setMasonryPhotos] = useState(photos);

  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const [deletingSelectedPhotos, setDeletingSelectedPhotos] = useState(false);

  const handleUndoSelection = () => {
    setSelectedPhotos([]);
  };

  const contextValue = {
    masonryPhotos,
    setMasonryPhotos,

    selectedPhotos,
    setSelectedPhotos,
    handleUndoSelection,

    deletingSelectedPhotos,
    setDeletingSelectedPhotos,
  };

  return (
    <>
      <MasonryGridContext.Provider value={contextValue}>
        {children}
      </MasonryGridContext.Provider>
    </>
  );
};
