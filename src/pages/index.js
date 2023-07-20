import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { Button, ButtonGroup, Flex, Heading } from "@chakra-ui/react";
import NavbarBrand from "@/components/ui/navigation/NavbarBrand";

export default function Home() {
  return (
    <>
      <Flex
        alignItems={"center"}
        justifyContent={"space-between"}
        width={"100%"}
      >
        <NavbarBrand />
        <ButtonGroup>
          <Button colorScheme="blue">Sign Up</Button>
          <Button variant={"ghost"}> Log In</Button>
        </ButtonGroup>
      </Flex>
      <Flex minHeight={"100vh"}>
        <Heading>Upload photos and share albums</Heading>
      </Flex>
    </>
  );
}

export async function getServerSideProps({ req, res }) {
  try {
    const session = await getServerSession(req, res, authOptions);

    if (session) {
      return {
        redirect: {
          destination: "/photos",
          permanent: false,
        },
      };
    }

    return {
      props: {},
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
