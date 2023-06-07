import { useIsMounted } from "@/hooks/useIsMounted";
import { Button, HStack, Skeleton, Text } from "@chakra-ui/react";
import Link from "next/link";
import { SiGooglephotos } from "react-icons/si";

export default function NavbarBrand() {
  const {isMounted} = useIsMounted();
  return (
    <>
      <Link href="/">
        <Skeleton isLoaded={isMounted} paddingY={2} rounded={"md"}>
        <HStack fontWeight={"bold"}>
          <SiGooglephotos />

          <Text>Albumino</Text>
        </HStack>
        </Skeleton>
      </Link>
    </>
  );
}
