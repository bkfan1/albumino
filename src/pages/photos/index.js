import Layout from "@/components/Layout";
import PhotosGrid from "@/components/PhotosGrid";
import { Flex } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import connection from "@/database/connection";
import Photo from "@/database/models/photo";
import { authOptions } from "../api/auth/[...nextauth]";

export default function PhotosPage({ photos }) {
  return (
    <>
      <Layout>
        <Flex flex={6} paddingRight={4} paddingTop={2}>
          <PhotosGrid photos={photos}></PhotosGrid>
        </Flex>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await getServerSession(req, res, authOptions);

  const db = await connection();

  const rawPhotos = await Photo.find({
    author_account_id: session.user.accountId,
  }).sort({ uploaded_at: "desc" });

  const photos = [];
  for (const rawPhoto of rawPhotos) {
    photos.push({
      id: rawPhoto._id.toString(),
      albums: rawPhoto.albums.map((albumId) => albumId.toString()),
      url: rawPhoto.url,
    });
  }

  return {
    props: {
      photos,
    },
  };
}
