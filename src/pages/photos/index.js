import Layout from "@/components/ui/Layout";
import MasonryGrid from "@/components/ui/masonry/MasonryGrid";
import { Flex } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { getAccountPhotos } from "@/middlewares/account";

export default function PhotosPage({ photos }) {
  return (
    <>
      <Layout>
        <Flex as={"main"} flex={6} paddingRight={4} paddingTop={2}>
            <MasonryGrid photos={photos} />
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
