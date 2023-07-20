import { Input, MenuItem, useToast } from "@chakra-ui/react";
import { createRef, useContext, useState } from "react";
import { allowedPhotosFileTypes } from "@/utils/constants";
import axios from "axios";
import { MasonryGridContext } from "@/contexts/MasonryGridContext";

export default function UploadPhotosToAlbumForm({ albumId }) {
  const { setMasonryPhotos } = useContext(MasonryGridContext);

  const inputFileRef = createRef();

  const toast = useToast();

  const handleInputFileOnClick = () => {
    inputFileRef.current.click();
  };

  const handleOnChangeFileInput = async (e) => {
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

    const req = axios
      .get(`/api/album/${albumId}/photos`)
      .then((res2) => {
        const updatedMasonryPhotos = res2.data.photos;

        setMasonryPhotos(updatedMasonryPhotos);
      })
      .catch((error) => {
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
