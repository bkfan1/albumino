import Link from "next/link";
import { HStack, Icon, Skeleton, Text, VStack } from "@chakra-ui/react";
import { BsEnvelopeFill, BsGithub, BsLinkedin } from "react-icons/bs";
import { useIsMounted } from "@/hooks/useIsMounted";

export default function Footer() {
  const { isMounted } = useIsMounted();
  return (
    <>
      <VStack
        width={"100%"}
        borderTop={"1px"}
        borderColor={"#edf1f5"}
        paddingY={2}
        as="footer"
      >
        <Skeleton isLoaded={isMounted}>
          <Text>
            Created by Jackson Paredes Ferranti (
            <Link href="github.com/bkfan1" title="Github profile">
              @bkfan1
            </Link>
            )
          </Text>
        </Skeleton>
        <Skeleton isLoaded={isMounted}>
          <HStack>
            <Link href="https://www.github.com/bkfan1/albumino">
              <Icon as={BsGithub} title="Source code" />
            </Link>
            <Link href={"mailto:jpf8296@gmail.com"}>
              <Icon as={BsEnvelopeFill} title="Send an email to bkfan1" />
            </Link>
          </HStack>
        </Skeleton>
      </VStack>
    </>
  );
}
