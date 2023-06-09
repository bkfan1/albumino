import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

export const AlbumPageContext = createContext();

export const AlbumPageProvider = ({ children }) => {
  const [inAlbumPage, setInAlbumPage] = useState(false);
  const [isAlbumOwner, setIsAlbumOwner] = useState(false);

  return (
    <>
      <AlbumPageContext.Provider
        value={{ inAlbumPage, setInAlbumPage, isAlbumOwner, setIsAlbumOwner }}
      >
        {children}
      </AlbumPageContext.Provider>
    </>
  );
};
