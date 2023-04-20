import { Button, Text } from "@chakra-ui/react";
import Link from "next/link";
import { HiOutlinePhotograph } from "react-icons/hi";

export default function NavbarBrand() {
  return (
    <>
      <Link href="/">
      <Button variant={"link"}>
        <HiOutlinePhotograph/>

        <Text>Albumino</Text>
      </Button>
      </Link>
    </>
  );
}
