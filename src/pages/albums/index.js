import AlbumCard from "@/components/ui/cards/AlbumCard";
import Layout from "@/components/ui/Layout";
import {
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { MdOutlineAddBox } from "react-icons/md";
import Link from "next/link";
import { useIsMounted } from "@/hooks/useIsMounted";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { getAccountAlbums } from "@/middlewares/account";
import { useEffect, useState } from "react";

export default function AlbumsPage({ albums }) {
  const { isMounted } = useIsMounted();

  const [userAlbums, setUserAlbums] = useState([]);

  useEffect(() => {
    setUserAlbums(albums);
  }, [albums]);
  return (
    <>
      <Layout>
        <Flex as="main" height={"100%"} flex={6} flexDirection={"column"}>
          <VStack width={"100%"}>
            <Flex
              as="header"
              width={"100%"}
              justifyContent={"space-between"}
              paddingY={2}
              paddingRight={4}
            >
              <Skeleton isLoaded={isMounted} rounded={"md"}>
                <Heading size={"lg"}>Albums</Heading>
              </Skeleton>

              <ButtonGroup variant={"ghost"}>
                <Link href={"/album/create"}>
                  <Skeleton isLoaded={isMounted} rounded={"md"}>
                    <Tooltip label="Create album">
                      <IconButton
                        icon={<MdOutlineAddBox />}
                        display={{ base: "flex", sm: "flex", md: "none" }}
                        rounded={"full"}
                      ></IconButton>
                    </Tooltip>
                    <Button
                      leftIcon={<MdOutlineAddBox />}
                      display={{ base: "none", sm: "none", md: "flex" }}
                    >
                      Create album
                    </Button>
                  </Skeleton>
                </Link>
              </ButtonGroup>
            </Flex>
          </VStack>

          <Divider />

          <Flex
            as={"section"}
            width={"100%"}
            height={"100%"}
            flexDirection={"column"}
          >
            <SimpleGrid
              columns={{ sm: 2, md: 3, lg: 4, xl: 5, "2xl": 8 }}
              className="albumsGrid"
            >
              {userAlbums.map((album) => (
                <AlbumCard key={album.id} data={album} />
              ))}
            </SimpleGrid>
          </Flex>
        </Flex>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  try {
    const session = await getServerSession(req, res, authOptions);

    const albums = await getAccountAlbums(session.user.accountId, "own");

    if (!albums) {
      return { redirect: { destination: "/404", permanent: false } };
    }

    return {
      props: {
        albums,
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/500",
        permanent: false,
      },
    };
  }
}
