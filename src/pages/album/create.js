import CreateAlbumForm from "@/components/forms/CreateAlbumForm";
import Layout from "@/components/Layout";
import { Flex } from "@chakra-ui/react";

export default function CreateAlbumPage() {
  return (
    <>
      <Layout>
        <Flex flex={8} paddingRight={4}>
          <CreateAlbumForm />
        </Flex>
      </Layout>
    </>
  );
}
