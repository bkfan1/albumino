import { useIsMounted } from "@/hooks/useIsMounted";
import { HStack, Icon, Skeleton, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SiGooglephotos } from "react-icons/si";

export default function NavbarBrand() {
  const { isMounted } = useIsMounted();
  const router = useRouter();
  const { pathname } = router;

  const inSignPage = pathname === "/signin" || pathname === "/signup";

  return (
    <>
      <Link href="/">
        <Skeleton isLoaded={isMounted} paddingY={2} rounded={"md"}>
          <HStack fontWeight={"bold"}>
            <Icon as={SiGooglephotos} boxSize={6}></Icon>

            <Text
              fontSize={
                inSignPage || pathname === "/invitation/[invitationId]"
                  ? "2xl"
                  : ""
              }
            >
              Albumino
            </Text>
          </HStack>
        </Skeleton>
      </Link>
    </>
  );
}
