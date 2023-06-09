import { useDisclosure } from "@chakra-ui/react";
import { createContext, useState } from "react";

export const PhotoVisorContext = createContext();

export const PhotoVisorProvider = ({ children }) => {
  // For showing or hiding the PhotoVisor component in the UI
  const { isOpen, onClose, onOpen } = useDisclosure();

  const [visorPhotos, setVisorPhotos] = useState([]);
  const [currentPhoto, setCurrentPhoto] = useState();

  const [selectedPhotos, setSelectedPhotos] = useState([]);

  const [showAvailableAlbums, setShowAvailableAlbums] = useState(false);
  const [availableAlbums, setAvailableAlbums] = useState([]);
  

  const handleSetNextPhoto = () => {
    const currentPhotoIndex = visorPhotos.findIndex(
      (photo) => photo.id === currentPhoto.id
    );

    if (!(currentPhotoIndex === visorPhotos.length - 1)) {
      setCurrentPhoto(visorPhotos[currentPhotoIndex + 1]);
      return;
    }
  };

  const handleSetPreviousPhoto = () => {
    const currentPhotoIndex = visorPhotos.findIndex(
      (photo) => photo.id === currentPhoto.id
    );
    if (currentPhotoIndex > 0) {
      setCurrentPhoto(visorPhotos[currentPhotoIndex - 1]);
      return;
    }
  };

  return (
    <>
      <PhotoVisorContext.Provider
        value={{
          visorPhotos,
          setVisorPhotos,
          selectedPhotos,
          setSelectedPhotos,
          isOpen,
          onClose,
          onOpen,
          currentPhoto,
          setCurrentPhoto,
          showAvailableAlbums,
          setShowAvailableAlbums,
          availableAlbums,
          setAvailableAlbums,
          handleSetNextPhoto,
          handleSetPreviousPhoto,
        }}
      >
        {children}
      </PhotoVisorContext.Provider>
    </>
  );
};
