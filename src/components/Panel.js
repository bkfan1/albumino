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
  return (
    <>
      <VStack flex={1}>
        <ButtonGroup width={"100%"} orientation="vertical" variant={"ghost"}>
          {linkButtons.map(({ id, text, href, icon }) => (
            <Link key={id} href={href}>
              <Button leftIcon={icon}>{text}</Button>
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
