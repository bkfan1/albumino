import CreateAlbumForm from "@/components/ui/forms/CreateAlbumForm";
import Layout from "@/components/ui/Layout";
import { Flex } from "@chakra-ui/react";

export default function CreateAlbumPage() {
  return (
    <>
        <Layout>
        <Flex minHeight={"100vh"} flex={8} padding={4}>
          <CreateAlbumForm />
        </Flex>
        </Layout>
    </>
  );
}
