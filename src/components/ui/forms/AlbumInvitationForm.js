import {
  Box,
  Button,
  HStack,
  Heading,
  Image,
  Skeleton,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import axios from "axios";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useSession } from "next-auth/react";

export default function AlbumInvitationForm({ details }) {
  const { data: session, status } = useSession();

  const router = useRouter();
  const { invitation, author, album } = details;

  const { isMounted } = useIsMounted();
  const toast = useToast();

  const onSubmit = async () => {
    try {

      if (status === "unauthenticated") {
        return router.push("/signin");
      }

      const data = {
        status: "accepted",
      };

      const submitPromise = axios.put(
        `/api/album/${album.id}/invitation/${invitation.id}`,
        data
      );

      toast.promise(submitPromise, {
        loading: { title: "Joining to album..." },
        success: { title: "Joined to album successfully" },
        error: {
          title: "An error occurred while trying to accept the invitation",
        },
      });

      await submitPromise;

      return router.push(`/album/${album.id}`);

    } catch (error) {
      console.log(error);

      toast({
        status: "error",
        title: "Error",
        description:
          "Something went wrong while trying to accept the invitation",
      });
    }
  };
  return (
    <>
      <Skeleton isLoaded={isMounted}>
        <VStack
          as={"form"}
          width={"360px"}
          onSubmit={onSubmit}
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
              <Heading size={"sm"} textAlign={"center"} fontWeight={"normal"}>
                {author.name} invited you to join
              </Heading>

              <Heading size={"lg"} textAlign={"center"}>
                {album.name}
              </Heading>
            </VStack>
          </VStack>
          <Button
            type="submit"
            width={"100%"}
            colorScheme="blue"
            isDisabled={status === "loading" ? true : false}
          >
            Accept invitation
          </Button>
        </VStack>
      </Skeleton>
    </>
  );
}
