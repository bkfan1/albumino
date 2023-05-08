import {
  Button,
  ButtonGroup,
  Divider,
  Heading,
  Progress,
  Text,
  VStack,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineSearch } from "react-icons/ai";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdOutlinePeopleAlt, MdOutlinePhotoAlbum } from "react-icons/md";

const linkButtons = [
  {
    id: nanoid(),
    text: "Photos",
    href: "/photos",
    icon: <HiOutlinePhotograph />,
  },
  {
    id: nanoid(),
    text: "Albums",
    href: "/albums",
    icon: <MdOutlinePhotoAlbum />,
  },
];

export default function Panel() {

  const router = useRouter();
  const {pathname} = router;

  return (
    <>
      <VStack flex={1} borderRight={"1px"} borderColor={"#edf1f5"}>
        <ButtonGroup width={"100%"} orientation="vertical" variant={"ghost"} marginTop={2}>
          {linkButtons.map(({ id, text, href, icon }) => (
            <Link key={id} href={href}>
              <Button leftIcon={icon} width={"100%"} color={href === pathname ? "#2178e8" : ""} backgroundColor={href === pathname ? "#e8f0fe" : ""} >{text}</Button>
            </Link>
          ))}
        </ButtonGroup>

        <Divider />

        <Heading size={"sm"}>Storage</Heading>
        <Progress value={80} min={0} max={100} colorScheme="green" size="sm" />
        <Text fontSize={"sm"}>You have used 1.1 GB of 15 GB</Text>
      </VStack>
    </>
  );
}
