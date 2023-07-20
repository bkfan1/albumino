import { HStack, Heading, Icon, Text, VStack } from "@chakra-ui/react";

export default function PhotoDetailBox({ icon, headingText, descriptionText }) {
  return (
    <>
      <VStack width={"100%"}>
        <HStack width={"100%"} position={"relative"}>
          <Icon as={icon} />
          <Heading size={"sm"} fontWeight={"normal"}>
            {headingText}
          </Heading>
        </HStack>

        <Text width={"100%"}>{descriptionText}</Text>
      </VStack>
    </>
  );
}
