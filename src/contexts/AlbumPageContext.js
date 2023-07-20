import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

export const AlbumPageContext = createContext();

export const AlbumPageProvider = ({ children }) => {
  const router = useRouter();
  const { pathname } = router;

  const [inAlbumPage, setInAlbumPage] = useState(false);
  const [isAlbumOwner, setIsAlbumOwner] = useState(false);

  const [showAlbumSettings, setShowAlbumSettings] = useState(false);

  const [showUploadPhotosForm, setShowUploadPhotosForm] = useState(false);
  const [showAddPhotosForm, setShowAddPhotosForm] = useState(false);

  const [showAddContributorsForm, setShowAddContributorsForm] = useState(false);

  const [showChangeAlbumNameForm, setShowChangeAlbumNameForm] = useState(false);

  const [showDeleteAlbumAlertDialog, setShowDeleteAlbumAlertDialog] =
    useState(false);

  useEffect(() => {
    const updateInAlbumPage = () => {
      if (pathname === "/album/[albumId]") {
        setInAlbumPage(true);
      }
    };

    updateInAlbumPage();

    return () => {
      setInAlbumPage(false);
    };
  }, [pathname]);

  const contextValue = {
    inAlbumPage,
    setInAlbumPage,
    isAlbumOwner,
    setIsAlbumOwner,
    showAlbumSettings,
    setShowAlbumSettings,
    showAddPhotosForm,
    setShowAddPhotosForm,

    showUploadPhotosForm,
    setShowUploadPhotosForm,

    showAddContributorsForm,
    setShowAddContributorsForm,

    showChangeAlbumNameForm,
    setShowChangeAlbumNameForm,

    showDeleteAlbumAlertDialog,
    setShowDeleteAlbumAlertDialog,
  };

  return (
    <>
      <AlbumPageContext.Provider value={contextValue}>
        {children}
      </AlbumPageContext.Provider>
    </>
  );
};
