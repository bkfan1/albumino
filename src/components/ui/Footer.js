import Link from "next/link";
import {
  HStack,
  Icon,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { BsEnvelopeFill, BsGithub } from "react-icons/bs";
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
            <Tooltip label="Github profile">
            <Link href="https://www.github.com/bkfan1" >
              @bkfan1
            </Link>
            </Tooltip>
            )
          </Text>
        </Skeleton>
        <Skeleton isLoaded={isMounted}>
          <HStack>
            <Tooltip label="Github repository">
              <Link href="https://www.github.com/bkfan1/albumino">
                <Icon as={BsGithub} />
              </Link>
            </Tooltip>

            <Tooltip label="Send an email to bkfan1">
              <Link href={"mailto:jpf8296@gmail.com"}>
                <Icon as={BsEnvelopeFill}/>
              </Link>
            </Tooltip>
          </HStack>
        </Skeleton>
      </VStack>
    </>
  );
}
