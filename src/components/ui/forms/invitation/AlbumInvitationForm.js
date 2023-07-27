import {
  Box,
  Button,
  Heading,
  Image,
  Skeleton,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import axios from "axios";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useForm } from "react-hook-form";
import { useDisableButtons } from "@/hooks/useDisableButtons";

export default function AlbumInvitationForm({ details }) {
  const { invitation, album } = details;

  const { isMounted } = useIsMounted();

  const { disableButtons, toggleDisableButtons } = useDisableButtons();
  const { handleSubmit } = useForm();
  const router = useRouter();

  const toast = useToast();

  const onSubmit = async () => {
    toggleDisableButtons();
    const res = axios.put(
      `/api/album/${album.id}/invitations/${invitation.id}`
    );

    toast.promise(res, {
      loading: {
        title: "Joining to album...",
      },
      success: {
        title: "Joined to album successfully",
        description: "Redirecting to album...",
      },
      error: {
        title: "Error",
        description: "An error occurred while trying to accept the invitation",
      },
    });

    await res;

    await router.push(`/album/${album.id}/`);
  };

  return (
    <>
      <Skeleton isLoaded={isMounted}>
        <VStack
          as={"form"}
          width={"360px"}
          onSubmit={handleSubmit(onSubmit)}
          rounded={"md"}
          borderColor={"lightgray"}
          py={4}
          px={2}
          gap={1}
          my={2}
          backgroundColor={"gray.50"}
        >
          <VStack width={"100%"}>
            <Box
              width={"80px"}
              backgroundColor={"lightgray"}
              borderRadius={"md"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {album.cover ? (
                <Image
                  src={album.cover}
                  width={"100%"}
                  height={"auto"}
                  alt="Album cover"
                  rounded={"md"}
                />
              ) : (
                ""
              )}
            </Box>

            <VStack width={"100%"}>
              <Heading size={"lg"} textAlign={"center"}>
                {album.name}
              </Heading>
            </VStack>
          </VStack>
          <Button
            type="submit"
            width={"100%"}
            colorScheme="blue"
            isDisabled={disableButtons}
          >
            Join album
          </Button>
        </VStack>
      </Skeleton>
    </>
  );
}
