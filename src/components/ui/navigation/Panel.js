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
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { BsCloud, BsPeople, BsPeopleFill } from "react-icons/bs";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdOutlinePhotoAlbum } from "react-icons/md";
import { useState } from "react";
import { useIsMounted } from "@/hooks/useIsMounted";

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
  const { isMounted } = useIsMounted();

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
        paddingX={1}
      >
        <ButtonGroup
          orientation="vertical"
          width={{ sm: "", md: "100%" }}
          marginTop={2}
        >
          {linkButtons.map(({ id, href, text, icon }) => (
            <Skeleton key={id} isLoaded={isMounted} rounded={"md"}>
              <Tooltip label={text}>
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
            </Skeleton>
          ))}
        </ButtonGroup>
        <Divider />

        <Skeleton isLoaded={isMounted} rounded={"md"}>
          <VStack paddingX={2}>
            <Tooltip label="Storaged used" display={{ sm: "flex", md: "none" }}>
              <VStack>
                <HStack>
                  <Icon as={BsCloud} />

                  <Heading size={"sm"} display={{ sm: "none", md: "flex" }}>
                    Storage
                  </Heading>
                </HStack>

                <Box width={"100%"}>
                  <Tooltip label="Storage used">
                    <Progress
                      value={50}
                      colorScheme={"blue"}
                      rounded={"full"}
                      display={{ sm: "none", md: "flex" }}
                    />
                  </Tooltip>
                  <Heading size={"xs"} display={{ sm: "flex", md: "none" }}>
                    0%
                  </Heading>
                </Box>
              </VStack>
            </Tooltip>

            <Text
              textAlign={"center"}
              display={{ sm: "none", md: "initial" }}
              fontSize={"sm"}
            >
              0.0 GB of 0.0 GB used
            </Text>
          </VStack>
        </Skeleton>
      </VStack>
    </>
  );
}
