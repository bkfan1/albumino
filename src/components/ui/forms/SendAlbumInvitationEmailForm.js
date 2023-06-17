import {
  Box,
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

    try {
      const resPromise = axios.post(`/api/album/${albumId}/invitation`, {
        ...data,
        sendEmail: true,
      });

      toast.promise(resPromise, {
        loading: {title:"Sending invitation email..."},
        success: {title:"Invitation email sent succesfully"},
        error:{title:"An error occurred while attempting to send invitation email"}
      })

      await resPromise;

    } catch (error) {
      toast({
        status:"error",
        title:"An error occurred while attempting to send invitation email"
      })
    }
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
          <Input type="email" {...register("email")} placeholder="Email" />
        </FormControl>

        <Button width={"100%"} colorScheme="green" type="submit">
          Send
        </Button>
      </VStack>
    </>
  );
}
