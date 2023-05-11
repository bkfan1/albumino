import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  HStack,
  Heading,
  Icon,
  IconButton,
  Progress,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsCloud } from "react-icons/bs";
import { HiOutlinePhotograph } from "react-icons/hi";
import {
  MdOutlinePhotoAlbum,
} from "react-icons/md";

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
  const { pathname } = router;

  return (
    <>
      <VStack
        flex={{ sm: 0.5, md: 1 }}
        minHeight={"100%"}
        borderRight={"1px"}
        borderColor={"#edf1f5"}
        backgroundColor={"white"}
        className="panel"
        gap={2}
      >
        <ButtonGroup
          orientation="vertical"
          width={{ sm: "", md: "100%" }}
          marginTop={2}
        >
          {linkButtons.map(({ id, href, text, icon }) => (
            <Tooltip key={id} label={text}>
              <Link href={href}>
                <Button
                  display={{ sm: "none", md: "initial" }}
                  width={"100%"}
                  variant={"ghost"}
                  leftIcon={icon}
                >
                  {text}
                </Button>
                <IconButton
                  display={{ base: "none", sm: "flex", md: "none" }}
                  icon={icon}
                  rounded={"full"}
                  variant={"ghost"}
                  size={{ base: "lg" }}
                />
              </Link>
            </Tooltip>
          ))}
        </ButtonGroup>
        <Divider />

        <VStack paddingX={2}>
          <HStack>
            <Icon as={BsCloud} />

            <Heading size={"sm"} display={{ sm: "none", md: "flex" }}>
              Storage
            </Heading>
          </HStack>

          <Box width={"100%"}>
            <Progress value={50} colorScheme={"blue"} rounded={"full"} display={{sm:"none", md:"flex"}} />
            <Heading size={"xs"} display={{sm:"flex",md:"none"}}>0%</Heading>
          </Box>

          <Text
            textAlign={"center"}
            display={{ sm: "none", md: "initial" }}
            fontSize={"sm"}
          >
            0.0 GB of 0.0 GB used
          </Text>
        </VStack>
      </VStack>
    </>
  );
}
