import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

export const AlbumPageContext = createContext();

export const AlbumPageProvider = ({ children }) => {
  const router = useRouter();
  const {pathname} = router;

  const [inAlbumPage, setInAlbumPage] = useState(false);
  const [isAlbumOwner, setIsAlbumOwner] = useState(false);
  const [showAlbumSettings, setShowAlbumSettings] = useState(false);

  useEffect(()=>{

    const updateInAlbumPage = ()=>{
      if(pathname === "/album/[albumId]"){
        setInAlbumPage(true);
      }
    }

    updateInAlbumPage();

    return ()=>{
      setInAlbumPage(false);
    }

  }, [pathname])

  return (
    <>
      <AlbumPageContext.Provider
        value={{ inAlbumPage, setInAlbumPage, isAlbumOwner, setIsAlbumOwner, showAlbumSettings, setShowAlbumSettings }}
      >
        {children}
      </AlbumPageContext.Provider>
    </>
  );
};
