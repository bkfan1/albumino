import axios from "axios";
import { createContext, useState } from "react";

export const PhotoVisorContext = createContext();

export const PhotoVisorProvider = ({ children, photo, modal}) => {

  const [showAvailableAlbums, setShowAvailableAlbums] = useState(false);
  const [availableAlbums, setAvailableAlbums] =useState([])

  return (
    <>
      <PhotoVisorContext.Provider value={{photo, modal, showAvailableAlbums, setShowAvailableAlbums, availableAlbums, setAvailableAlbums}}>
        {children}
      </PhotoVisorContext.Provider>
    </>
  );
};
