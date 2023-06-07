import { Button, Heading, VStack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export default function AlbumInvitationForm({details}) {
    const { invitation, author, album } = details;

  const { handleSubmit } = useForm();
  const router = useRouter();
  const toast = useToast();

  const onSubmit = async () => {
    try {
      const data = {
        status: "accepted",
      };
      const res = await axios.put(
        `/api/album/${album.id}/invitation/${invitation.id}`,
        data
      );
      toast({
        status: "success",
        title: "Joined to album",
        description: "You have successfully joined the album.",
      });
      router.push(`/album/${album.id}`);
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
      <VStack
        as={"form"}
        maxWidth={"sm"}
        onSubmit={handleSubmit(onSubmit)}
        border={"1px"}
        borderColor={"lightgray"}
        padding={2}
      >
        <VStack>
          <Heading size={"lg"} textAlign={"center"}>
            {author.name} invited you to {album.name}
          </Heading>
        </VStack>
        <Button type="submit" width={"100%"} colorScheme="green">
          Accept invitation
        </Button>
      </VStack>
    </>
  );
}
