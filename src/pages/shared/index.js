import AlbumCard from "@/components/ui/cards/AlbumCard";
import { useIsMounted } from "@/hooks/useIsMounted";
import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Heading,
  IconButton,
  Image,
  SimpleGrid,
  Skeleton,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]";
import { getAccountAlbums } from "@/middlewares/account";
import AuthCommonLayout from "@/components/ui/layouts/AuthCommonLayout";
import CreateAlbumForm from "@/components/ui/forms/CreateAlbumForm";

export default function SharedAlbumsPage({ sharedAlbums }) {
  const { isMounted } = useIsMounted();
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
            {sharedAlbums.length > 0 ? (
              <>
                <SimpleGrid
                  columns={{ sm: 2, md: 3, lg: 4, xl: 5, "2xl": 8 }}
                  className="albumsGrid"
                >
                  {sharedAlbums.map((album) => (
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
