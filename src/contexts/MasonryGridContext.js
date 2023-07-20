import { useDisclosure } from "@chakra-ui/react";
import { createContext, useState } from "react";

export const MasonryGridContext = createContext({
  masonryPhotos: [],
  setMasonryPhotos: () => {},
});

export const MasonryGridProvider = ({ children, photos }) => {
  const [masonryPhotos, setMasonryPhotos] = useState(photos);

  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const [showAvailableAlbums, setShowAvailableAlbums] = useState(false);
  const [availableAlbums, setAvailableAlbums] = useState([]);

  const [currentVisorPhoto, setCurrentVisorPhoto] = useState(null);

  const [showCurrentVisorPhotoDetails, setShowCurrentVisorPhotoDetails] =
    useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleUndoSelection = () => {
    setSelectedPhotos([]);
  };

  const contextValue = {
    masonryPhotos,
    setMasonryPhotos,

    selectedPhotos,
    setSelectedPhotos,
    handleUndoSelection,

    isOpen,
    onOpen,
    onClose,

    currentVisorPhoto,
    setCurrentVisorPhoto,

    showAvailableAlbums,
    setShowAvailableAlbums,
    availableAlbums,
    setAvailableAlbums,

    showCurrentVisorPhotoDetails,
    setShowCurrentVisorPhotoDetails,
  };

  return (
    <>
      <MasonryGridContext.Provider value={contextValue}>
        {children}
      </MasonryGridContext.Provider>
    </>
  );
};
