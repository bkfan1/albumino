import AlbumCard from "@/components/ui/cards/AlbumCard";
import { useIsMounted } from "@/hooks/useIsMounted";
import {
  ButtonGroup,
  Divider,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { getAccountAlbums } from "@/middlewares/account";
import AuthCommonLayout from "@/components/ui/layouts/AuthCommonLayout";
import CreateAlbumForm from "@/components/ui/forms/CreateAlbumForm";
import { useContext, useEffect } from "react";
import { AlbumsContext } from "@/contexts/AlbumsContext";
import { authOptions } from "../api/auth/[...nextauth]";

export default function SharedAlbumsPage({ sharedAlbums }) {
  const { albums, setAlbums } = useContext(AlbumsContext);
  const { isMounted } = useIsMounted();

  useEffect(() => {
    setAlbums(sharedAlbums);
  }, [sharedAlbums, setAlbums]);

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
                <Heading size={"lg"}>Shared albums</Heading>
              </Skeleton>

              <ButtonGroup variant={"ghost"}>
                <CreateAlbumForm />
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
            {albums.length > 0 ? (
              <>
                <SimpleGrid
                  columns={{ sm: 2, md: 3, lg: 4, xl: 5, "2xl": 8 }}
                  className="albumsGrid"
                  spacing={4}
                >
                  {albums.map((album) => (
                    <AlbumCard key={album.id} data={album} />
                  ))}
                </SimpleGrid>
              </>
            ) : (
              <VStack width={"100%"} height={"100%"}>
                <Image src={"/null_sharing_view.svg"} alt="" />
                <Text>Shared albums will appear here</Text>
              </VStack>
            )}
          </Flex>
        </Flex>
      </AuthCommonLayout>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  try {
    const session = await getServerSession(req, res, authOptions);

    const sharedAlbums = await getAccountAlbums(
      session.user.accountId,
      "shared"
    );

    if (!sharedAlbums) {
      return { redirect: { destination: "/404", permanent: false } };
    }

    return {
      props: {
        sharedAlbums,
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
