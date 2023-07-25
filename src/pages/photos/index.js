import MasonryGrid from "@/components/ui/masonry/MasonryGrid";
import { Flex } from "@chakra-ui/react";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { getAccountPhotos } from "@/middlewares/account";
import { MasonryGridProvider } from "@/contexts/MasonryGridContext";
import PhotoVisor from "@/components/ui/visor/PhotoVisor";
import PhotosPageLayout from "@/components/ui/layouts/PhotosPageLayout";
import { PhotoVisorProvider } from "@/contexts/PhotoVisorContext";

export default function PhotosPage({ photos }) {
  return (
    <>
      <PhotoVisorProvider>
        <MasonryGridProvider photos={photos}>
          <PhotosPageLayout>
            <Flex as={"main"} flex={6} paddingRight={4} paddingTop={2}>
              <MasonryGrid />
              <PhotoVisor />
            </Flex>
          </PhotosPageLayout>
        </MasonryGridProvider>
      </PhotoVisorProvider>
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
