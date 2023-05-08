import { useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { createContext, useState } from "react";

export const PhotoVisorContext = createContext();

export const PhotoVisorProvider = ({children, photos}) => {

  const {isOpen, onClose, onOpen} = useDisclosure();

  const [currentPhoto, setCurrentPhoto] = useState();

  const [showAvailableAlbums, setShowAvailableAlbums] = useState(false)
  const [availableAlbums, setAvailableAlbums] = useState([]);

  const handleSetNextPhoto = ()=>{

    const currentPhotoIndex = photos.findIndex((photo)=>photo.id === currentPhoto.id);

    if(!(currentPhotoIndex === photos.length - 1)){
      setCurrentPhoto(photos[currentPhotoIndex + 1])
      return
    }
  }

  const handleSetPreviousPhoto = ()=>{
    const currentPhotoIndex = photos.findIndex((photo)=>photo.id === currentPhoto.id);
    if((currentPhotoIndex > 0)){
      setCurrentPhoto(photos[currentPhotoIndex-1]);
      return;
    }


  }

  return (
    <>
      <PhotoVisorContext.Provider value={{photos, isOpen, onClose, onOpen, currentPhoto, setCurrentPhoto, showAvailableAlbums, setShowAvailableAlbums, availableAlbums, setAvailableAlbums, handleSetNextPhoto, handleSetPreviousPhoto}} >
        {children}
      </PhotoVisorContext.Provider>
    </>
  );
};
