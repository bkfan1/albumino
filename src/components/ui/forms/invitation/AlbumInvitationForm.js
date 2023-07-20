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

export default function AlbumInvitationForm({ details }) {
  const router = useRouter();
  const { invitation, author, album } = details;

  const { isMounted } = useIsMounted();
  const toast = useToast();

  const onSubmit = async () => {
    const res = axios.put(`/api/album/${album.id}/invitation/${invitation.id}`);

    toast.promise(res, {
      loading: { title: "Joining to album..." },
      success: { title: "Joined to album successfully" },
      error: {
        title: "An error occurred while trying to accept the invitation",
      },
    });

    router.push(`/album/${album.id}/`);
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

              <Heading size={"lg"} textAlign={"center"}>
                {album.name}
              </Heading>
            </VStack>
          </VStack>
          <Button type="submit" width={"100%"} colorScheme="blue">
            Join album
          </Button>
        </VStack>
      </Skeleton>
    </>
  );
}
