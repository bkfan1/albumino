import { Input, MenuItem, useToast } from "@chakra-ui/react";
import { createRef, useContext } from "react";
import { allowedPhotosFileTypes } from "@/utils/constants";
import axios from "axios";
import { MasonryGridContext } from "@/contexts/MasonryGridContext";
import { AlbumPageContext } from "@/contexts/AlbumPageContext";

export default function UploadPhotosToAlbumForm({ albumId }) {
  const { fetchAlbumPhotos, setUploadingPhotosToAlbum } =
    useContext(AlbumPageContext);
  const { setMasonryPhotos } = useContext(MasonryGridContext);

  const inputFileRef = createRef();

  const toast = useToast();

  const handleInputFileOnClick = () => {
    inputFileRef.current.click();
  };

  const handleOnChangeFileInput = async (e) => {
    setUploadingPhotosToAlbum(true);

    const data = new FormData();

    for (const file of e.target.files) {
      if (allowedPhotosFileTypes.includes(file.type)) {
        data.append("files", file);
      }
    }

    data.append("albumId", albumId);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const resPromise = axios.post(`/api/photos`, data, config);

    toast.promise(resPromise, {
      loading: { title: "Uploading photos to album..." },
      success: { title: "Photos uploaded to album succesfully" },
      error: { title: "An error occurred while uploading photos to album" },
    });

    // Wait for uploading process to update masonryPhotos
    await resPromise;
    setUploadingPhotosToAlbum(false);

    fetchAlbumPhotos(albumId)
      .then((photos) => {
        const updatedMasonryPhotos = photos;
        setMasonryPhotos(updatedMasonryPhotos);
      })
      .catch((err) => {
        toast({
          status: "error",
          title: "An error occurred while trying to update album photos",
        });
      });
  };

  return (
    <>
      <MenuItem onClick={handleInputFileOnClick}>From this device</MenuItem>
      <Input
        type="file"
        accept=".jpg, .jpeg, .png"
        multiple
        ref={inputFileRef}
        onChange={(e) => handleOnChangeFileInput(e)}
        display={"none"}
      />
    </>
  );
}
