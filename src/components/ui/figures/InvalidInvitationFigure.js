import { Button, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { AiOutlineWarning } from "react-icons/ai";

export default function InvalidInvitationFigure() {
  const router = useRouter();

  return (
    <>
      <VStack
        maxWidth={"400px"}
        bgColor={"gray.100"}
        p={2}
        rounded={"md"}
        spacing={4}
        my={4}
      >
        <VStack spacing={2}>
          <Icon as={AiOutlineWarning} boxSize={42} />
          <Heading size={"lg"}>Invalid invitation</Heading>
          <Text textAlign={"center"}>
            This invitation may expired, or you might not have permission to
            join.
          </Text>
        </VStack>

        <Button
          onClick={() => router.push("/")}
          width={"full"}
          colorScheme="blue"
        >
          Continue to Albumino
        </Button>
      </VStack>
    </>
  );
}
