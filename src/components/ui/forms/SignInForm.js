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
import { nanoid } from "nanoid";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toast = useToast();

  const onSubmit = async (data) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        callbackUrl: "/photos",
      });
    } catch (error) {
      toast({
        status: "error",
        title: "Error",
        description: "An error occurred while trying to sign in",
        duration: 5000,
      });
    }
  };

  const formFields = [
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
        width={"xs"}
        gap={2}
        padding={2}
      >
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

        <Button type="submit" colorScheme="blue">
          Sign In
        </Button>

        <VStack width={"100%"}>
          <Link href="/signup" style={{ width: "100%" }}>
            <Text color="#3182ce"> Create account</Text>
          </Link>
        </VStack>
      </Flex>
    </>
  );
}
