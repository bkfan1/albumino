import { regex } from "@/utils/regex";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useForm } from "react-hook-form";
import PasswordInput from "../inputs/PasswordInput";

export default function ChangeAccountPasswordForm() {
  const { register, handleSubmit } = useForm();

  const toast = useToast();

  const onSubmit = async (data) => {
    try {
      const resPromise = axios.put("/api/account/password", data);
      toast.promise(resPromise, {
        // loading: {title:"Changing password..."},
        success: { title: "Password updated successfully" },
        error: { title: "An error occurred while trying to update password" },
      });

      await resPromise;
    } catch (error) {
      toast({
        status: "error",
        title: "An error occurred while trying to update password",
      });
    }
  };
  return (
    <>
      <VStack
        as="form"
        maxWidth={"360px"}
        spacing={2}
        onSubmit={handleSubmit(onSubmit)}
      >
        <Heading size={"md"} width={"100%"}>
          Change account password
        </Heading>
        <FormControl>
            <PasswordInput placeholder={"Old password"} required={true} />

        </FormControl>

        <FormControl>
            <PasswordInput placeholder={"New password"} required={true} />

        </FormControl>

        <FormControl>
            <PasswordInput placeholder={"Type new password again"} required={true}  />
        </FormControl>

        <Button type="submit" width={"100%"} colorScheme={"blue"}>
          Change
        </Button>
      </VStack>
    </>
  );
}
