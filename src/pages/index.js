import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  VStack,
  Image,
  Text,
} from "@chakra-ui/react";
import NavbarBrand from "@/components/ui/navigation/NavbarBrand";
import Link from "next/link";
import Footer from "@/components/ui/Footer";
import { useIsNavbarFixed } from "@/hooks/useIsNavbarFixed";

export default function Home() {
  const { isNavbarFixed } = useIsNavbarFixed();
  return (
    <>
      <Flex
        as="nav"
        width={"100%"}
        alignItems={"center"}
        justifyContent={"space-between"}
        paddingX={4}
        paddingY={4}
        top={0}
        left={0}
        right={0}
        zIndex={10}
        backgroundColor={"white"}
        boxShadow={"md"}
        position={isNavbarFixed ? "fixed" : ""}
      >
        <NavbarBrand />
        <ButtonGroup spacing={4}>
          <Link href={"/signup"}>
            <Button colorScheme="blue">Sign Up</Button>
          </Link>
          <Link href={"/signin"}>
            <Button> Log In</Button>
          </Link>
        </ButtonGroup>
      </Flex>

      <Flex
        as="main"
        flexDirection={"column"}
        backgroundImage={`url("/bg_home.png")`}
        backgroundSize={"contain"}
        minHeight={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <VStack
          width={"xl"}
          py={10}
          backgroundColor={"white"}
          shadow={"2xl"}
          alignItems={"center"}
          justifyContent={"center"}
          rounded={"lg"}
        >
          <Image src="/empty_state_album.svg" alt="" />

          <Heading>Your memories in one place</Heading>
          <Text color={"gray.600"}>
            Share albums and photos with your friends and family
          </Text>
          <Link href={"/photos"}>
            <Button mt={2} colorScheme="blue">
              Go to Albumino
            </Button>
          </Link>
        </VStack>
      </Flex>
      <Footer />
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
