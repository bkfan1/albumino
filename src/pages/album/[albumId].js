import {
  Flex,
  Text,
  Heading,
  AvatarGroup,
  Avatar,
  ButtonGroup,
  IconButton,
  HStack,
  VStack,
  Button,
} from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { BsCalendar, BsCalendarPlus, BsLink, BsPlus } from "react-icons/bs";
import { authOptions } from "../api/auth/[...nextauth]";
import connection from "@/database/connection";
import Album from "@/database/models/album";
import { nanoid } from "nanoid";
import Photo from "@/database/models/photo";
import PhotosGrid from "@/components/PhotosGrid";
import Layout from "@/components/Layout";
import { useRouter } from "next/router";

export default function AlbumPage({ album }) {
  const {
    // id,
    contributors,
    name,
    description,
    photos,
    created_at,
    updated_at,
  } = album;

  return (
    <>
      <Layout>
        <Flex width={"100%"} flexDirection={"column"} gap={6} paddingX={6}>
          <VStack as="header" width={"100%"}>
            <Heading width={"100%"}>{name}</Heading>
            <Heading width={"100%"} size={"sm"}>
              {description}
            </Heading>
            <VStack width={"100%"} color={"gray.600"}>
              <HStack width={"100%"}>
                <BsCalendar />
                <Text width={"100%"}>
                  Created: {new Date(created_at).toUTCString()}
                </Text>
              </HStack>
              <HStack width={"100%"}>
                <BsCalendarPlus />
                <Text width={"100%"}>
                  Last update {new Date(updated_at).toUTCString()}
                </Text>
              </HStack>
            </VStack>

            <HStack width={"100%"}>
              <AvatarGroup size={"sm"}>
                {contributors.map((avatar) => (
                  <Avatar key={nanoid()} size="sm" />
                ))}
              </AvatarGroup>
              <ButtonGroup>
                <IconButton icon={<BsLink />} borderRadius={"full"} />

                <IconButton icon={<BsPlus />} borderRadius={"full"} />
              </ButtonGroup>
            </HStack>
          </VStack>
          <PhotosGrid photos={photos} />
        </Flex>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req, res, params }) {
  const session = await getServerSession(req, res, authOptions);

  const db = await connection();
  const { _id, name, contributors, created_at, updated_at } =
    await Album.findById(params.albumId);

  const albumPhotos = await Photo.find({ albums: _id });

  const album = {
    id: _id.toString(),
    contributors,
    name,
    photos: albumPhotos.map((photo) => ({
      id: photo._id.toString(),
      albums: photo.albums.map((albumId) => albumId.toString()),
      url: photo.url,
    })),
    created_at: `${created_at}`,
    updated_at: `${updated_at}`,
  };

  return {
    props: {
      album,
    },
  };
}
