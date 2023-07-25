import AlbumCard from "@/components/ui/cards/AlbumCard";
import {
  ButtonGroup,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Skeleton,
  VStack,
} from "@chakra-ui/react";
import { useIsMounted } from "@/hooks/useIsMounted";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { getAccountAlbums } from "@/middlewares/account";
import { useContext, useEffect } from "react";
import { AlbumsContext } from "@/contexts/AlbumsContext";
import AuthCommonLayout from "@/components/ui/layouts/AuthCommonLayout";
import CreateAlbumForm from "@/components/ui/forms/CreateAlbumForm";

export default function AlbumsPage({ accountAlbums }) {
  const { isMounted } = useIsMounted();
  const { albums, setAlbums } = useContext(AlbumsContext);

  useEffect(() => {
    setAlbums(accountAlbums);
  }, [accountAlbums, setAlbums]);

  return (
    <>
      <AuthCommonLayout>
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
                <Skeleton isLoaded={isMounted} rounded={"md"}>
                  <CreateAlbumForm />
                </Skeleton>
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
              spacing={4}
            >
              {albums.map((album) => (
                <AlbumCard key={album.id} data={album} />
              ))}
            </SimpleGrid>
          </Flex>
        </Flex>
      </AuthCommonLayout>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  try {
    const session = await getServerSession(req, res, authOptions);

    const accountAlbums = await getAccountAlbums(session.user.accountId, "own");

    if (!accountAlbums) {
      return { redirect: { destination: "/404", permanent: false } };
    }

    return {
      props: {
        accountAlbums,
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
