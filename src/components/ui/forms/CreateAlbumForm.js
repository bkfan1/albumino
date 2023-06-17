import {
  Box,
  Flex,
  FormControl,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function CreateAlbumForm() {
  const { register, handleSubmit } = useForm();
  const toast = useToast();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      for (const file of data.files) {
        formData.append("files", file);
      }

      const res = await axios.post("/api/albums", { name: data.name });
      const albumId = res.data.albumId;

      formData.append("albumId", albumId);

      if (data.files.length > 0) {
        const config = {
          headers: { "Content-Type": "multipart/form-data" },
        };

        const res2 = await axios.post(`/api/photos`, formData, config);
      }

      toast({
        status: "success",
        title: "Album created successfully",
      });
    } catch (error) {
      toast({
        status: "error",
        title: "Error",
        description: "Something went wrong while attempting to create album",
      });
    }
  };
  return (
    <>
      <Box width={"100%"} as="form" onSubmit={handleSubmit(onSubmit)}>
        <FormControl width={"100%"}>
          <Input
            type="text"
            placeholder="Add a title"
            size={"lg"}
            variant={"flushed"}
            {...register("name")}
          />
        </FormControl>

        <VStack paddingTop={4}>
          <Heading size={"sm"}>Album is empty</Heading>
          <input
            type="file"
            multiple
            {...register("files")}
            accept=".jpg, .jpeg, .png"
          />
        </VStack>
        <Input type="submit" hidden />
      </Box>
    </>
  );
}
