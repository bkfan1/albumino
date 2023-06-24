import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  HStack,
  IconButton,
  Image,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { createRef, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BsCheckLg } from "react-icons/bs";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import MasonryGrid from "../masonry/MasonryGrid";
import { nanoid } from "nanoid";
import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";
import axios from "axios";

export default function CreateAlbumForm() {
  const { setVisorPhotos } = useContext(PhotoVisorContext);
  const inputFileRef = createRef();
  const { register, handleSubmit } = useForm();
  const [imagesToUpload, setImagesToUpload] = useState([]);
  // const [previewImages, setPreviewImages] = useState([]);
  const toast = useToast();

  const handleInputFileOnClick = () => {
    inputFileRef.current.click();
  };

  const handleInputFileOnChange = (e) => {
    const files = e.target.files;
    const updatedImagesToUpload = [...imagesToUpload];
    // const updatedPreviewImages = [...previewImages];

    for (const file of files) {
      updatedImagesToUpload.push(file);

      const url = URL.createObjectURL(file);

      // updatedPreviewImages.push({
      //   id: nanoid(),
      //   url,
      // });
    }

    setImagesToUpload(updatedImagesToUpload);
    // setPreviewImages(updatedPreviewImages);
  };

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`/api/albums`, { name: data.name });
      const albumId = res.data.albumId;

      if (imagesToUpload.length > 0) {
        const formData = new FormData();

        for (const image of imagesToUpload) {
          formData.append("files", image);
        }

        formData.append("albumId", albumId);

        const config = { headers: { "Content-Type": "multipart/form-data" } };

        const res2 = await axios.post(`/api/photos`, formData, config);
      }

      toast({
        status: "success",
        title: "Album created succesfully",
      });
    } catch (error) {
      toast({
        status: "error",
        title: "An error occurred while trying to create album",
      });
    }
  };

  // useEffect(() => {
  //   setVisorPhotos(previewImages);
  // }, [previewImages, setVisorPhotos]);

  return (
    <>
      <Box
        as="form"
        width={"100%"}
        height={"100%"}
        onSubmit={handleSubmit(onSubmit)}
      >
        <HStack>
          <FormControl>
            <Input
              type="text"
              placeholder="Album name"
              variant={"flushed"}
              fontSize={"2xl"}
              {...register("name")}
            />
          </FormControl>
          <ButtonGroup>
            {imagesToUpload.length > 0 ? (
              <IconButton
                onClick={handleInputFileOnClick}
                icon={<MdOutlineAddPhotoAlternate />}
                rounded={"full"}
              ></IconButton>
            ) : (
              ""
            )}
            <IconButton icon={<BsCheckLg />} rounded={"full"} />
          </ButtonGroup>
        </HStack>

        <Flex
          justifyContent={"center"}
          alignItems={"center"}
          width={"100%"}
          height={"100%"}
          py={6}
        >
          {/* <MasonryGrid /> */}
          {imagesToUpload.length === 0 ? (
            <VStack>
              <Text fontWeight={"bold"}>Album is empty</Text>
              <Button onClick={handleInputFileOnClick} colorScheme="blue">
                Add photos
              </Button>
              <Image src="/empty_state_album.svg" alt="" />
            </VStack>
          ) : (
            ""
          )}
        </Flex>

        <Input
          ref={inputFileRef}
          onChange={(e) => handleInputFileOnChange(e)}
          type="file"
          accept=".jpg,.jpeg, .png"
          multiple
          display={"none"}
        />
      </Box>
    </>
  );
}
