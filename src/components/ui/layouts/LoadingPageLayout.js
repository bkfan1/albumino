import { Flex, Spinner, VStack } from "@chakra-ui/react";

export default function LoadingPageLayout() {
  return (
    <>
      <Flex alignItems={"center"} justifyContent={"center"} minHeight={"100vh"}>
        <VStack>
          <Spinner size={"xl"} color="#3182ce" />
        </VStack>
      </Flex>
    </>
  );
}
