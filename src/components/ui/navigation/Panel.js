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
import { BsCloud, BsFillPeopleFill } from "react-icons/bs";
import { HiOutlinePhotograph } from "react-icons/hi";
import { MdOutlinePhotoAlbum } from "react-icons/md";
import { useIsMounted } from "@/hooks/useIsMounted";
import { useEffect, useState } from "react";
import axios from "axios";

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
  {
    id: nanoid(),
    text: "Shared",
    href: "/shared",
    icon: <BsFillPeopleFill />,
  },
];

export default function Panel() {
  const router = useRouter();
  const { pathname } = router;
  const { isMounted } = useIsMounted();

  const [storage, setStorage] = useState(null);

  useEffect(() => {
    const fetchStorageValue = () => {
      const req = axios.get(`/api/account/storage`);
      req
        .then((res) => {
          setStorage(res.data.storage);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchStorageValue();
  }, [pathname]);

  const storageValueLoaded = storage !== null ? true : false;

  return (
    <>
      <VStack
        as={"aside"}
        flex={{ base: 0.5, md: 1 }}
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
                    display={{ base: "none", sm: "none", md: "initial" }}
                    width={"100%"}
                    variant={"ghost"}
                    leftIcon={icon}
                  >
                    {text}
                  </Button>
                  <IconButton
                    display={{ base: "flex", sm: "flex", md: "none" }}
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
            <Tooltip label="Storage used" display={{ sm: "flex", md: "none" }}>
              <VStack>
                <HStack>
                  <Icon as={BsCloud} />

                  <Heading size={"sm"} display={{ base: "none", md: "flex" }}>
                    Storage
                  </Heading>
                </HStack>

                <Box width={"100%"}>
                  <Tooltip
                    label={`${
                      storageValueLoaded ? storage.used.percent.toFixed(1) : ""
                    }% used`}
                  >
                    <Progress
                      value={storageValueLoaded ? storage.used.percent : ""}
                      isIndeterminate={!storageValueLoaded}
                      colorScheme={"blue"}
                      rounded={"full"}
                      display={{ base: "none", md: "flex" }}
                    />
                  </Tooltip>
                  <Heading
                    size={"xs"}
                    width={"100%"}
                    display={{ sm: "flex", md: "none" }}
                    textAlign={"center"}
                  >
                    {storageValueLoaded ? storage.used.percent.toFixed(1) : ""}%
                  </Heading>
                </Box>
              </VStack>
            </Tooltip>

            {storageValueLoaded ? (
              <Skeleton isLoaded={isMounted}>
                <Text
                  textAlign={"center"}
                  display={{ base: "none", md: "initial" }}
                  fontSize={"sm"}
                >
                  {storage.used.mb.toFixed(1)} MB of 100 MB used
                </Text>
              </Skeleton>
            ) : (
              ""
            )}
          </VStack>
        </Skeleton>
      </VStack>
    </>
  );
}
