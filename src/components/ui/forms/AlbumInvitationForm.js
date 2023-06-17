import {
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
import { useSession } from "next-auth/react";

export default function AlbumInvitationForm({ details }) {
  const { data: session, status } = useSession();

  const router = useRouter();
  const { invitation, author, album } = details;

  const { isMounted } = useIsMounted();
  const toast = useToast();

  const onSubmit = async () => {
    if (status === "unauthenticated") {
      return router.push("/signin");
    }

    try {
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
          maxWidth={"sm"}
          onSubmit={onSubmit}
          borderColor={"lightgray"}
          padding={2}
          gap={1}
        >
          <Heading size={"lg"} textAlign={"center"}>
            {author.name} invited you to:
          </Heading>
          <VStack>
            {album.cover ? (
              <Image
                src={album.cover}
                width={"100%"}
                height={"auto"}
                alt="Album cover"
              />
            ) : (
              ""
            )}
            <Heading size={"lg"} textAlign={"center"}>
              {album.name}
            </Heading>
          </VStack>
          <Button
            type="submit"
            width={"100%"}
            colorScheme="green"
            isDisabled={status === "loading" ? true : false}
          >
            Accept invitation
          </Button>
        </VStack>
      </Skeleton>
    </>
  );
}
