import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { createContext, useState } from "react";

export const AlbumsContext = createContext();

export const AlbumsProvider = ({ children }) => {
  const router = useRouter();
  const { pathname } = router;

  const [albums, setAlbums] = useState([]);

  const toast = useToast();

  const handleDeleteAlbum = async (albumId, onCloseModal) => {
    const deletePromise = axios.delete(`/api/album/${albumId}`);
    toast.promise(deletePromise, {
      loading: { title: "Deleting album..." },
      success: { title: "Album deleted successfully" },
      error: { title: "Error while trying to delete album" },
    });

    const updatedAlbums = [...albums].filter((album) => album.id !== albumId);

    setAlbums(updatedAlbums);

    onCloseModal();
  };

  const handleLeaveAlbum = async (albumId, accountId) => {
    const res = axios.delete(`/api/album/${albumId}/contributors/${accountId}`);

    toast.promise(res, {
      loading: { title: "Leaving album..." },
      success: { title: "You left the album successfully" },
      error: { title: "An error occurred while trying to leave the album" },
    });

    if (pathname === "/album/[albumId]") {
      return router.push("/photos");
    } else {
      setAlbums(albums.filter((album) => album.id !== albumId));
    }
  };

  const contextValue = {
    albums,
    setAlbums,
    handleDeleteAlbum,
    handleLeaveAlbum,
  };

  return (
    <>
      <AlbumsContext.Provider value={contextValue}>
        {children}
      </AlbumsContext.Provider>
    </>
  );
};
