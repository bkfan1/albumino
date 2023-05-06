import { Button, Text } from "@chakra-ui/react";
import Link from "next/link";
import {SiGooglephotos} from "react-icons/si";

export default function NavbarBrand() {
  return (
    <>
      <Link href="/">
      <Button variant={"link"}>
        <SiGooglephotos />

        <Text>Albumino</Text>
      </Button>
      </Link>
    </>
  );
}
