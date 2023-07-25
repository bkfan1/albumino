import {
  Button,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";

export default function GenerateInvitationLinkForm() {
  const { handleSubmit } = useForm();
  const { onCopy, value, setValue, hasCopied } = useClipboard("");

  const router = useRouter();
  const toast = useToast();
  const { query } = router;
  const { albumId } = query;

  const onSubmit = async () => {
    const data = { sendEmail: false };
    const res = axios.post(`/api/album/${albumId}/invitations`, data);

    toast.promise(res, {
      loading: { title: "Generating invitation link..." },
      success: { title: "Invitation link generated succesfully" },
      error: {
        title: "An error occurred while attempting to generate invitation link",
      },
    });

    const invitationLink = (await res).data.invitationLink;
    setValue(invitationLink);
  };

  return (
    <>
      <VStack as={"form"} gap={2} onSubmit={handleSubmit(onSubmit)}>
        <VStack width={"100%"}>
          <Heading size={"md"} width={"100%"}>
            Generate link
          </Heading>
          <Text width={"100%"}>
            Click in button to generate an invitation link (one use only)
          </Text>
        </VStack>
        <Flex width={"100%"}>
          <Input
            placeholder={"Invitation link goes here"}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            mr={2}
          />
          <Button onClick={onCopy} isDisabled={value === "" ? true : false}>
            {hasCopied ? "Copied!" : "Copy"}
          </Button>
        </Flex>
        <Button type="submit" width={"100%"} colorScheme="green">
          Generate
        </Button>
      </VStack>
    </>
  );
}
