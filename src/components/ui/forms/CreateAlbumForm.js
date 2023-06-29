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
import axios from "axios";
import { allowedPhotosFileTypes } from "@/utils/validation";

export default function CreateAlbumForm() {
  const inputFileRef = createRef();

  const [loadedFiles, setLoadedFiles] = useState([]);

  const { register, handleSubmit } = useForm();

  const toast = useToast();

  const handleInputFileOnClick = () => {
    inputFileRef.current.click();
  };

  const handleInputFileOnChange = (e) => {
    const newFiles = [];

    for (const file of e.target.files) {
      if (allowedPhotosFileTypes.includes(file.type)) {
        const fileObject = {
          id: nanoid(),
          file,
          url: URL.createObjectURL(file),
        };

        newFiles.push(fileObject);
      }
    }

    const updatedLoadedFiles = [...newFiles, ...loadedFiles];

    setLoadedFiles(updatedLoadedFiles);
  };

  const onSubmit = async (data) => {
    try {
      const res = await axios.post(`/api/albums`, { name: data.name });
      const albumId = res.data.albumId;

      if (loadedFiles.length > 0) {
        const formData = new FormData();

        for (const fileObject of loadedFiles) {
          const file = fileObject.file;
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
    } catch (error) {
      console.log(error);
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
                minLength: {
                  value: 1,
                  message: "Album name has to be at least 1 character long",
                },
                maxLength: { value: 256, message: "" },
              })}
            />
          </FormControl>
          <ButtonGroup>
            <Tooltip label="Add photos">
              <IconButton
                onClick={handleInputFileOnClick}
                icon={<MdOutlineAddPhotoAlternate />}
                rounded={"full"}
                display={loadedFiles.length > 0 ? "flex" : "none"}
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
          alignItems={loadedFiles.length === 0 && "center"}
          justifyContent={loadedFiles.length === 0 && "center"}
          py={6}
        >
          {loadedFiles.length === 0 ? (
            <VStack>
              <Image src="/empty_state_album.svg" alt="" />
              <Heading size={"md"}>Album is empty</Heading>
              <Button onClick={handleInputFileOnClick} colorScheme="blue">
                Upload photos
              </Button>
            </VStack>
          ) : (
            <MasonryGrid photos={loadedFiles} />
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
