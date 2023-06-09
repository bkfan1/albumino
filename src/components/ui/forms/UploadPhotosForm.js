import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";
import { useIsMounted } from "@/hooks/useIsMounted";
import {
  Button,
  IconButton,
  Skeleton,
  Tooltip,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { createRef, useContext } from "react";
import { AiOutlineUpload } from "react-icons/ai";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

export default function UploadPhotosForm() {
  const {setVisorPhotos} = useContext(PhotoVisorContext);
  const {inAlbumPage} = useContext(AlbumPageContext);
  const router = useRouter();
  const {isMounted} = useIsMounted();

  const inputFileRef = createRef();
  const toast = useToast();

  const { query } = router;

  const handleButtonClick = () => {
    inputFileRef.current.click();
  };

  const handleImageOnChange = async (e) => {
    const files = e.target.files;

    const formData = new FormData();

    for (const file of files) {
      formData.append(`files`, file);
    }

    if(inAlbumPage){
      formData.append("albumId", query.albumId);
    }

    try {
      const res = await axios.post("/api/photos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res)
      toast({
        title: "Photos uploaded successfully.",
        status: "success",
        duration: 5000,
        isClosable: false,
      });

      // If Photo Visor is open
      setVisorPhotos((visorPhotos)=>[...res.data.photos, ...visorPhotos])

    } catch (error) {
      toast({
        title: "Error while uploading image",
        status: "error",
        duration: 5000,
        isClosable: false,
      });
    }
  };

  return (
    <Tooltip
      label={inAlbumPage ? "Add photos to this album" : "Upload photos"}
    >
      <Skeleton isLoaded={isMounted} rounded={"md"}>
      <div>
        {inAlbumPage ? (
          <IconButton
            onClick={handleButtonClick}
            icon={<MdOutlineAddPhotoAlternate />}
            rounded={"full"}
             variant={"ghost"}
          />
        ) : (
          <Button
            onClick={handleButtonClick}
            leftIcon={<AiOutlineUpload />}
            colorScheme={"blue"}
          >
            Upload
          </Button>
        )}
        <input
          type="file"
          accept=".jpg, .jpeg, .png"
          ref={inputFileRef}
          multiple
          onChange={(e) => handleImageOnChange(e)}
          style={{ display: "none" }}
        />
      </div>
      </Skeleton>
    </Tooltip>
  );
}
