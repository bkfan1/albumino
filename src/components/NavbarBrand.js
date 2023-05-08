import { Button, HStack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { SiGooglephotos } from "react-icons/si";

export default function NavbarBrand() {
  return (
    <>
      <Link href="/">
        <HStack fontWeight={"bold"}>
          <SiGooglephotos />

          <Text>Albumino</Text>
        </HStack>
      </Link>
    </>
  );
}
