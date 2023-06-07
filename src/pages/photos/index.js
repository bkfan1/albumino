import Layout from "@/components/ui/Layout";
import MasonryGrid from "@/components/ui/masonry/MasonryGrid";
import { Flex } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { getAccountPhotos } from "@/middlewares/account";
import { useContext, useEffect } from "react";
import { PhotoVisorContext } from "@/contexts/PhotoVisorContext";

export default function PhotosPage({ photos }) {
  const { setVisorPhotos } = useContext(PhotoVisorContext);

  useEffect(() => {
    setVisorPhotos(photos);
  }, [photos, setVisorPhotos]);

  return (
    <>
      <Layout>
        <Flex as={"main"} flex={6} paddingRight={4} paddingTop={2}>
          <MasonryGrid></MasonryGrid>
        </Flex>
      </Layout>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  try {
    const session = await getServerSession(req, res, authOptions);
    const photos = await getAccountPhotos(session.user.accountId);

    return {
      props: {
        photos,
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
