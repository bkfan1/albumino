import AlbumCard from "@/components/AlbumCard";
import Layout from "@/components/Layout";
import {
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Skeleton,
  VStack,
} from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { MdOutlineAddBox } from "react-icons/md";
import { authOptions } from "../api/auth/[...nextauth]";
import connection from "@/database/connection";
import Album from "@/database/models/album";
import Link from "next/link";
import { useIsMounted } from "@/hooks/useIsMounted";

export default function AlbumsPage({ ownAlbums, sharedAlbums }) {
  const { isMounted } = useIsMounted();
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
                    <Button leftIcon={<MdOutlineAddBox />}>Create album</Button>
                  </Skeleton>
                </Link>
              </ButtonGroup>
            </Flex>
          </VStack>

          <Divider />

          <Flex as={"section"} width={"100%"} height={"100%"} flexDirection={"column"}>

            <SimpleGrid
              columns={{ sm: 2, md: 3, lg: 4, xl: 5, "2xl": 8 }}
              className="albumsGrid"
            >
              {ownAlbums.map((album) => (
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
  const session = await getServerSession(req, res, authOptions);

  const rawOwnAlbums = await Album.find({
    author_account_id: session.user.accountId,
  });
  const rawSharedAlbums = await Album.find({
    contributors: session.user.accountId,
  });

  return {
    props: {
      ownAlbums: rawOwnAlbums.map(({ _id, name }) => ({
        id: _id.toString(),
        name,
      })),
      sharedAlbums: rawSharedAlbums.map(({ _id, name }) => ({
        id: _id.toString(),
        name,
      })),
    },
  };
}
