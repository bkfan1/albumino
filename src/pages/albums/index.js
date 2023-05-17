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
import Photo from "@/database/models/photo";
import Link from "next/link";
import { useIsMounted } from "@/hooks/useIsMounted";

export default function AlbumsPage({ albums }) {
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

          <SimpleGrid
            columns={{ sm: 2, md: 3, lg: 4, xl: 5, "2xl": 8 }}
            className="albumsGrid"
          >
            {albums.map((album) => (
              <AlbumCard key={album.id} data={album} />
            ))}
          </SimpleGrid>
        </Flex>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);

  const db = await connection();
  const rawAlbums = await Album.find({
    author_account_id: session.user.accountId,
  }).sort({ updated_at: "desc" });

  const albums = [];
  for (const rawAlbum of rawAlbums) {
    const length = await Photo.find({ albums: rawAlbum._id }).count();

    albums.push({
      id: rawAlbum._id.toString(),
      name: rawAlbum.name,

      length,
    });
  }

  return {
    props: {
      albums,
    },
  };
}
