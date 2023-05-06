import AlbumCard from "@/components/AlbumCard";
import Layout from "@/components/Layout";
import {
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  VStack,
} from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { MdOutlineAddBox } from "react-icons/md";
import { authOptions } from "../api/auth/[...nextauth]";
import connection from "@/database/connection";
import Album from "@/database/models/album";
import Photo from "@/database/models/photo"
import Link from "next/link";

export default function AlbumsPage({ albums }) {
  return (
    <>
      <Layout>
        <Flex as="main" flex={6} flexDirection={"column"}>
          <VStack width={"100%"}>
            <Flex
              as="header"
              width={"100%"}
              justifyContent={"space-between"}
              paddingY={2}
              paddingRight={4}
            >
              <Heading size={"lg"}>Albums</Heading>

              <ButtonGroup variant={"ghost"}>
                <Link href={"/album/create"}>
                <Button leftIcon={<MdOutlineAddBox />}>Create album</Button>

                </Link>
              </ButtonGroup>
            </Flex>
          </VStack>

          <Divider />

          <Grid width={"100%"} templateColumns='repeat(5, 1fr)' gap={6} className="albumsGrid">
            {albums.map((album) => (
              <GridItem key={album.id}>
                <AlbumCard  data={album} />
              </GridItem>
            ))}
          </Grid>
        </Flex>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);

  const db = await connection();
  const rawAlbums = await Album.find({author_account_id: session.user.accountId}).sort({updated_at: "desc"})

  const albums = [];
  for(const rawAlbum of rawAlbums){

    const length = await Photo.find({albums: rawAlbum._id}).count()

    albums.push({
      id: rawAlbum._id.toString(),
      name: rawAlbum.name,

      length,
    })

  }

  return {
    props: {
      albums,
    }
  }
  




}
