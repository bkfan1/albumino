import { useDisableButtons } from "@/hooks/useDisableButtons";
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

export default function ChangeAccountPasswordForm() {
  const {disableButtons, toggleDisableButtons} = useDisableButtons();
  const { register, handleSubmit } = useForm();

  const toast = useToast();

  const onSubmit = async (data) => {
    toggleDisableButtons();
    const res = axios.put("/api/account/password", data);
    toast.promise(res, {
      loading: { title: "Changing password..." },
      success: { title: "Password updated successfully" },
      error: { title: "An error occurred while trying to update password" },
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
          Change account password
        </Heading>
        <FormControl>
          <Input
            type="password"
            {...register("oldPassword", {
              required: { value: true, message: "This field is required" },
            })}
            placeholder="Old password"
          />
        </FormControl>

        <FormControl>
          <Input
            type="password"
            {...register("newPassword", {
              required: { value: true, message: "This field is required" },
              minLength: {
                value: 8,
                message: "Password has to be at least 8 characters long",
              },
            })}
            placeholder="New password"
          />
        </FormControl>

        <FormControl>
          <Input
            type="password"
            {...register("confirmNewPassword", {
              required: { value: true, message: "This field is required" },
              minLength: {
                value: 8,
                message: "Password has to be at least 8 characters long",
              },
            })}
            placeholder="Type new password again"
          />
        </FormControl>

        <Button type="submit" width={"100%"} colorScheme={"blue"} isDisabled={disableButtons}>
          Change
        </Button>
      </VStack>
    </>
  );
}
