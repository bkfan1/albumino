import { useDisableButtons } from "@/hooks/useDisableButtons";
import { regex } from "@/utils/regex";
import {
  Button,
  FormControl,
  Heading,
  Input,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useForm } from "react-hook-form";

export default function ChangeAccountEmailForm() {
  const { disableButtons, toggleDisableButtons } = useDisableButtons();
  const { register, handleSubmit } = useForm();

  const toast = useToast();

  const onSubmit = async (data) => {
    toggleDisableButtons();
    const res = axios.put("/api/account/email", data);
    toast.promise(res, {
      loading: { title: "Changing email..." },
      success: { title: "Email updated successfully" },
      error: { title: "An error occurred while trying to update email" },
    });

    await res;

    toggleDisableButtons();
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
          Change account email
        </Heading>
        <FormControl>
          <Input
            type="email"
            isRequired
            placeholder="Old email"
            {...register("oldEmail", {
              required: { value: true, message: "This field is required" },
              pattern: {
                value: regex.email,
                message: "Type a valid email address",
              },
            })}
          />
        </FormControl>

        <FormControl>
          <Input
            type="email"
            isRequired
            placeholder="New email"
            {...register("newEmail", {
              required: { value: true, message: "This field is required" },
              pattern: {
                value: regex.email,
                message: "Type a valid email address",
              },
            })}
          />
        </FormControl>

        <FormControl>
          <Input
            type="email"
            isRequired
            placeholder="Type new email again"
            {...register("confirmNewEmail", {
              required: { value: true, message: "This field is required" },
              pattern: {
                value: regex.email,
                message: "Type a valid email address",
              },
            })}
          />
        </FormControl>

        <Button type="submit" width={"100%"} colorScheme={"blue"} isDisabled={disableButtons}>
          Change
        </Button>
      </VStack>
    </>
  );
}
