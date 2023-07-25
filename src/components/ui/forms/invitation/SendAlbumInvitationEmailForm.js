import { regex } from "@/utils/regex";
import {
  Button,
  FormControl,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export default function SendAlbumInvitationEmailForm() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const { query } = router;
  const { albumId } = query;

  const toast = useToast();

  const onSubmit = async (data) => {
    const res = axios.post(`/api/album/${albumId}/invitations`, {
      ...data,
      sendEmail: true,
    });

    toast.promise(res, {
      loading: { title: "Sending invitation email..." },
      success: { title: "Invitation email sent succesfully" },
      error: {
        title: "An error occurred while attempting to send invitation email",
      },
    });
  };

  return (
    <>
      <VStack as={"form"} onSubmit={handleSubmit(onSubmit)}>
        <VStack width={"100%"}>
          <Heading width={"100%"} size={"md"}>
            Send email
          </Heading>
          <Text width={"100%"}>Send an email with an invitation link</Text>
        </VStack>
        <FormControl>
          <Input
            type="email"
            {...register("email", {
              required: { value: true, message: "This field is required" },
              pattern: {
                value: regex.email,
                message: "Type a valid email address",
              },
            })}
            placeholder="Type an email address"
            isRequired
          />
        </FormControl>

        <Button width={"100%"} colorScheme="green" type="submit">
          Send
        </Button>
      </VStack>
    </>
  );
}
