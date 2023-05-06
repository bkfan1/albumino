import { Button, VStack, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { createRef, useState } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { v4 } from "uuid";

export default function UploadPhotosForm() {
  const router = useRouter();
  const { pathname } = router;
  const toast = useToast();

  const inputFileRef = createRef();

  const handleButtonClick = () => {
    inputFileRef.current.click();
  };

  const handleImageOnChange = async (e) => {
    const files = e.target.files;

    const formData = new FormData();

    for (const file of files) {
      formData.append(`files`, file);
    }

    console.log(formData);

    try {
      const res = await axios.post("/api/photos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast({
        title: "Photos uploaded successfully.",
        status: "success",
        duration: 5000,
        isClosable: false,
      });
    } catch (error) {
      toast({
        title: "Error while uploading image",
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }
  };

  const isInAlbumRoute = pathname === "/album/[albumId]" ? true : false;

  return (
    <>
      <Button
        leftIcon={isInAlbumRoute ? "" : <AiOutlineUpload />}
        onClick={handleButtonClick}
        colorScheme={isInAlbumRoute ? "gray" : "blue"}
        variant={isInAlbumRoute ? "ghost" : "solid"}
        title={isInAlbumRoute ? "Add photos to this album" : "Upload photos"}
      >
        {isInAlbumRoute ? "" : "Upload"}
        {isInAlbumRoute ? <MdOutlineAddPhotoAlternate/> : ""}
        <input
          type="file"
          accept="image/*"
          ref={inputFileRef}
          multiple
          onChange={(e) => handleImageOnChange(e)}
          style={{ display: "none" }}
        />
      </Button>
    </>
  );
}
