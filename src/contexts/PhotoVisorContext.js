import { useDisclosure } from "@chakra-ui/react";
import { createContext, useState } from "react";

export const PhotoVisorContext = createContext();

export const PhotoVisorProvider = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [currentVisorPhoto, setCurrentVisorPhoto] = useState(null);

  const [showCurrentVisorPhotoDetails, setShowCurrentVisorPhotoDetails] =
    useState(false);

  const [showAvailableAlbums, setShowAvailableAlbums] = useState(false);
  const [availableAlbums, setAvailableAlbums] = useState([]);

  const contextValue = {
    isOpen,
    onOpen,
    onClose,
    currentVisorPhoto,
    setCurrentVisorPhoto,
    showCurrentVisorPhotoDetails,
    setShowCurrentVisorPhotoDetails,
    showAvailableAlbums,
    setShowAvailableAlbums,
    availableAlbums,
    setAvailableAlbums,
  };

  return (
    <>
      <PhotoVisorContext.Provider value={contextValue}>
        {children}
      </PhotoVisorContext.Provider>
    </>
  );
};
