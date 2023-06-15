import {
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  FormHelperText,
  Heading,
  Input,
  Text,
  VStack,
  useClipboard,
} from "@chakra-ui/react";

export default function GenerateInvitationLinkForm() {
  const placeholder = "Invitation link goes here";
  const { onCopy, value, setValue, hasCopied } = useClipboard("");
  return (
    <>
    <VStack gap={2}>
        <VStack width={"100%"}>
        <Heading size={"md"} width={"100%"}>Generate link</Heading>
        <Text width={"100%"}>Click in button to generate an invitation link (one use only)</Text>
        </VStack>
    <Flex width={"100%"}>
    <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          mr={2}
        />
        <Button onClick={onCopy}>{hasCopied ? "Copied!" : "Copy"}</Button>
    </Flex>
    <Button width={"100%"} colorScheme="green">Generate</Button>
    </VStack>

    </>
  );
}
