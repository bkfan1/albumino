import { useDisableButtons } from "@/hooks/useDisableButtons";
import { regex } from "@/utils/regex";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { disableButtons, toggleDisableButtons } = useDisableButtons();

  const toast = useToast();

  const onSubmit = async (data) => {
    try {
      toggleDisableButtons();
      await axios.post(`/api/signup`, data);

      toast({
        status: "success",
        title: "Account created succesfully",
      });

      toggleDisableButtons();
    } catch (error) {
      toast({
        status: "error",
        title: "Error",
        description: "An error occurred while attempting to sign up",
      });
      toggleDisableButtons();
    }
  };

  const formFields = [
    {
      id: nanoid(),
      type: "text",
      registerName: "firstname",
      registerOptions: {
        required: { value: true, message: "This field is required" },
        pattern: { value: regex.firstname, message: "Type a valid firstname" },
      },
      placeholder: "First name",
    },

    {
      id: nanoid(),
      type: "text",
      registerName: "lastname",
      registerOptions: {
        required: { value: true, message: "This field is required" },
        pattern: { value: regex.firstname, message: "Type a valid lastname" },
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
          <Heading width={"100%"} size={"lg"}>
            Sign Up
          </Heading>
          <Text width={"100%"}>
            Create an account to upload and share photos
          </Text>
        </VStack>
        <Divider></Divider>

        {formFields.map((field) => (
          <FormControl
            key={field.id}
            isRequired
            isInvalid={errors[field.registerName]}
          >
            <Input
              type={field.type}
              placeholder={field.placeholder}
              {...register(field.registerName, field.registerOptions)}
            />
            <FormErrorMessage>
              {errors[field.registerName] && errors[field.registerName].message}
            </FormErrorMessage>
          </FormControl>
        ))}

        <Input type="submit" hidden isDisabled={disableButtons} />

        <Button type="submit" colorScheme="green" isDisabled={disableButtons}>
          Sign Up
        </Button>

        <Text mt={1} fontSize={"md"}>
          Already have an account?{" "}
          <Link href={"/signin/"} style={{ color: "#468fd3" }}>
            Sign In
          </Link>
        </Text>
      </Flex>
    </>
  );
}
