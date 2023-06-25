import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  HStack,
  Heading,
  IconButton,
  Image,
  Input,
  Text,
  Tooltip,
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
import { hasInvalidFileType } from "@/utils/validation";
import { allowedPhotosFileTypes } from "@/utils/validation";

export default function CreateAlbumForm() {
  const { visorPhotos, setVisorPhotos, setCurrentPhoto } =
    useContext(PhotoVisorContext);
  const inputFileRef = createRef();

  const { register, handleSubmit } = useForm();

  const toast = useToast();

  const handleInputFileOnClick = () => {
    inputFileRef.current.click();
  };

  const handleInputFileOnChange = (e) => {
    let files = [...e.target.files];
    const updatedVisorPhotos = [...visorPhotos];

    const hasInvalidFiles = hasInvalidFileType(files, allowedPhotosFileTypes);

    if (hasInvalidFiles) {
      files = files.filter((file) =>
        allowedPhotosFileTypes.includes(file.type)
      );
    }

    for (const file of files) {
      const url = URL.createObjectURL(file);
      const id = nanoid();

      const photoToUpload = {
        id,
        file,
        url,
      };

      updatedVisorPhotos.push(photoToUpload);
    }

    setVisorPhotos(updatedVisorPhotos);
  };

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`/api/albums`, { name: data.name });
      const albumId = res.data.albumId;

      // We are going to use the photos from visorPhotos state variable
      // Since we can take advantage of MasonryGrid to display the uploading photos
      // for previewing them in this form (and saving us the need of create another component for this purpose)

      // NOTE: I dont think that the described approach above is good to handle this form, but
      // I didn't came with a best solution, so... feel free to open an issue in the app's repository
      // about how to change this approach to a better one

      if (visorPhotos.length > 0) {
        const formData = new FormData();

        for (const photo of visorPhotos) {
          const file = photo.file;
          console.log(file);

          formData.append("files", file);
        }

        formData.append("albumId", albumId);

        const config = { headers: { "Content-Type": "multipart/form-data" } };

        const res2 = await axios.post(`/api/photos`, formData, config);
      }

      toast({
        status: "success",
        title: "Album created succesfully",
      });

      setVisorPhotos([]);
      setCurrentPhoto({});
    } catch (error) {
      toast({
        status: "error",
        title: "An error occurred while trying to create album",
      });
    }
  };

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
              {...register("name", {
                required: { value: true, message: "This field is required" },
              })}
            />
          </FormControl>
          <ButtonGroup>
            <Tooltip label="Add photos">
              <IconButton
                onClick={handleInputFileOnClick}
                icon={<MdOutlineAddPhotoAlternate />}
                rounded={"full"}
                display={visorPhotos.length > 0 ? "flex" : "none"}
              />
            </Tooltip>
            <Tooltip label="Create album">
              <IconButton type="submit" icon={<BsCheckLg />} rounded={"full"} />
            </Tooltip>
          </ButtonGroup>
        </HStack>

        <Flex
          width={"100%"}
          height={"100%"}
          alignItems={visorPhotos.length === 0 && "center"}
          justifyContent={visorPhotos.length === 0 && "center"}
          py={6}
        >
          {visorPhotos.length > 0 ? (
            <MasonryGrid />
          ) : (
            <VStack>
              <Image src={"/empty_state_album.svg"} alt="" />
              <Heading size={"md"}>Album is empty</Heading>
              <Button onClick={handleInputFileOnClick} colorScheme="blue">
                Add photos
              </Button>
            </VStack>
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
