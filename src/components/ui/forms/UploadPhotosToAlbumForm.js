import {
  Button,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { createRef, useContext, useState } from "react";
import MasonryGrid from "../masonry/MasonryGrid";
import { allowedPhotosFileTypes } from "@/utils/validation";
import axios from "axios";
import { AlbumPageContext } from "@/contexts/AlbumPageContext";
import { nanoid } from "nanoid";

export default function UploadPhotosToAlbumForm({albumId}) {
    const {showUploadPhotosForm, setShowUploadPhotosForm} = useContext(AlbumPageContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [filesToUpload, setFilesToUpload] = useState([]);
  const inputFileRef = createRef();

  const toast = useToast();

  const handleToggleFileManager = () => {
    inputFileRef.current.click();
  };

  const handleInputFileRefOnChange = (e) => {
    const newFilesToUpload = [];

    for (const file of e.target.files) {
      if (allowedPhotosFileTypes.includes(file.type)) {
        const fileObject = { id: nanoid(), file, url: URL.createObjectURL(file) };
        newFilesToUpload.push(fileObject);
      }
    }

    const updatedFilesToUpload = [...newFilesToUpload, ...filesToUpload]

    setFilesToUpload(updatedFilesToUpload);
  };

  const onSubmit = async () => {
    try {
      const data = new FormData();

      for (const fileObject of filesToUpload) {
        data.append("files", fileObject.file);
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
    } catch (error) {
        console.log(error)
      toast({
        status: "error",
        title: "An error occurred while uploading photos to album",
      });
    }
  };

  return (
    <>
      <Modal isOpen={showUploadPhotosForm} onClose={()=>{
        setShowUploadPhotosForm(false);
      }} size={"4xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload photos to album</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <HStack width={"100%"} align={"end"}>
              <Button onClick={handleToggleFileManager}>Add photos</Button>
              <Button onClick={onSubmit} colorScheme="blue">Done</Button>
            </HStack>
            <Input
              ref={inputFileRef}
              onChange={(e) => handleInputFileRefOnChange(e)}
              type="file"
              accept=".jpg, .jpeg, .png"
              multiple
              display={"none"}
            />
            <MasonryGrid photos={filesToUpload} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
