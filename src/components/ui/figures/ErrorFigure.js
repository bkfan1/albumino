import { Button, Heading, VStack, Text } from "@chakra-ui/react";
import { MdWarning } from "react-icons/md";
import { useRouter } from "next/router";

export default function ErrorFigure({ description }) {
  const router = useRouter();
  return (
    <>
      <VStack>
        <Heading color={"yellow.500"} size={"2xl"}>
          <MdWarning></MdWarning>
        </Heading>
        <Heading>Error</Heading>
        <Text maxWidth={"2xl"} textAlign={"center"}>
          {description}
        </Text>
        <Button onClick={() => router.push("/")} colorScheme="blue">
          Back to app
        </Button>
      </VStack>
    </>
  );
}
