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
    const res = axios.delete(`/api/album/${albumId}`);
    toast.promise(res, {
      loading: { title: "Deleting album..." },
      success: { title: "Album deleted successfully" },
      error: { title: "Error while trying to delete album" },
    });

    await res;

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

    await res;

    if (pathname === "/shared") {
      const updatedAlbums = [...albums.filter((album)=>album.id !==  albumId)];
      setAlbums(updatedAlbums);
    } else {
      return await router.push("/photos");
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
