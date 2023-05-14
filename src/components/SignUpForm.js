import { regex } from "@/utils/regex";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { nanoid } from "nanoid";
import { useForm } from "react-hook-form";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toast = useToast();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("/api/signup", data);
      toast({
        status: "success",
        title: "Success",
        description: res.data.message,
        duration: 5000,
      });
    } catch (error) {
      console.log(error);
      toast({
        status: "error",
        title: "Error",
        description: error.response.data.message,
        duration: 5000,
      });
    }
  };

  const formFields = [
    {
      id: nanoid(),
      type: "text",
      registerName: "firstname",
      registerOptions: {
        required: { value: true, message: "This field is required" },
        pattern: { value: regex.firstname, message: "Type a valid first name" },
      },
      placeholder: "First name",
    },

    {
      id: nanoid(),
      type: "text",
      registerName: "lastname",
      registerOptions: {
        required: { value: true, message: "This field is required" },
        pattern: { value: regex.firstname, message: "Type a valid first name" },
      },
      placeholder: "Last name",
    },
    {
      id: nanoid(),
      type: "email",
      registerName: "email",
      registerOptions: {
        required: { value: true, message: "This field is required" },
        pattern: { value: regex.email, message: "Type a valid email" },
      },
      placeholder: "Email",
    },

    {
      id: nanoid(),
      type: "password",
      registerName: "password",
      registerOptions: {
        minLength: {
          value: 8,
          message: "Password needs to be at least 8 characters long",
        },
      },
      placeholder: "Password",
    },
  ];

  return (
    <>
      <Flex
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        flexDirection={"column"}
        maxWidth={"360px"}
        gap={2}
        padding={2}
      >
        <VStack width={"100%"}>
          <Heading width={"100%"}>Sign Up</Heading>
          <Text width={"100%"}>
            Create an account to upload and share photos
          </Text>
        </VStack>
        <Divider></Divider>

        {formFields.map((field) => (
          <FormControl key={field.id} isRequired>
            <Input
              type={field.type}
              placeholder={field.placeholder}
              {...register(field.registerName, field.registerOptions)}
            />
          </FormControl>
        ))}

        <Button type="submit" colorScheme="green">
          Sign Up
        </Button>
      </Flex>
    </>
  );
}
