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
    const formData = new FormData();
    formData.append("name", data.name);

    for (const file of data.files) {
      formData.append("files", file);
    }

    try {
      const res = await axios.post("/api/albums", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast({
        status:"success",
        title:"Success",
        description:"Album created successfully"
      })
    } catch (error) {
      toast({
        status:"error",
        title:"Error",
        description:"Something went wrong while attempting to create album"
      })
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
          <input type="file" multiple {...register("files")} accept=".jpg, .jpeg, .png" />
        </VStack>
        <Input type="submit" hidden />
      </Box>
    </>
  );
}
